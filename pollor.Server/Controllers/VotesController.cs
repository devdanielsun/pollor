using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.IdentityModel.Tokens;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class VotesController : ControllerBase
    {
        private readonly ILogger<VotesController> _logger;

        public VotesController(ILogger<VotesController> logger)
        {
            _logger = logger;
        }

        [HttpGet("votes")]
        public IActionResult GetAllVotes()
        {
            try {
                using (var context = new PollorDbContext()) {
                    List<VoteModel>? votes = context.Votes.ToList();
                    if (votes.IsNullOrEmpty()) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(votes);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("vote/{id}")]
        public IActionResult GetVoteById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    VoteModel? vote = context.Votes
                        .Where(v => v.id.Equals(id))
                        .FirstOrDefault();
                    if (vote == null) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(vote);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpPost("vote")]
        public IActionResult AddVote(VoteModel vote)
        {
            try {
                using (var context = new PollorDbContext()) {
                    AnswerModel? answer = context.Answers
                        .Where(a => a.id.Equals(vote.answer_id))
                            .Where(a => a.Votes.Any(v => v.ipv4_address == vote.ipv4_address || v.ipv6_address == vote.ipv6_address))
                        .FirstOrDefault();
                    if (answer != null) {
                        return Conflict(new { message = "You have already voted on this poll" });
                    }
                }

                DateTime now = DateTime.Now;
                using (var context = new PollorDbContext()) {
                    EntityEntry<VoteModel> newVote = context.Votes.Add(new VoteModel()
                        {
                            answer_id = vote.answer_id,
                            ipv4_address = vote.ipv4_address ?? null,
                            ipv6_address = vote.ipv6_address ?? null,
                            created_at = now,
                            voted_at = now
                        });
                    context.SaveChanges();

                    if (newVote == null) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Created("vote/" + newVote.Entity.id.ToString(), newVote.Entity);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
