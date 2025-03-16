namespace Domain.Satellite.Dto;

public class CollisionResDTO
{
    public DebriesDTO debriesDto { get; set; }
    public double PC { get; set; }
    public double MinimumDistance { get; set; }
    public DateTime MostProbableCollisionTime { get; set; }

    public CollisionResDTO() { }
    public CollisionResDTO(double pc, double minimumDistance, DateTime mostProbableCollisionTime)
    {
        PC = pc;
        MinimumDistance = minimumDistance;
        MostProbableCollisionTime = mostProbableCollisionTime;
    }

    public CollisionResDTO(DebriesDTO debriesDto, double pc, double minimumDistance, DateTime mostProbableCollisionTime)
    {
        this.debriesDto = debriesDto;
        PC = pc;
        MinimumDistance = minimumDistance;
        MostProbableCollisionTime = mostProbableCollisionTime;
    }
}