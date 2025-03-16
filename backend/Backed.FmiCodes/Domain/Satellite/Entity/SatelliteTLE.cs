public class SatelliteTLE 
{
    public int Id { get; set; }
    public string SatelliteName { get; set; }
    public int SatelliteNumber { get; set; }
    public char Classification { get; set; }
    public string InternationalDesignator { get; set; }
    public int EpochYear { get; set; }
    public double EpochDay { get; set; }
    public double FirstTimeDerivativeOfMeanMotion { get; set; }
    public double SecondTimeDerivativeOfMeanMotion { get; set; }
    public double BstarDragTerm { get; set; }
    public int ElementSetNumber { get; set; }
    public int Line1Checksum { get; set; }
    public double Inclination { get; set; }
    public double RightAscensionOfAscendingNode { get; set; }
    public double Eccentricity { get; set; }
    public double ArgumentOfPerigee { get; set; }
    public double MeanAnomaly { get; set; }
    public double MeanMotion { get; set; }
    public int RevolutionNumberAtEpoch { get; set; }
    public int Line2Checksum { get; set; }
    public string SatelliteDescription { get; set; }

    public SatelliteTLE(int id, string satelliteName, int satelliteNumber, char classification, string internationalDesignator, int epochYear, double epochDay, double firstTimeDerivativeOfMeanMotion, double secondTimeDerivativeOfMeanMotion, double bstarDragTerm, int elementSetNumber, int line1Checksum, double inclination, double rightAscensionOfAscendingNode, double eccentricity, double argumentOfPerigee, double meanAnomaly, double meanMotion, int revolutionNumberAtEpoch, int line2Checksum, string satelliteDescription)
    {
        Id = id;
        SatelliteName = satelliteName;
        SatelliteNumber = satelliteNumber;
        Classification = classification;
        InternationalDesignator = internationalDesignator;
        EpochYear = epochYear;
        EpochDay = epochDay;
        FirstTimeDerivativeOfMeanMotion = firstTimeDerivativeOfMeanMotion;
        SecondTimeDerivativeOfMeanMotion = secondTimeDerivativeOfMeanMotion;
        BstarDragTerm = BstarDragTerm;
        ElementSetNumber = elementSetNumber;
        Line1Checksum = line1Checksum;
        Inclination = inclination;
        RightAscensionOfAscendingNode = rightAscensionOfAscendingNode;
        Eccentricity = eccentricity;
        ArgumentOfPerigee = argumentOfPerigee;
        MeanAnomaly = meanAnomaly;
        MeanMotion = meanMotion;
        RevolutionNumberAtEpoch = revolutionNumberAtEpoch;
        Line2Checksum = line2Checksum;
        SatelliteDescription = satelliteDescription;
    }
}