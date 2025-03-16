using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetWillCollideRequest:IRequest<CollisionDTO>
{ 
    public int Id { get; set; }
}