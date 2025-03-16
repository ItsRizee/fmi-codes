using MediatR;

namespace Domain.Satelite.Handlers.Get.FlaskGetDTO;

public class FlaskGetRequest : IRequest<SatelliteTLE>
{
    public int Id { get; set; }
}