namespace Domain.Satellite.Dto;

public class CollisionDTO
{
    public SatelliteDTO satelliteDto { get; set; }
    public List<CollisionResDTO> collisionResults { get; set; }

    public CollisionDTO(SatelliteDTO satelliteDto, List<CollisionResDTO> collisionResults)
    {
        this.satelliteDto = satelliteDto;
        this.collisionResults = collisionResults;
    }
}