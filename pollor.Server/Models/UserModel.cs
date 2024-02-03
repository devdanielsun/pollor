using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    public class BaseUserModel : SuperModel
    {
        [StringLength(64)]
        public string? username { get; set; }
        [StringLength(256)]
        public string? emailaddress { get; set; }
    }

    [Table("users")]
    public class UserModel: BaseUserModel
    {
        public UserModel() {
            Polls = new List<PollModel>();
        }
        [StringLength(64)]
        public string? first_name { get; set; }
        [StringLength(64)]
        public string? last_name { get; set; }
        [StringLength(32)]
        public string? role { get; set; }

        [ForeignKey("user_id")] // ForeignKey attribute in the PollModel
        public virtual ICollection<PollModel> Polls { get; set; }
    }

    [Table("users", Schema = "dbo")]
    public class UserAuthModel : BaseUserModel
    {
        [DataType(DataType.Password), StringLength(128)]
        public string? password { get; set; }
        [NotMapped, StringLength(128)]
        public string? confirmPassword { get; set; }
    }
}