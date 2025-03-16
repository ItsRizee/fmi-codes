# Use official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy csproj from correct folder
COPY Backed.FmiCodes/WAPI/WAPI.csproj ./WAPI/
COPY Backed.FmiCodes/Domain/Domain.csproj ./Domain/
COPY Backed.FmiCodes/Backed.FmiCodes.sln .
# Restore
# WORKDIR /src/WAPI
RUN dotnet restore .

# Copy rest of app
WORKDIR /src
COPY Backed.FmiCodes/WAPI/. ./WAPI/
COPY Backed.FmiCodes/Domain/. ./Domain/
# Publish
# WORKDIR /src/WAPI
RUN dotnet publish ./WAPI/WAPI.csproj -c Release -o /app

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8080

COPY --from=build /app .

ENTRYPOINT ["dotnet", "WAPI.dll"]
