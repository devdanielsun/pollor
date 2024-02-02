using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class PollsController : ControllerBase
    {
        private readonly ILogger<PollsController> _logger;

        public PollsController(ILogger<PollsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("polls")]
        public IActionResult GetAllPolls()
        {
            try {
                using (var context = new PollorDbContext()) {
                    List<PollModel> polls = context.Polls
                        .Include(p => p.Answers)
                            .ThenInclude(a => a.Votes)
                        .ToList();
                    if (polls.IsNullOrEmpty()) {
                        return NotFound();
                    }
                    return Ok(polls);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("poll/{id}")]
        public IActionResult GetPollById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    PollModel? poll = context.Polls
                        .Where(p => p.id.Equals(id))
                        .Include(p => p.Answers)
                            .ThenInclude(a => a.Votes)
                        .FirstOrDefault();
                    if (poll == null) {
                        return NotFound();
                    }
                    return Ok(poll);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpPost("poll")]
        [Authorize]
        public IActionResult AddPoll(PollModel poll)
        {
            try {
                using (var context = new PollorDbContext()) {
                    EntityEntry<PollModel> newPoll = context.Polls.Add(poll);
                    context.SaveChanges();

                    Console.WriteLine("newPoll: " + newPoll.Entity);

                    if (newPoll == null) {
                        return NotFound(newPoll);
                    }
                    return Created("poll/" + newPoll.Entity.id.ToString(), newPoll.Entity);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
