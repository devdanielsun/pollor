using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using pollor.Server.Models;
using pollor.Server.Services;
using Microsoft.EntityFrameworkCore.ChangeTracking;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
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
            Created_at = DateTime.Now,
        };

        EntityEntry<UserAuthModel> createdUser;
        using (var pollorContext = new PollorDbContext()) {
            createdUser = pollorContext.UserAuthModel.Add(newUser);
            pollorContext.SaveChanges();
        }
        
        var tokeOptions = GetJwtTokenOptions(1, createdUser.Entity);
        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        UserModel currentUser = new PollorDbContext().Users.Where(u => u.Id.Equals(createdUser.Entity.Id)).FirstOrDefault()!;
        return Ok(new AuthenticatedResponse { Token = tokenString, User =  currentUser});
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
            return Ok(new AuthenticatedResponse { Token = tokenString, User = currentUser});
        }

        return Unauthorized();
    }

    private JwtSecurityToken GetJwtTokenOptions (int tokenValidForXDays, UserAuthModel user) {
        var jwtClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.username!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
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
}