using Domain.Satellite.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.Satelite.Handlers.Get;

public class GetSatelliteByIdHandler : IRequestHandler<GetSatelliteByIdRequest, SatelliteDTO>
{
    private readonly SatelliteDbContext _context;

    public GetSatelliteByIdHandler(SatelliteDbContext context)
    {
        _context = context;
    }

    public async Task<SatelliteDTO> Handle(GetSatelliteByIdRequest request, CancellationToken cancellationToken)
    {
        var satellite = await _context.SatelliteTLE
            .Where(sat => sat.Id == request.Id)
            .Select(sat => new SatelliteDTO(
                sat.Id,
                sat.SatelliteName,
                sat.SatelliteNumber,
                sat.Inclination,
                sat.RightAscensionOfAscendingNode,
                sat.Eccentricity,
                sat.ArgumentOfPerigee,
                sat.MeanAnomaly,
                sat.MeanMotion,
                sat.SatelliteDescription ?? "Currently no information about this satellite"
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (satellite == null)
            throw new KeyNotFoundException($"Satellite with ID {request.Id} not found");

        return satellite;
    }
}