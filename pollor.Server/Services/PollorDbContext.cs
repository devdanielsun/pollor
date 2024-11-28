using Microsoft.EntityFrameworkCore;
using pollor.Server.Models;

namespace pollor.Server.Services {

    public class PollorDbContext : DbContext
    {
        private string connectionString;

        //entities
        public DbSet<UserModel> Users { get; set; }
        public DbSet<UserAuthModel> UserAuthModel { get; set; }
        public DbSet<PollModel> Polls { get; set; }
        public DbSet<VoteModel> Votes { get; set; }
        public DbSet<AnswerModel> Answers { get; set; }

        public PollorDbContext() {
            string dbServer = Environment.GetEnvironmentVariable("DB_SERVER")!;
            string dbName = Environment.GetEnvironmentVariable("DB_NAME")!;
            string dbUID = Environment.GetEnvironmentVariable("DB_UID")!;
            string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD")!;

            bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

            connectionString = string.Format("Server={0};Database={1};User={2};Password={3};Port={4};SslMode={5};", dbServer, dbName, dbUID, dbPassword, 3306, "None"); // "Required");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(connectionString);
        }
    }
}