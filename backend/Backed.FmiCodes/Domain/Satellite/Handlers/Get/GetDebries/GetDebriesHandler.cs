using Domain.Satelite.Handlers.Get.GetDebries;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Domain.Satelite.Handlers.Get.GetDebris;

public class GetDebriesHandler : IRequestHandler<GetDebriesRequest,List<Debries>>
{
    private readonly SatelliteDbContext _context;

    public GetDebriesHandler(SatelliteDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<Debries>> Handle(GetDebriesRequest request, CancellationToken cancellationToken)
    {
        var debries = await _context.Debries.ToListAsync(cancellationToken);
        return debries;
    }
}