const express = require('express');
const { connectToDatabase } = require('./db');
const plotsRouter = require('./routes/plots');
const weatherRouter = require('./routes/weather');
const recommendationsRouter = require('./routes/recommendations');

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/plots', plotsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/recommendations', recommendationsRouter);

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use((error, req, res, _next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' });
  }
  res.status(500).json({ error: 'Server error. Check that MongoDB is running and try again.' });
});

connectToDatabase()
  .then(() => app.listen(port, () => console.log(`Smart irrigation API running at http://localhost:${port}`)))
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  });
