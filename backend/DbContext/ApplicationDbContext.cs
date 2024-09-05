using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Lista> Listas { get; set; }
        //public DbSet<FavoriteList> FavoriteLists { get; set; }
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    //modelBuilder.Entity<FavoriteList>()
        //    //    .HasKey(fl => new { fl.FavoriteId, fl.ListId });

        //    //modelBuilder.Entity<FavoriteList>()
        //    //    .HasOne(fl => fl.Favorite)
        //    //    .WithMany(f => f.FavoriteLists)
        //    //    .HasForeignKey(fl => fl.FavoriteId);

        //    //modelBuilder.Entity<FavoriteList>()
        //    //    .HasOne(fl => fl.Lista)
        //    //    .WithMany(l => l.FavoriteLists)
        //    //    .HasForeignKey(fl => fl.ListId);
        //}
    }
}