﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

namespace backend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240905121146_TerceiraMigracao")]
    partial class TerceiraMigracao
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.17")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("FavoriteList", b =>
                {
                    b.Property<int>("FavoritesId")
                        .HasColumnType("integer");

                    b.Property<int>("ListsId")
                        .HasColumnType("integer");

                    b.HasKey("FavoritesId", "ListsId");

                    b.HasIndex("ListsId");

                    b.ToTable("FavoriteList");
                });

            modelBuilder.Entity("backend.Models.Favorite", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<bool>("IsFavorite")
                        .HasColumnType("boolean");

                    b.Property<int>("MovieId")
                        .HasColumnType("integer");

                    b.Property<string>("Overview")
                        .HasColumnType("text");

                    b.Property<string>("PosterUrl")
                        .HasColumnType("text");

                    b.Property<double>("Rating")
                        .HasColumnType("double precision");

                    b.Property<string>("ReleaseDate")
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Favorites");
                });

            modelBuilder.Entity("backend.Models.List", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Lists");
                });

            modelBuilder.Entity("FavoriteList", b =>
                {
                    b.HasOne("backend.Models.Favorite", null)
                        .WithMany()
                        .HasForeignKey("FavoritesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.List", null)
                        .WithMany()
                        .HasForeignKey("ListsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
