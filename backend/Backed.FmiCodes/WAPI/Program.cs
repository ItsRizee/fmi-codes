using System.Reflection;
using Domain.Satelite;
using Domain.Satelite.Handlers.Get;
using Domain.Satellite.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DataBaseConnection");
builder.Services.AddDbContext<SatelliteDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));



builder.Services.AddControllers();

builder.Services.AddTransient<IRequestHandler<GetSatelliteByIdRequest, SatelliteDTO>, GetSatelliteByIdHandler>();


builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(Assembly.Load("Domain")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapControllers(); 

app.Run();