using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using pollor.Server.Models;
using pollor.Server.Services;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Security.Principal;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.Authorization;
using pollor.Server.Controllers;
using System.Data;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }


    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterModel registerUser)
    {
        if (registerUser is null)
        {
            return BadRequest(new { message = "Invalid client request" });
        }

        if (registerUser.password!.Length < 8) {
            return BadRequest(new { message = "Password must be longer than 8 characters." });
        }

        bool isUsernameAvailable = new PollorDbContext().UserAuthModel.Where(u => u.username!.ToLower().Equals(registerUser.username!.ToLower())).IsNullOrEmpty();
        if (isUsernameAvailable == false) {
            return BadRequest(new { message = "Username is already taken, please login or use another username." });
        }

        bool isEmailAvailable = new PollorDbContext().UserAuthModel.Where(u => u.emailaddress!.ToLower().Equals(registerUser.emailaddress!.ToLower())).IsNullOrEmpty();
        if (isEmailAvailable == false) {
            return BadRequest(new { message = "Emailaddress is already taken, please login or use another emailaddress." });
        }

        var hasher = new PasswordHasher<RegisterModel>();
        var hashedPass = hasher.HashPassword(registerUser, registerUser.password!);
        UserAuthModel tempUser = new UserAuthModel() {
            username = registerUser.username,
            password = hashedPass,
            emailaddress = registerUser.emailaddress,
            created_at = DateTime.Now,
        };

        try
        {
            using (var context = new PollorDbContext())
            {
                // Create new user
                EntityEntry<UserAuthModel> createdUser = context.UserAuthModel.Add(tempUser);
                context.SaveChanges();

                // Get full user data
                UserModel? newUser = context.Users
                    .Where(u => u.id.Equals(createdUser.Entity.id) &&
                            u.username!.Equals(createdUser.Entity.username) &&
                            u.emailaddress!.Equals(createdUser.Entity.emailaddress))
                    .FirstOrDefault();
                if (newUser == null)
                {
                    return NotFound(new { message = "User not found..." });
                }
                var tokeOptions = GetJwtTokenOptions(1, newUser);
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Created("user/" + newUser.id, new AuthenticatedResponse { token = tokenString, user = newUser });

            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return StatusCode(500, new { message = ex.Message });
        }
    }


    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel loginUser)
    {
        if (loginUser is null)
        {
            return BadRequest(new { message = "Invalid client request" });
        }

        var authUser = new PollorDbContext().UserAuthModel.Where(u => u.username!.ToLower().Equals(loginUser.username!.ToLower())).FirstOrDefault();
        if (authUser == null) {
            return Unauthorized(new { message = "Username or password is wrong!" });
        }

        var hasher = new PasswordHasher<LoginModel>();
        PasswordVerificationResult passwordIsOk = hasher.VerifyHashedPassword(loginUser, authUser.password!, loginUser.password!);

        if (passwordIsOk == PasswordVerificationResult.Failed) {
            return Unauthorized(new { message = "Username or password is wrong!" });
        }

        if (authUser.username == loginUser.username && (passwordIsOk == PasswordVerificationResult.Success || passwordIsOk == PasswordVerificationResult.SuccessRehashNeeded))
        {
            if (passwordIsOk == PasswordVerificationResult.SuccessRehashNeeded) {
                // rehash password and save to DB
                _logger.LogError("Rehash password and save to DB");
            }

            int tokenLongerValid = (bool)loginUser.tokenLongerValid ? 14 : 1;// true = 14, false = 1
            var currentUser = new PollorDbContext().Users.Where(u => u.username!.ToLower().Equals(authUser.username!.ToLower())).FirstOrDefault();
            var tokenOptions = GetJwtTokenOptions(tokenLongerValid, currentUser!);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthenticatedResponse { token = tokenString, user = currentUser});
        }

        return Unauthorized(new { message = "something went wrong" } );
    }

    [HttpPost("validate")]
    [Authorize]
    public IActionResult Validate()
    {
        // Retrieve the JWT token from the Authorization header
        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "Token is missing" });
        }

        SecurityToken validatedToken;
        IPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(token, AuthService.GetValidationParameters(), out validatedToken);

        // The user is authenticated, and you can access user information
        var userClaims = HttpContext.User;
        // Perform additional validation or return success response

        var username = userClaims.Claims.Where(e => e.Type.Equals("userName")).Select(e => e.Value).SingleOrDefault();
        var userId = userClaims.Claims.Where(e => e.Type.Equals("userId")).Select(e => e.Value).SingleOrDefault();
        var userRole = userClaims.Claims.Where(e => e.Type.Equals("userRole")).Select(e => e.Value).SingleOrDefault();

        try
        {
            using (var context = new PollorDbContext())
            {
                UserModel? user = context.Users
                    .Where(u => u.id.ToString().Equals(userId) &&
                            u.username!.Equals(username) &&
                            u.role!.Equals(userRole))
                    .FirstOrDefault();
                if (user == null)
                {
                    return NotFound(new { message = "User not found..." });
                }
                return Ok(new AuthenticatedResponse { token = token, user = user });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    private JwtSecurityToken GetJwtTokenOptions (int tokenValidForXDays, UserModel user) {
        var jwtClaims = new List<Claim>
        {
            new Claim("userName", user.username!),
            new Claim("userId", user.id.ToString()),
            new Claim("userRole", user.role!)
        };

        string jwtTokenDomain = Environment.GetEnvironmentVariable("JWT_TOKEN_DOMAIN")!;

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_JWT_KEY")!));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var tokeOptions = new JwtSecurityToken(
            issuer: jwtTokenDomain,
            audience: jwtTokenDomain,
            claims: jwtClaims,
            expires: DateTime.Now.AddDays(tokenValidForXDays),
            signingCredentials: signinCredentials
        );
        return tokeOptions;
    }
}