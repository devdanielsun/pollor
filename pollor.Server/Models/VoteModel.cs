using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("votes")]
    public partial class VoteModel : SuperModel
    {
        public int answer_id { get; set; }
        [MaxLength(15)]
        public string? ipv4_address { get; set; }
        [MaxLength(45)]
        public string? ipv6_address { get; set; }
        [MaxLength(12)]
        public char[]? mac_address { get; set; }
        public DateTime voted_at { get; set; }
    }
}