using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("answers")]
    public partial class AnswerModel : SuperModel
    {
        public AnswerModel() {
            Votes = new List<VoteModel>();
        }
        
        public int poll_id { get; set; }
        [StringLength(256)]
        public string? poll_answer { get; set; }
        
        [ForeignKey("answer_id")] // ForeignKey attribute in the VoteModel
        public virtual ICollection<VoteModel> Votes { get; set; }
    }
}
