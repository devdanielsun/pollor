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
                    var currentDate = DateTime.Now;
                    List<PollModel> polls = context.Polls
                        .Include(p => p.Answers)
                            .ThenInclude(a => a.Votes)
                            .OrderBy(p => EF.Functions.DateDiffSecond(currentDate, p.ending_date) >= 0 ? EF.Functions.DateDiffSecond(currentDate, p.ending_date) : int.MaxValue)
                            .ThenBy(p => EF.Functions.DateDiffSecond(p.ending_date, currentDate))
                            .ToList();
                    if (polls.IsNullOrEmpty()) {
                        return NotFound(new { message = "No records found" });
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
                        return NotFound(new { message = "No records found" });
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
                    var userClaims = HttpContext.User;
                    var userId = userClaims.Claims.Where(e => e.Type.Equals("userId")).Select(e => e.Value).SingleOrDefault()!;

                    DateTime now = DateTime.Now;
                    List<AnswerModel> answers = new List<AnswerModel>();
                    foreach (var a in poll.Answers) {
                        answers.Add(new AnswerModel()
                        {
                            poll_answer = a.poll_answer,
                            created_at = now
                        });
                    }

                    EntityEntry<PollModel> newPoll = context.Polls
                        .Add(new PollModel()
                        {
                            user_id = int.Parse(userId),
                            question = poll.question,
                            Answers = answers,
                            ending_date = poll.ending_date,
                            created_at = now
                        });
                    context.SaveChanges();

                    if (newPoll == null) {
                        return NotFound(new { message = "No records found" });
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
