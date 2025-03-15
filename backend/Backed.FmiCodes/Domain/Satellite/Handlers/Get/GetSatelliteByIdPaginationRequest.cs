using Domain.Satellite.Dto;
using MediatR;

namespace Domain.Satelite.Handlers.Get;

public class GetSatelliteByIdPaginationRequest : IRequest<List<SatelliteSearchDTO>>
{
    public int PageNumber { get; set; }
    public int PaginationNumber { get; set; }
    public string Name { get; set; }

    public GetSatelliteByIdPaginationRequest(string? name, int pageNumber, int paginationNumber)
    {
        Name = name;
        PageNumber = pageNumber;
        PaginationNumber = paginationNumber;
    }
}