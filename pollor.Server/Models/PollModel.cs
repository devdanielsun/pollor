using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("polls")]
    public partial class PollModel : SuperModel
    {
        public PollModel() {
            Answers = new List<AnswerModel>();
        }

        public int user_id { get; set; }
        [StringLength(512)]
        public string? question { get; set; }
        public DateTime ending_date { get; set; }

        [ForeignKey("poll_id")] // ForeignKey attribute in the AnswerModel
        public virtual ICollection<AnswerModel> Answers { get; set; }
    }
}