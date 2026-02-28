# AI-Campaigns

An AI-powered marketing campaign generator that automatically creates professional advertising content for businesses. Simply provide a website URL and the system analyzes the business, then generates customized ad images with descriptions.

## What It Does

- Analyzes any business website using Google Gemini AI with live Google Search
- Generates high-quality advertising images tailored to the business
- Supports multiple languages (English and Bulgarian)
- Offers multiple image styles (Normal and Hyperrealistic)
- Supports multiple aspect ratios for different social media platforms
- Accepts optional reference images to guide the AI generation

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| TypeScript | ~5.9.3 | Type-safe JavaScript |
| Vite | 7.3.1 | Build tool and dev server |
| ESLint | 9.39.1 | Code linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| .NET | 8.0 | Runtime framework |
| ASP.NET Core Web API | 8.0 | RESTful API |
| Google.GenAI SDK | 1.2.0 | Gemini AI integration |
| Swashbuckle (Swagger) | 6.6.2 | API documentation |

### AI Models (Google Gemini)
| Model | Purpose |
|---|---|
| `gemini-2.5-flash` | Website analysis with Google Search grounding |
| `gemini-3.1-flash-image-preview` | Ad image generation |

## Project Structure

```
AI-Campaigns/
├── frontend/
│   └── ai-campaigns/          # React + TypeScript + Vite SPA
│       ├── src/
│       │   ├── App.tsx        # Main application component
│       │   ├── App.css        # Component styles
│       │   ├── main.tsx       # Entry point
│       │   └── index.css      # Global styles
│       ├── package.json
│       └── vite.config.ts
│
└── backend/
    └── AI-Campaigns-Project/
        └── AI-Campaigns-Project/
            ├── Controllers/
            │   └── GeminiController.cs      # API endpoint
            ├── Services/
            │   ├── GeminiService.cs         # Gemini AI integration
            │   └── FileService.cs           # Image file management
            ├── DTOs/                        # Data transfer objects
            ├── Enums/                       # Language, image type, aspect ratio
            └── GeneratedImages/             # Temporary image output folder
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A Google Gemini API key

### Backend Setup

1. Navigate to the backend project:
   ```bash
   cd backend/AI-Campaigns-Project/AI-Campaigns-Project
   ```

2. Add your Gemini API key to `appsettings.json` or as an environment variable.

3. Run the API:
   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:7048`.
   Swagger UI is available at `https://localhost:7048/swagger` in development.

### Frontend Setup

1. Navigate to the frontend:
   ```bash
   cd frontend/ai-campaigns
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API Reference

### `POST /api/Gemini/generate-campaign`

Generates a campaign image and description for a given website.

**Request** (`multipart/form-data`):

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Website URL to analyze |
| `countryAdLanguage` | int | Yes | `0` = English, `1` = Bulgarian |
| `imageType` | int | Yes | `0` = Normal, `1` = Hyperrealistic |
| `imageAspectRatio` | int | Yes | `0` = 1:1, `1` = 4:5, `2` = 9:16, `3` = 16:9 |
| `referenceImages` | file[] | No | Optional reference images |

**Response** (`application/json`):

```json
{
  "description": "Campaign description and details...",
  "image": "data:image/png;base64,..."
}
```

## Usage

1. Open the app in your browser at `http://localhost:5173`
2. Enter the business website URL
3. Select the output language (English or Bulgarian)
4. Optionally enable Hyperrealistic image quality
5. Choose an aspect ratio for your target platform:
   - **1:1** — Square (Instagram feed)
   - **4:5** — Portrait (Instagram feed)
   - **9:16** — Vertical (Stories, Reels, TikTok)
   - **16:9** — Landscape (Facebook, YouTube)
6. Optionally upload reference images for style guidance
7. Click **Generate** and wait for the AI to create your campaign
8. Download the generated image using the hover button

## Development

### Frontend scripts

```bash
npm run dev      # Start dev server with HMR
npm run build    # TypeScript check + production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

### Backend scripts

```bash
dotnet run       # Start the API
dotnet build     # Build the project
dotnet watch     # Run with hot reload
```
