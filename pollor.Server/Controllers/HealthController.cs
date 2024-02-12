using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc;
using pollor.Server.Models;
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
            int usersSize = 0;
            int pollsSize = 0;
            int answersSize = 0;
            int votesSize = 0;

            try {
                using (var context = new PollorDbContext()) {
                    usersSize = context.Users.Count();
                    pollsSize = context.Polls.Count();
                    answersSize = context.Answers.Count();
                    votesSize = context.Votes.Count();
                }
            }
            catch(Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }

            return Ok(new {
                healthy = "OK",
                ping = "Ping successful",
                usersSize,
                pollsSize,
                answersSize,
                votesSize,
            });
        }
    }
}
