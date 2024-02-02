using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using pollor.Server.Services;

var builder = WebApplication.CreateBuilder(args);

/* Load .env */
var root = Directory.GetCurrentDirectory();
var dotenv = Path.Combine(root, ".env");
DotEnv.Load(dotenv);

/* get .env value */
String[] corsDomains = Environment.GetEnvironmentVariable("ACCEPTED_CORS_DOMAINS")!.Split(',');

/* If values are null or empty, give error message that values are missing in .env */
if(corsDomains == null || corsDomains.Length == 0 || String.IsNullOrEmpty(corsDomains[0])) {
    throw new InvalidOperationException("corsDomains contains no elements. Make sure ACCEPTED_CORS_DOMAINS is set in .env");
}

// Array.ForEach(corsDomains, Console.WriteLine); // Writes whole array of allowed CORS domains to console

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(corsDomains); // loading array of .env values as allowed CORS domains
        });
});

/* get secret private jwt key value */
String secretJwtKey = Environment.GetEnvironmentVariable("SECRET_JWT_KEY")!;

/* If values are null or empty, give error message that values are missing in .env */
if (secretJwtKey == null)
{
    throw new InvalidOperationException("secretJwtKey contains no value. Make sure SECRET_JWT_KEY is set in .env");
}


/* Add JWT authentication */
builder.Services.AddAuthentication(opt => {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:5001",
            ValidAudience = "https://localhost:5001",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretJwtKey))
        };
    });

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Pollor API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                },
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseStatusCodePages();

app.MapControllers().RequireCors();

app.MapFallbackToFile("/index.html");

app.Run();
