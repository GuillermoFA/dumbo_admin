using backEnd_dumbo.Src.Models;
using Microsoft.EntityFrameworkCore;

namespace backEnd_dumbo.Src.Data
{
    public class DataContext : DbContext
    {
        // Entity Framework create Users table
        public DbSet<User> Users { get; set; } = null!;

        // Entity Framework create Roles table
        public DbSet<Role> Roles { get; set; } = null!;
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "User" }
            );

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Rut = "19.955.559-5", Name = "Ochietto", LastName = "Araya", Email = "admin@admin.com", Password = "Jaqamain3pals", Points = 9999, RoleId = 1 },
                new User { Id = 2, Rut = "15.519.350-1", Name = "Juan", LastName = "Pedro", Email = "jPedro@gmail.com", Points = 590, RoleId = 2 }
            );
        }



















    }
}