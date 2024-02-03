using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pollor.Server.Models;
using pollor.Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Principal;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            try {
                using (var context = new PollorDbContext()) {
                    List<UserModel>? users = context.Users
                        .Include(u => u.Polls)
                            .ThenInclude(p => p.Answers)
                                .ThenInclude(a => a.Votes)
                        .ToList();
                    if (users.IsNullOrEmpty()) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(users);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("user")]
        [Authorize]
        public IActionResult GetCurrentUser()
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

            var username = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/name")).Select(e => e.Value).SingleOrDefault();
            var userId = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/nameidentifier")).Select(e => e.Value).SingleOrDefault();
            var userRole = userClaims.Claims.Where(e => e.Type.EndsWith("identity/claims/role")).Select(e => e.Value).SingleOrDefault();

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
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    UserModel? user = context.Users
                        .Where(u => u.id.Equals(id))
                        .Include(u => u.Polls)
                            .ThenInclude(p => p.Answers)
                                .ThenInclude(a => a.Votes)
                        .FirstOrDefault();
                    if (user == null) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(user);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
