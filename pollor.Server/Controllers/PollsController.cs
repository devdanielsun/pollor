using Microsoft.AspNetCore.Mvc;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PollsController : ControllerBase
    {
        private readonly ILogger<PollsController> _logger;

        public PollsController(ILogger<PollsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetPollsController")]
        public List<PollModel> GetAllPolls()
        {
            string query_polls = string.Format("SELECT * FROM polls");
            return DBConnection.Instance().Query<PollModel>(query_polls).ToList();
        }

        [HttpGet("{id}")]
        public PollModel GetPollById(int id)
        {
            string pollByIdQuery = string.Format("SELECT * FROM polls WHERE id = @pollId");
            PollModel poll = DBConnection.Instance().QueryById<PollModel>(pollByIdQuery, "@pollId", id);
            //if (poll == null) {
            //    _logger.LogWarning(MyLogEvents.GetItemNotFound, "Get(Polls/{Id}) NOT FOUND", id);
            //}
            return poll;
        }
    }
}
