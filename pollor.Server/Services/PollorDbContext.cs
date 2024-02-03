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
            if (isDevelopment) {
                connectionString = string.Format("Server={0};Database={1};User ID={2};Password={3};TrustServerCertificate={4};", dbServer, dbName, dbUID, dbPassword, true);
            } else { // Production
                connectionString = string.Format("Server={0};Initial Catalog={1};User ID={2};Password={3};Persist Security Info={4};TrustServerCertificate={5};MultipleActiveResultSets={6};Encrypt={7};Connection Timeout={8};",
                    dbServer, dbName, dbUID, dbPassword, false, false, false, true, 30);
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
}