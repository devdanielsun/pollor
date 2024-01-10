using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace pollor.Server.Models
{
    [Table("votes")]
    public class VoteModel : SuperModel
    {
        public int answer_id { get; set; }
        public byte[]? ipv4_address { get; set; }
        public byte[]? ipv6_address { get; set; }
        public char[]? mac_address { get; set; }
        public DateTime voted_at { get; set; }
    }
}