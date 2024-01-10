using Microsoft.AspNetCore.Mvc;
using pollor.Server.Services;
using pollor.Server.Models;

namespace answeror.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswersController : ControllerBase
    {
        private readonly ILogger<AnswersController> _logger;

        public AnswersController(ILogger<AnswersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetAnswersController")]
        public List<AnswerModel> GetAllAnswers()
        {
            string query_answers = string.Format("SELECT * FROM answers");
            try
            {
                return DBConnection.Instance().Query<AnswerModel>(query_answers).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }

        [HttpGet("{id}")]
        public AnswerModel GetAnswerById(int id)
        {
            string answerByIdQuery = string.Format("SELECT * FROM answers WHERE id = @answerId");
            try
            {
                AnswerModel answer = DBConnection.Instance().QueryById<AnswerModel>(answerByIdQuery, "@answerId", id);
                //if (answer == null) {
                //    _logger.LogWarning(MyLogEvents.GetItemNotFound, "Get(Answers/{Id}) NOT FOUND", id);
                //}
                return answer;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }
    }
}
