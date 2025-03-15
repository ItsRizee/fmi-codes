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
        var names = await _context.SatelliteTLE.Select(s => s.SatelliteName).Take(1).ToListAsync(cancellationToken);
        return new SatelliteDTO(1, names[0], 1, "");
    }
}