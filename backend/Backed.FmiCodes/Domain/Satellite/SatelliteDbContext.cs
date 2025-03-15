using Microsoft.EntityFrameworkCore;


namespace Domain.Satelite;

public class SatelliteDbContext(DbContextOptions<SatelliteDbContext> options) : DbContext(options)
{
    
    public DbSet<SatelliteTLE> SatelliteTLE { get; set; }
    public DbSet<Debries> Debries { get; set; }
}