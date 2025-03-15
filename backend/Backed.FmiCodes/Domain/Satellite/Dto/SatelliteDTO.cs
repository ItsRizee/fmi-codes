namespace Domain.Satellite.Dto;

public class SatelliteDTO
{
    private int Id { get; set; }
    private string Name { get; set; }
    private int Number { get; set; }
    private string SatelliteDescription { get; set; }
    public SatelliteDTO() { }

    public SatelliteDTO(int id, string name, int number, string satelliteDescription)
    {
        Id = id;
        Name = name;
        Number = number;
        SatelliteDescription = satelliteDescription;
    }
}