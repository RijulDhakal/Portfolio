FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY backend/src/Portfolio.Api/*.csproj ./backend/src/Portfolio.Api/
COPY backend/src/Portfolio.Application/*.csproj ./backend/src/Portfolio.Application/
COPY backend/src/Portfolio.Domain/*.csproj ./backend/src/Portfolio.Domain/
COPY backend/src/Portfolio.Infrastructure/*.csproj ./backend/src/Portfolio.Infrastructure/

WORKDIR /app/backend/src/Portfolio.Api
RUN dotnet restore

# Copy everything and build
COPY . .
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/backend/src/Portfolio.Api/out .
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
