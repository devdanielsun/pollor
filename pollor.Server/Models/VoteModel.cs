using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace pollor.Server.Models
{
    [Table("votes")]
    public class VoteModel : SuperModel
    {
        public PollModel? poll_id { get; set; }
        public UserModel? user_id { get; set; }
        public AnswerModel? answer_id { get; set; }
        public int ipv4_address { get; set; }
        public BigInteger ipv6_address { get; set; }
        public DateTime voted_at { get; set; }
    }
}