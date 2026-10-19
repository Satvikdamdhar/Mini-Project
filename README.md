# Smart Sugarcane Irrigation Dashboard

The project is organized into two main folders:

- `backend/` — Express REST API and MongoDB access.
- `frontend/` — the existing React + Vite dashboard.

## Smart Sugarcane Irrigation Dashboard

This project contains the existing React dashboard and a small Express + MongoDB backend. The API returns plot measurements, demo weather records, and rule-based irrigation recommendations. The sample weather is stored in the local database and is not live weather data. The recommendation is a rule-based prototype, not a trained AI model.

### Requirements

- Node.js (LTS) and npm
- MongoDB Community Server running on this computer

### Start MongoDB on Windows

Install MongoDB Community Server and configure it to run as a Windows service. In an Administrator PowerShell window, start the service:

```powershell
net start MongoDB
```

You can also open **Services** in Windows and start the **MongoDB Server** service there. The backend connects to `mongodb://127.0.0.1:27017` and creates the `SugarcaneDB` database plus demo records in `plots` and `weather` the first time it starts.

### Start the backend

In a VS Code terminal, from the project folder that contains `backend`:

```powershell
cd "C:\Users\Exam1\Downloads\Mini-Project-main\Mini-Project-main\backend"
npm install
npm start
```

The API listens at `http://localhost:5000`. Keep this terminal open. If MongoDB is installed at a different address, set `MONGODB_URI` before `npm start`.

### Start the React frontend

Open a second VS Code terminal. Run these commands from the `frontend` folder:

```powershell
cd "C:\Users\Exam1\Downloads\Mini-Project-main\Mini-Project-main\frontend"
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. The dashboard’s API base is `http://localhost:5000/api`. Sign in with the existing demo account shown on the login screen.

### Check the API in a browser

With MongoDB and the backend running, open these URLs:

- `http://localhost:5000/api/plots` — all plots
- `http://localhost:5000/api/plots/<plot-id>` — one plot (copy an `_id` from the list)
- `http://localhost:5000/api/weather` — sample weather data, labelled as demo data
- `http://localhost:5000/api/recommendations` — rule-based recommendation for each plot

The response for `/api/recommendations` looks like:

```json
[
  {
    "plotId": "<MongoDB ObjectId>",
    "plotName": "Green Valley Plot",
    "status": "Irrigate",
    "text": "Irrigation is recommended soon.",
    "reason": "Soil moisture is low at 24% and rain probability is 10%.",
    "ruleBasedPrototype": true
  }
]
```

### Confirm MongoDB data is used

The browser GET responses are read from MongoDB. To inspect stored documents directly, open a terminal and run `mongosh`, then:

```javascript
use SugarcaneDB
db.plots.find()
db.weather.find()
```

Add a plot from the existing **Farm Management** form. It is sent to `POST /api/plots` and stored in MongoDB; refresh the dashboard or query `db.plots.find()` to confirm it remains there. If the backend cannot connect to MongoDB, it returns an error and the dashboard displays it instead of reporting a successful save.

### API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/plots` | List plots |
| GET | `/api/plots/:id` | Read one plot |
| POST | `/api/plots` | Add a plot |
| PUT | `/api/plots/:id` | Update a plot |
| DELETE | `/api/plots/:id` | Delete a plot |
| GET | `/api/weather` | Read sample weather |
| GET | `/api/recommendations` | Read rule-based recommendations |

Plot area is in acres, soil moisture and humidity are percentages, temperature is in °C, rainfall is in mm, rain probability is a percentage, and wind speed is in km/h.

### Build and lint the frontend

From the `frontend` folder:

```powershell
npm run build
npm run lint
```

The backend starts only when MongoDB is available; the GET routes can then be checked directly in a browser without Postman.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
