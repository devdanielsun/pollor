using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pollor.Server.Models;
using pollor.Server.Services;

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
                        return NotFound();
                    }
                    return Ok(users);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    UserModel? user = context.Users
                        .Where(u => u.Id.Equals(id))
                        .Include(u => u.Polls)
                            .ThenInclude(p => p.Answers)
                                .ThenInclude(a => a.Votes)
                        .FirstOrDefault();
                    if (user == null) {
                        return NotFound();
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
