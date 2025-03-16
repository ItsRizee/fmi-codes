using Domain.Satelite;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.Satellite.Handlers.Get.GetDebries;

public class GetDebrieByIdHandler: IRequestHandler<GetDebrieByIdRequest, Debries>
{
    private readonly SatelliteDbContext _context;

    public GetDebrieByIdHandler(SatelliteDbContext context)
    {
        _context = context;
    }

    public async Task<Debries> Handle(GetDebrieByIdRequest request, CancellationToken cancellationToken)
    {
        var debrie = await _context.Debries
            .Where(deb => deb.Id == request.Id)
            .Select(deb => new Debries(
                deb.Id,
                deb.DebriesName,
                deb.DebriesNumber,
                deb.Classification,
                deb.InternationalDesignator,
                deb.EpochYear,
                deb.EpochDay,
                deb.FirstTimeDerivativeOfMeanMotion,
                deb.SecondTimeDerivativeOfMeanMotion,
                deb.BstarDragTerm,
                deb.ElementSetNumber,
                deb.Line1Checksum,
                deb.Inclination,
                deb.RightAscensionOfAscendingNode,
                deb.Eccentricity,
                deb.ArgumentOfPerigee,
                deb.MeanAnomaly,
                deb.MeanMotion,
                deb.RevolutionNumberAtEpoch,
                deb.Line2Checksum
            ))
            .FirstOrDefaultAsync(cancellationToken);


        if (debrie == null)
            throw new KeyNotFoundException($"Satellite with ID {request.Id} not found");

        return debrie;
    }
}