namespace Domain.Satellite.Dto;

public class CollisionResDTO
{
    public int Id { get; set; }
    public double PC { get; set; }
    public double MinimumDistance { get; set; }
    public DateTime MostProbableCollisionTime { get; set; }

    public CollisionResDTO(double pc, double minimumDistance, DateTime mostProbableCollisionTime)
    {
        PC = pc;
        MinimumDistance = minimumDistance;
        MostProbableCollisionTime = mostProbableCollisionTime;
    }

    public CollisionResDTO(int id, double pc, double minimumDistance, DateTime mostProbableCollisionTime)
    {
        Id = id;
        PC = pc;
        MinimumDistance = minimumDistance;
        MostProbableCollisionTime = mostProbableCollisionTime;
    }
}