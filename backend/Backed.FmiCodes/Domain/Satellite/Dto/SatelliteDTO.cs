namespace Domain.Satellite.Dto;

public class SatelliteDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Number { get; set; }
    public double Inclination { get; set; }
    public double RightAscensionOfAscendingNode { get; set; }
    public double Eccentricity { get; set; }
    public double ArgumentOfPerigee { get; set; }
    public double MeanAnomaly { get; set; }
    public double MeanMotion { get; set; }
    public string SatelliteDescription { get; set; }
    public SatelliteDTO() { }

    public SatelliteDTO(int id, string name, int number, double inclination, double rightAscensionOfAscendingNode, double eccentricity, double argumentOfPerigee, double meanAnomaly, double meanMotion, string satelliteDescription)
    {
        Id = id;
        Name = name;
        Number = number;
        Inclination = inclination;
        RightAscensionOfAscendingNode = rightAscensionOfAscendingNode;
        Eccentricity = eccentricity;
        ArgumentOfPerigee = argumentOfPerigee;
        MeanAnomaly = meanAnomaly;
        MeanMotion = meanMotion;
        SatelliteDescription = satelliteDescription;
    }
}