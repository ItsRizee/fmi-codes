using MediatR;

namespace Domain.Satellite.Handlers.Get.GetDebries;

public class GetDebrieByIdRequest : IRequest<Debries>
{
    public int Id { get; set; }
}