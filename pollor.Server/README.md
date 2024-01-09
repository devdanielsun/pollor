# PollorServer

C# .NET 8.0 Core backend

## Init

copy .env.example to .env and edit the values

## To run the backend from CLI

`dotnet run --launch-profile https`

### If HTTPS is not working on local development

 1. `dotnet dev-certs https --clean`
 2. `dotnet dev-certs https --trust`
 3. Restart VS