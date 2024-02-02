namespace pollor.Server.Models
{
    public class AuthenticatedResponse
    {
        public string? Token { get; set; }
        public UserModel? User { get; set; }
    }
}