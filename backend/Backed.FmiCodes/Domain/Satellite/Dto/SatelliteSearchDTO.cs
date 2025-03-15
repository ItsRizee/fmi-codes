namespace Domain.Satellite.Dto;

public class SatelliteSearchDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public SatelliteSearchDTO(int id, string name)
    {
        Id = id;
        Name = name;
    }
}