using JobTracker.Api.Applications;
using JobTracker.Api.Auth;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<StatusChange> StatusChanges => Set<StatusChange>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<JobApplication>()
        .Property(a => a.Status)
        .HasConversion<string>()
        .HasMaxLength(32);

        modelBuilder.Entity<JobApplication>()
       .HasOne<AppUser>()
       .WithMany()
       .HasForeignKey(a => a.UserId)
       .IsRequired();

        modelBuilder.Entity<StatusChange>(e =>
        {
            e.Property(s => s.FromStatus).HasConversion<string>().HasMaxLength(32);
            e.Property(s => s.ToStatus).HasConversion<string>().HasMaxLength(32);
        });
    }
}