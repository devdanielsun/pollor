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
            return BadRequest("Invalid client request");
        }

        if (registerUser.password!.Length < 8) {
            return BadRequest("Password must be longer than 8 characters.");
        }

        bool isUsernameAvailable = new PollorDbContext().UserAuthModel.Where(u => u.username!.ToLower().Equals(registerUser.username!.ToLower())).IsNullOrEmpty();
        if (isUsernameAvailable == false) {
            return BadRequest("Username is already taken, please login or use another username.");
        }

        bool isEmailAvailable = new PollorDbContext().UserAuthModel.Where(u => u.emailaddress!.ToLower().Equals(registerUser.emailaddress!.ToLower())).IsNullOrEmpty();
        if (isEmailAvailable == false) {
            return BadRequest("Emailaddress is already taken, please login or use another emailaddress.");
        }

        var hasher = new PasswordHasher<RegisterModel>();
        var hashedPass = hasher.HashPassword(registerUser, registerUser.password!);
        UserAuthModel newUser = new UserAuthModel() {
            username = registerUser.username,
            password = hashedPass,
            emailaddress = registerUser.emailaddress,
            created_at = DateTime.Now,
        };

        EntityEntry<UserAuthModel> createdUser;
        using (var pollorContext = new PollorDbContext()) {
            createdUser = pollorContext.UserAuthModel.Add(newUser);
            pollorContext.SaveChanges();
        }
        
        var tokeOptions = GetJwtTokenOptions(1, createdUser.Entity);
        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        UserModel currentUser = new PollorDbContext().Users.Where(u => u.id.Equals(createdUser.Entity.id)).FirstOrDefault()!;
        return Created("user/" + currentUser.id, new AuthenticatedResponse { token = tokenString, user =  currentUser});
    }


    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel loginUser)
    {
        if (loginUser is null)
        {
            return BadRequest("Invalid client request");
        }

        var authUser = new PollorDbContext().UserAuthModel.Where(u => u.username!.ToLower().Equals(loginUser.username!.ToLower())).FirstOrDefault();
        if (authUser == null) {
            return Unauthorized("Username or password is wrong!");
        }

        var hasher = new PasswordHasher<LoginModel>();
        PasswordVerificationResult passwordIsOk = hasher.VerifyHashedPassword(loginUser, authUser.password!, loginUser.password!);

        if (passwordIsOk == PasswordVerificationResult.Failed) {
            return Unauthorized("Username or password is wrong!");
        }

        if (authUser.username == loginUser.username && (passwordIsOk == PasswordVerificationResult.Success || passwordIsOk == PasswordVerificationResult.SuccessRehashNeeded))
        {
            if (passwordIsOk == PasswordVerificationResult.SuccessRehashNeeded) {
                // rehash password and save to DB
            }

            int tokenLongerValid = (bool)loginUser.tokenLongerValid ? 31 : 1;// true = 31, false = 1
        
            var currentUserWithPass = new PollorDbContext().UserAuthModel.Where(u => u.username!.ToLower().Equals(authUser.username!.ToLower())).FirstOrDefault();
            int daysTokenIsValid = tokenLongerValid;
            var tokenOptions = GetJwtTokenOptions(daysTokenIsValid, currentUserWithPass!);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            var currentUser = new PollorDbContext().Users.Where(u => u.username!.ToLower().Equals(authUser.username!.ToLower())).FirstOrDefault();
            return Ok(new AuthenticatedResponse { token = tokenString, user = currentUser});
        }

        return Unauthorized();
    }

    [HttpPost("validate")]
    [Authorize]
    public IActionResult Validate([FromBody] ValidateTokenModel validateTokenModel)
    {
        // Retrieve the JWT token from the Authorization header
        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "Token is missing" });
        }

        SecurityToken validatedToken;
        IPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(token, GetValidationParameters(), out validatedToken);

        // The user is authenticated, and you can access user information
        var userClaims = HttpContext.User;
        // Perform additional validation or return success response

        var username = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/name")).Select(e => e.Value).SingleOrDefault();
        var userId = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/nameidentifier")).Select(e => e.Value).SingleOrDefault();
        var userRole = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/role")).Select(e => e.Value).SingleOrDefault();

        try
        {
            using (var context = new PollorDbContext())
            {
                UserModel? user = context.Users
                    .Where(u => u.id.Equals(userId))
                    .Where(u => u.username.Equals(username))
                    .Where(u => u.role.Equals(userRole))
                    .FirstOrDefault();
                if (user == null)
                {
                    return NotFound("User not found");
                }
                return Ok(new AuthenticatedResponse { token = validateTokenModel.token, user = user });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    private JwtSecurityToken GetJwtTokenOptions (int tokenValidForXDays, UserAuthModel user) {
        var jwtClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.username!),
            new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
            new Claim(ClaimTypes.Role, user.role!)
        };

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_JWT_KEY")!));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var tokeOptions = new JwtSecurityToken(
            issuer: "https://localhost:5001",
            audience: "https://localhost:5001",
            claims: jwtClaims,
            expires: DateTime.Now.AddDays(tokenValidForXDays),
            signingCredentials: signinCredentials
        );
        return tokeOptions;
    }

    private static TokenValidationParameters GetValidationParameters()
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_JWT_KEY")!));

        return new TokenValidationParameters()
        {
            ValidateLifetime = true,
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidIssuer = "https://localhost:5001",
            ValidAudience = "https://localhost:5001",
            IssuerSigningKey = secretKey // The same key as the one that generate the token
        };
    }
}