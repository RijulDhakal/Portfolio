FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy everything from the current directory (Portfolio.Api)
COPY . .
WORKDIR /app

# Restore and publish
RUN dotnet restore "Portfolio.Api.csproj"
RUN dotnet publish "Portfolio.Api.csproj" -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
