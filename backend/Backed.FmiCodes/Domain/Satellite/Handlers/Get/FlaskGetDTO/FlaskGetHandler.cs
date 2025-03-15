namespace Domain.Satelite.Handlers.Get.FlaskGetDTO;
using MediatR;
using Microsoft.EntityFrameworkCore;


public class FlaskGetHandler : IRequestHandler<FlaskGetRequest, SatelliteTLE>
{
    private readonly SatelliteDbContext _context;

    public FlaskGetHandler(SatelliteDbContext context)
    {
        _context = context;
    }

    public async Task<SatelliteTLE> Handle(FlaskGetRequest request, CancellationToken cancellationToken)
    {
        var satellite= await _context.SatelliteTLE
            .Where(sat => sat.Id == request.Id)
            .Select(sat => new SatelliteTLE(
                sat.Id,
                sat.SatelliteName,
                sat.SatelliteNumber,
                sat.Classification,
                sat.InternationalDesignator,
                sat.EpochYear,
                sat.EpochDay,
                sat.FirstTimeDerivativeOfMeanMotion,
                sat.SecondTimeDerivativeOfMeanMotion,
                sat.BstarDragTerm,
                sat.ElementSetNumber,
                sat.Line1Checksum,
                sat.Inclination,
                sat.RightAscensionOfAscendingNode,
                sat.Eccentricity,
                sat.ArgumentOfPerigee,
                sat.MeanAnomaly,
                sat.MeanMotion,
                sat.RevolutionNumberAtEpoch,
                sat.Line2Checksum,
                sat.SatelliteDescription??" " 
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (satellite == null)
        {
            throw new KeyNotFoundException("Satellite not found.");
        }

        return satellite;
    }

}