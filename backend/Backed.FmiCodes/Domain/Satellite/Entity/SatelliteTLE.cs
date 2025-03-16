public class SatelliteTLE 
{
    public int Id { get; set; }
    public string SatelliteName { get; set; }
    public int SatelliteNumber { get; set; }
    public char Classification { get; set; }
    public string InternationalDesignator { get; set; }
    public int EpochYear { get; set; }
    public float EpochDay { get; set; }
    public float FirstTimeDerivativeOfMeanMotion { get; set; }
    public float SecondTimeDerivativeOfMeanMotion { get; set; }
    public float BstarDragTerm { get; set; }
    public int ElementSetNumber { get; set; }
    public int Line1Checksum { get; set; }
    public float Inclination { get; set; }
    public float RightAscensionOfAscendingNode { get; set; }
    public float Eccentricity { get; set; }
    public float ArgumentOfPerigee { get; set; }
    public float MeanAnomaly { get; set; }
    public float MeanMotion { get; set; }
    public int RevolutionNumberAtEpoch { get; set; }
    public int Line2Checksum { get; set; }
    public string SatelliteDescription { get; set; }

    public SatelliteTLE(int id, string satelliteName, int satelliteNumber, char classification, string internationalDesignator, int epochYear, float epochDay, float firstTimeDerivativeOfMeanMotion, float secondTimeDerivativeOfMeanMotion, float bstarDragTerm, int elementSetNumber, int line1Checksum, float inclination, float rightAscensionOfAscendingNode, float eccentricity, float argumentOfPerigee, float meanAnomaly, float meanMotion, int revolutionNumberAtEpoch, int line2Checksum, string satelliteDescription)
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