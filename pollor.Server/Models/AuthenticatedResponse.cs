namespace pollor.Server.Models
{
    public class AuthenticatedResponse
    {
        public string? token { get; set; }
        public UserModel? user { get; set; }
    }
}