# Smart Sugarcane Irrigation Dashboard

A React dashboard for monitoring sugarcane plots, demo weather conditions, and rule-based irrigation advice. The repository has two separate APIs: an Express API backed by MongoDB and a built-in Node.js API backed by a JSON file.

## Architecture and data flow

- `frontend/` contains the React + Vite dashboard.
- `backend/` contains the Express API on port 5000 and the MongoDB native driver connection to `SugarcaneDB`.
- `backend/core-node/` contains a separate Node.js `http` API on port 4000. It has no Express or MongoDB dependency and stores records in `backend/core-node/data/plots.json`.
- The dashboard calls Express for plots, weather, and recommendations. New farms are posted to MongoDB and are reloaded from the API.
- Express initializes sample plot and weather records only when the corresponding collection is empty. Existing records are not replaced.

Weather records are demo data; there is no live weather service integrated. Irrigation recommendations are rule-based; there is no trained ML model. Frontend login and registration state are demo-only and are not stored in MongoDB or suitable for production authentication.

## Folder structure

```text
backend/
  db.js
  server.js
  routes/
    plots.js
    weather.js
    recommendations.js
  core-node/
    server.js
    package.json
    data/plots.json
  postman/
    Smart-Irrigation-API.postman_collection.json
frontend/
  src/
    App.jsx
    services/agriApi.js
```

## Requirements

- Node.js 18 or newer and npm
- MongoDB Community Server for the Express API
- `mongosh` for direct database inspection (optional)
- Postman for importing and running the collection (optional)

No additional packages are required by the Core Node.js API.

## Start MongoDB

Install MongoDB Community Server and start its service. On Windows, from an Administrator terminal:

```powershell
net start MongoDB
```

The default connection is `mongodb://127.0.0.1:27017`. To use another URI, set `MONGODB_URI` in the backend terminal before starting Express.

## Run the Core Node.js API (port 4000)

From the repository root:

```powershell
cd backend/core-node
npm start
```

It creates `data/plots.json` containing an empty array only when that file does not exist. It does not reset existing file contents. Set `CORE_PORT` to change its port.

## Run the Express + MongoDB API (port 5000)

In a separate terminal, from the repository root:

```powershell
cd backend
npm install
npm start
```

The server waits for MongoDB before listening at `http://localhost:5000`. Connection failures are reported in the terminal and prevent startup.

## Run the React frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. The dashboard uses `http://localhost:5000/api`.

## API endpoints

### Express API: `http://localhost:5000/api`

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | 200 | Health status |
| GET | `/plots` | 200 | List plots |
| GET | `/plots/:id` | 200 | Read one plot |
| POST | `/plots` | 201 | Create a plot |
| PUT | `/plots/:id` | 200 | Replace plot fields while retaining unspecified optional fields |
| DELETE | `/plots/:id` | 200 | Delete a plot |
| GET | `/weather` | 200 | Read demo weather records |
| GET | `/recommendations` | 200 | Calculate rule-based advice |

Plot create and update require non-empty `plotName`, `location`, and `crop`; numeric `area`, `soilMoisture`, `temperature`, `humidity`, and `rainfall`; area must be positive, moisture and humidity 0–100, rainfall non-negative, temperature -20–60. `soilType` and `irrigationStatus` are optional.

Example plot body:

```json
{
  "plotName": "North Field",
  "location": "Kolhapur, Maharashtra",
  "crop": "Sugarcane",
  "area": 2,
  "soilMoisture": 40,
  "temperature": 30,
  "humidity": 65,
  "rainfall": 1,
  "soilType": "Black Soil"
}
```

### Core Node.js API: `http://localhost:4000`

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/` or `/health` | 200 | Health status |
| GET | `/plots` | 200 | List file-backed plots |
| GET | `/plots?crop=Sugarcane` | 200 | Filter by crop (query parameter) |
| GET | `/plots/:id` | 200 | Read one plot |
| POST | `/plots` | 201 | Create a plot |
| PUT | `/plots/:id` | 200 | Update a plot |
| DELETE | `/plots/:id` | 200 | Delete a plot |

The core API uses the same plot body fields and validation limits. It assigns each record a UUID `id`; Express uses MongoDB `_id` ObjectIds. The two servers and their data stores are independent.

## HTTP status codes

- `200`: successful read, update, delete, or health request
- `201`: record created
- `400`: invalid JSON, invalid input, or invalid MongoDB ObjectId
- `404`: unknown endpoint or record does not exist
- `405`: unsupported method on a recognized Core API resource
- `413`: Core API request body exceeds 1 MB
- `500`: unexpected server or file/database operation error

Errors are JSON objects with an `error` message. Express requires MongoDB to be reachable and logs connection failures. Core API filesystem failures are returned as 500 responses and logged.

## Import and run Postman collection

1. Start MongoDB, the Express API, and the Core API.
2. In Postman choose **Import**, then select `backend/postman/Smart-Irrigation-API.postman_collection.json`.
3. Open **Smart Irrigation API**, then run it with Collection Runner.
4. Run requests in listed order. The Express create request stores `_id` in `plotId`; the Core create request stores `id` in `corePlotId`. Later read, update, and delete requests reuse those variables.
5. Create requests add demo test records to their respective stores; the final delete requests remove those records.

The collection includes checks for status, JSON shape, required fields, CRUD behavior, invalid input, invalid MongoDB IDs, missing records, and unknown routes. The collection definition is provided; results depend on running it against the local services.

## Verify MongoDB persistence

With MongoDB running, open `mongosh`:

```javascript
use SugarcaneDB
db.plots.find().pretty()
db.weather.find().pretty()
db.plots.countDocuments()
```

Create a plot through the dashboard or `POST /api/plots`, refresh the dashboard, then inspect `db.plots.find()` to confirm the record persisted. MongoDB stores plot IDs as ObjectIds.

## Build and lint

From `frontend/`:

```powershell
npm run build
npm run lint
```

## Troubleshooting

- **Express exits before listening:** start MongoDB, check `MONGODB_URI`, and inspect the backend terminal error.
- **Dashboard cannot connect:** keep Express running on port 5000 and Vite on port 5173; check the browser network panel and API terminal.
- **Port already in use:** stop the process using the port or set `PORT` (Express) / `CORE_PORT` (Core API) to an available port. The frontend API URL is currently configured in `frontend/src/services/agriApi.js`.
- **Invalid plot response:** send valid JSON, include all required fields, use numbers for measurements, and observe the documented ranges.
- **Core API data file error:** check write permissions for `backend/core-node/data/plots.json` and ensure it contains a JSON array.

## Known limitations

- Weather values are seeded demonstration records, not live observations.
- Recommendations use simple thresholds, not a trained model or agronomic decision system.
- Frontend authentication is demo-only, client-side state and not MongoDB-backed.
- The Core API JSON file is intended for demonstration; simultaneous writes from multiple processes are not coordinated.
- The frontend currently targets the default Express URL directly; changing the backend port requires updating the API base URL.
