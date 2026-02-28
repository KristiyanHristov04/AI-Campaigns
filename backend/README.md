# AI Campaigns - Backend

This is the ASP.NET Core backend for the AI Campaigns project.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (version required by the project)
- A valid [Google Gemini API key](https://aistudio.google.com/app/apikey)

## Configuration

### Environment Variables

Before running the project, you must add your Gemini API key to the `environmentVariables` section of each profile in `AI-Campaigns-Project/AI-Campaigns-Project/Properties/launchSettings.json`:

```json
"environmentVariables": {
  "ASPNETCORE_ENVIRONMENT": "Development",
  "GEMINI_API_KEY": "your-gemini-api-key-here"
}
```

Add the `GEMINI_API_KEY` entry to **all** profiles (`http`, `https`, and `IIS Express`) so the key is available regardless of which profile you launch.

> **Note:** `launchSettings.json` is a local configuration file and should **not** be committed to source control. Keep your API key private.

## Running the Project

```bash
cd AI-Campaigns-Project/AI-Campaigns-Project
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5258`
- HTTPS: `https://localhost:7048`

Swagger UI is available at `/swagger` when running in `Development` mode.
