using System.Text;
using Domain.Satelite;
using Domain.Satelite.Handlers.Get;
using Domain.Satellite.Dto;
using Newtonsoft.Json;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Domain.Satellite.Handlers.Get;

public class GenerateFileHandler : IRequestHandler<GenerateFileRequest, FileContentResult> 
{
    private readonly SatelliteDbContext _context;

    public GenerateFileHandler(SatelliteDbContext context)
    {
        _context = context;
    }

    public async Task<FileContentResult> Handle(GenerateFileRequest request, CancellationToken cancellationToken)
    {


        Console.WriteLine(request.Ids.Take(0));
        Console.WriteLine(request.Ids.Contains(1));
        var id = await _context.SatelliteTLE.Select(s => s.Id).Take(1).FirstOrDefaultAsync();
        Console.WriteLine(id == 1);
        var fileDTOs = await _context.SatelliteTLE
            .Where(s => request.Ids.Contains(s.Id))
            .Select(s => new SatelliteFileDTO(s.Id, s.SatelliteName, s.SatelliteNumber,
                s.Classification, s.InternationalDesignator, s.EpochYear,
                s.EpochDay, s.FirstTimeDerivativeOfMeanMotion, s.SecondTimeDerivativeOfMeanMotion,
                s.BstarDragTerm, s.ElementSetNumber, s.Line1Checksum, s.Inclination,
                s.RightAscensionOfAscendingNode, s.Eccentricity, s.ArgumentOfPerigee,
                s.MeanAnomaly, s.MeanMotion, s.RevolutionNumberAtEpoch,
                s.Line2Checksum, s.SatelliteDescription))
            .ToListAsync(cancellationToken);
            
        if (!fileDTOs.Any())
        {
            return new FileContentResult(Encoding.UTF8.GetBytes("[]"), "application/json")
            {
                FileDownloadName = "satellites.json"
            };
        }

        // Convert DTOs to JSON
        var jsonString = JsonConvert.SerializeObject(fileDTOs, Formatting.Indented);
        var fileBytes = Encoding.UTF8.GetBytes(jsonString);

        // ✅ Return file with proper headers for automatic download
        return new FileContentResult(fileBytes, "application/json")
        {
            FileDownloadName = "satellites.json"
        };
    }
}