using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetSatelliteByIdRequest : IRequest<SatelliteDTO>
{
    public int Id { get; set; }
}
