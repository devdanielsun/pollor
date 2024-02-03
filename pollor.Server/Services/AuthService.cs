using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace pollor.Server.Services
{
    public class AuthService
    {
        public static TokenValidationParameters GetValidationParameters()
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_JWT_KEY")!));
            string jwtTokenDomain = Environment.GetEnvironmentVariable("JWT_TOKEN_DOMAIN")!;

            return new TokenValidationParameters()
            {
                ValidateLifetime = true,
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidIssuer = jwtTokenDomain,
                ValidAudience = jwtTokenDomain,
                IssuerSigningKey = secretKey // The same key as the one that generate the token
            };
        }
    }
}
