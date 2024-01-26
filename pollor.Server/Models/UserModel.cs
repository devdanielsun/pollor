using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("users")]
    public class UserModel : SuperModel
    {
        public UserModel() {
            Polls = new List<PollModel>();
        }

        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? profile_username { get; set; }

        [ForeignKey("user_id")] // ForeignKey attribute in the PollModel
        public virtual ICollection<PollModel> Polls { get; set; }
    }
}