using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetWillCollideRequest:IRequest<SatelliteDTO>
{ 
    public int Id { get; set; }
}