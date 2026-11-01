const http = require('node:http');
const { URL } = require('node:url');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const PORT = Number(process.env.CORE_PORT || 4000);
const DATA_FILE = path.join(__dirname, 'data', 'plots.json');

async function readPlots() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    const contents = await fs.readFile(DATA_FILE, 'utf8');
    const plots = JSON.parse(contents);
    if (!Array.isArray(plots)) throw new Error('Data file must contain a JSON array.');
    return plots;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]\n', { flag: 'wx' }).catch((writeError) => {
        if (writeError.code !== 'EEXIST') throw writeError;
      });
      return [];
    }
    throw error;
  }
}

async function writePlots(plots) {
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(plots, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryFile, DATA_FILE);
}

function validatePlot(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object.';
  for (const field of ['plotName', 'location', 'crop']) {
    if (typeof body[field] !== 'string' || !body[field].trim()) return `${field} must be a non-empty string.`;
  }
  for (const field of ['area', 'soilMoisture', 'temperature', 'humidity', 'rainfall']) {
    if (typeof body[field] !== 'number' || !Number.isFinite(body[field])) return `${field} must be a finite number.`;
  }
  if (body.area <= 0) return 'area must be greater than zero.';
  if (body.soilMoisture < 0 || body.soilMoisture > 100) return 'soilMoisture must be between 0 and 100.';
  if (body.humidity < 0 || body.humidity > 100) return 'humidity must be between 0 and 100.';
  if (body.rainfall < 0) return 'rainfall cannot be negative.';
  if (body.temperature < -20 || body.temperature > 60) return 'temperature must be between -20 and 60.';
  return null;
}

function sendJson(res, statusCode, value) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (size === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must contain valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname.replace(/\/$/, '') || '/';

    if (req.method === 'GET' && (pathname === '/' || pathname === '/health')) {
      return sendJson(res, 200, { status: 'ok', service: 'core-node' });
    }

    if (!pathname.startsWith('/plots')) return sendJson(res, 404, { error: 'Endpoint not found.' });
    const id = pathname === '/plots' ? null : pathname.startsWith('/plots/') ? pathname.slice('/plots/'.length) : undefined;
    if (id === undefined || (id !== null && (!id || id.includes('/')))) {
      return sendJson(res, 404, { error: 'Endpoint not found.' });
    }

    if (req.method === 'GET' && id === null) {
      let plots = await readPlots();
      const crop = url.searchParams.get('crop');
      if (crop) plots = plots.filter((plot) => plot.crop.toLowerCase() === crop.toLowerCase());
      return sendJson(res, 200, plots);
    }

    if (req.method === 'GET' && id !== null) {
      const plot = (await readPlots()).find((item) => item.id === id);
      return plot ? sendJson(res, 200, plot) : sendJson(res, 404, { error: 'Plot not found.' });
    }

    if (req.method === 'POST' && id === null) {
      const body = await readBody(req);
      const validationError = validatePlot(body);
      if (validationError) return sendJson(res, 400, { error: validationError });
      const plots = await readPlots();
      const plot = { ...body, id: randomUUID(), plotName: body.plotName.trim(), location: body.location.trim(), crop: body.crop.trim() };
      plots.push(plot);
      await writePlots(plots);
      return sendJson(res, 201, plot);
    }

    if (req.method === 'PUT' && id !== null) {
      const body = await readBody(req);
      const validationError = validatePlot(body);
      if (validationError) return sendJson(res, 400, { error: validationError });
      const plots = await readPlots();
      const index = plots.findIndex((item) => item.id === id);
      if (index < 0) return sendJson(res, 404, { error: 'Plot not found.' });
      plots[index] = { ...body, id, plotName: body.plotName.trim(), location: body.location.trim(), crop: body.crop.trim() };
      await writePlots(plots);
      return sendJson(res, 200, plots[index]);
    }

    if (req.method === 'DELETE' && id !== null) {
      const plots = await readPlots();
      const remaining = plots.filter((item) => item.id !== id);
      if (remaining.length === plots.length) return sendJson(res, 404, { error: 'Plot not found.' });
      await writePlots(remaining);
      return sendJson(res, 200, { message: 'Plot deleted.', id });
    }

    sendJson(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('Core API error:', error.message);
    sendJson(res, error.statusCode || 500, { error: error.statusCode ? error.message : 'Could not read or write plot data.' });
  }
});

server.listen(PORT, () => console.log(`Core Node.js API running at http://localhost:${PORT}`));
