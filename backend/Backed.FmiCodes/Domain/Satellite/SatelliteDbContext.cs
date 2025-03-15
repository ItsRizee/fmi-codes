using Domain.Satelite.Entity;
using Microsoft.EntityFrameworkCore;

namespace Domain.Satelite;

public class SatelliteDbContext(DbContextOptions<SatelliteDbContext> options) : DbContext(options)
{
    
    public DbSet<SatelliteTLE> Satellites { get; set; }
}