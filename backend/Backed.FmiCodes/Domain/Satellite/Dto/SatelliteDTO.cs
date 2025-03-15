namespace Domain.Satellite.Dto;

public class SatelliteDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Number { get; set; }
    public string SatelliteDescription { get; set; }
    public SatelliteDTO() { }

    public SatelliteDTO(int id, string name, int number, string satelliteDescription)
    {
        Id = id;
        Name = name;
        Number = number;
        SatelliteDescription = satelliteDescription;
    }
}