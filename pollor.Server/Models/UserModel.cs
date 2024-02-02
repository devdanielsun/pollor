using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    public class BaseUserModel : SuperModel
    {
        public string? username { get; set; }
        public string? emailaddress { get; set; }
    }

    [Table("users")]
    public class UserModel: BaseUserModel
    {
        public UserModel() {
            Polls = new List<PollModel>();
        }
        public string? first_name { get; set; }
        public string? last_name { get; set; }

        [ForeignKey("user_id")] // ForeignKey attribute in the PollModel
        public virtual ICollection<PollModel> Polls { get; set; }
    }

    [Table("users", Schema = "dbo")]
    public class UserAuthModel : BaseUserModel
    {
        [DataType(DataType.Password)]
        public string? password { get; set; }
        [NotMapped]
        public string? confirmPassword { get; set; }
    }
}