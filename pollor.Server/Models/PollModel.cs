using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("polls")]
    public class PollModel : SuperModel
    {
        public int user_id { get; set; }
        public string? question { get; set; }
        public DateTime ending_date { get; set; }
    }
}