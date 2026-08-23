FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY *.csproj ./
COPY ../Portfolio.Application/*.csproj ../Portfolio.Application/
COPY ../Portfolio.Domain/*.csproj ../Portfolio.Domain/
COPY ../Portfolio.Infrastructure/*.csproj ../Portfolio.Infrastructure/
RUN dotnet restore

# Copy everything and build
COPY . .
COPY ../Portfolio.Application ../Portfolio.Application
COPY ../Portfolio.Domain ../Portfolio.Domain
COPY ../Portfolio.Infrastructure ../Portfolio.Infrastructure

RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
