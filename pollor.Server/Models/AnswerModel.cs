namespace pollor.Server.Model
{
    public class AnswerModel : SuperModel
    {
        public PollModel? poll_id { get; set; }

        public string? poll_answer { get; set; }
    }
}
