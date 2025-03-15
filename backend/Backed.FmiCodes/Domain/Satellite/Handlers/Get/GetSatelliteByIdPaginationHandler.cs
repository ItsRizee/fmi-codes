using Domain.Satellite.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.Satelite.Handlers.Get;

public class GetSatelliteByIdPaginationHandler : IRequestHandler<GetSatelliteByIdPaginationRequest, List<SatelliteSearchDTO>>
{
  
    private readonly SatelliteDbContext _context;

    public GetSatelliteByIdPaginationHandler(SatelliteDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<SatelliteSearchDTO>> Handle(GetSatelliteByIdPaginationRequest request, CancellationToken cancellationToken)
    {
       var satelliteDTOs = await _context.SatelliteTLE
           .Where(s => string.IsNullOrEmpty(request.Name) || s.SatelliteName.Contains(request.Name))
           .Skip((request.PageNumber) * request.PaginationNumber )
           .Take(request.PaginationNumber) 
           .Select(s => new SatelliteSearchDTO(s.Id, s.SatelliteName))
           .ToListAsync(cancellationToken);
       return satelliteDTOs;
    }
}