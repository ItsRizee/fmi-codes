using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Domain.Satelite.Handlers.Get;

public class GenerateFileRequest : IRequest<FileContentResult>
{
    public int[] Ids { get; set; }

    public GenerateFileRequest(int[] ids)
    {
        Ids = ids;
    }
}