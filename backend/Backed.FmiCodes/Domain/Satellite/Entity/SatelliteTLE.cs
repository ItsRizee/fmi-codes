namespace Domain.Satelite.Entity;

public class SatelliteTLE
{
    private string Name { get; set; }
    private int Number { get; set; }
    private char Classification { get; set; }
    private string InternationalDesignator { get; set; }
    private int EpochYear { get; set; }
    private float EpochDay { get; set; }
    private float FirstTimeDerivativeOfMeanMotion { get; set; }
    private float SecondTimeDerivativeOfMeanMotion { get; set; }
    private float BSTARDragTerm { get; set; }
    private int ElementSetNumber { get; set; }
    private int Line1Checksum { get; set; }
    private float Inclination { get; set; }
    private float RightAscensionOfAscendingNode { get; set; }
    private float Eccentricity { get; set; }
    private float ArgumentOfPerigee { get; set; }
    private float MeanAnomaly { get; set; }
    private float MeanMotion { get; set; } 
    private int RevolutionNumberAtEpoch { get; set; }
    private int Line2Checksum { get; set; }
    private string SateliteDescription { get; set; }
    
    public SatelliteTLE() { }

    public SatelliteTLE(string name, int number, char classification, string internationalDesignator, int epochYear, float epochDay, float firstTimeDerivativeOfMeanMotion, float secondTimeDerivativeOfMeanMotion, float bstarDragTerm, int elementSetNumber, int line1Checksum, float inclination, float rightAscensionOfAscendingNode, float eccentricity, float argumentOfPerigee, float meanAnomaly, float meanMotion, int revolutionNumberAtEpoch, int line2Checksum, string sateliteDescription)
    {
        Name = name;
        Number = number;
        Classification = classification;
        InternationalDesignator = internationalDesignator;
        EpochYear = epochYear;
        EpochDay = epochDay;
        FirstTimeDerivativeOfMeanMotion = firstTimeDerivativeOfMeanMotion;
        SecondTimeDerivativeOfMeanMotion = secondTimeDerivativeOfMeanMotion;
        BSTARDragTerm = bstarDragTerm;
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
        SateliteDescription = sateliteDescription;
    }
}