using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("answers")]
    public class AnswerModel : SuperModel
    {
        public int poll_id { get; set; }
        public string? poll_answer { get; set; }
    }
}
