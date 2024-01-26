using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("polls")]
    public partial class PollModel : SuperModel
    {
        public PollModel() {
            Answers = new List<AnswerModel>();
        }

        public virtual int User_id { get; set; }
        public string? Question { get; set; }
        public DateTime Ending_date { get; set; }

        [ForeignKey("Poll_id")] // ForeignKey attribute in the AnswerModel
        public virtual ICollection<AnswerModel> Answers { get; set; }
    }
}