using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetSatelliteByIdHandler : IRequestHandler<GetSatelliteByIdRequest, SatelliteDTO>
{
    public Task<SatelliteDTO> Handle(GetSatelliteByIdRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}