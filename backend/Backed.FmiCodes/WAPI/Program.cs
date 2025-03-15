using System.Reflection;
using Domain.Satelite;
using Domain.Satelite.Handlers.Get;
using Domain.Satelite.Handlers.Get.FlaskGetDTO;
using Domain.Satelite.Handlers.Get.GetDebris;
using Domain.Satellite.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DataBaseConnection");
builder.Services.AddDbContext<SatelliteDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));



builder.Services.AddControllers();

builder.Services.AddTransient<IRequestHandler<GetSatelliteByIdRequest, SatelliteDTO>, GetSatelliteByIdHandler>();
builder.Services.AddTransient<FlaskGetHandler>();
builder.Services.AddTransient<GetDebriesHandler>();
builder.Services.AddHttpClient();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(Assembly.Load("Domain")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var configuration = builder.Configuration;
builder.Services.AddSingleton<IConfiguration>(configuration);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5000); 
    serverOptions.ListenLocalhost(5001, listenOptions => 
    {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapControllers(); 

app.Run();
