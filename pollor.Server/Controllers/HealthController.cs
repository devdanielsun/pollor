using Microsoft.AspNetCore.Mvc;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {

        private readonly ILogger<PollsController> _logger;

        public HealthController(ILogger<PollsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetHealth()
        {
            try {
                using (var context = new PollorDbContext()) {
                    return Ok(new {
                        healthy = "OK",
                        ping = "Ping successful",
                        usersSize = context.Users.Count(),
                    });
                }
            }
            catch(Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
