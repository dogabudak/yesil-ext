# Sustainability Data Service

A backend API service that provides company sustainability and environmental data for the Chrome extension.

## Features

- RESTful API for company sustainability data
- Domain-based company lookup
- Rate limiting and security headers
- In-memory caching with configurable refresh
- Pagination support
- Search functionality

## API Endpoints

### GET /health
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "recordsCount": 1500
}
```

### GET /api/companies
Get paginated list of all companies
- Query params: `limit` (default: 50), `offset` (default: 0)

### GET /api/companies/search
Search companies by domain or name
- Query params: `domain`, `company`
```bash
curl "http://localhost:3000/api/companies/search?domain=trendyol.com"
```

### GET /api/companies/domain/:domain
Get company data by domain
```bash
curl "http://localhost:3000/api/companies/domain/trendyol.com"
```

### GET /api/data/version
Get data version and statistics
```json
{
  "version": "1.0.0",
  "recordCount": 1500,
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "categories": {
    "carbonNeutral": 450,
    "withRenewableData": 800,
    "publicCompanies": 1200
  }
}
```

## Setup

1. Install dependencies:
```bash
cd backend-service
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## Configuration

Environment variables in `.env`:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## Integration with Chrome Extension

The Chrome extension should be configured to use this API endpoint instead of the local data.json file. The service provides the same data structure with additional features like real-time updates and better performance.