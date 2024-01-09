using pollor.Server.Service;

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

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers().RequireCors();

app.MapFallbackToFile("/index.html");

app.Run();
