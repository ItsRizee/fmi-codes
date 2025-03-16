using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetWillCollideRequest:IRequest<List<CollisionResDTO>>
{ 
    public int Id { get; set; }
}