const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Metrics
let requestCount = 0;
let errorCount = 0;

// Routes
app.get('/api/health', (req, res) => {
    requestCount++;
    console.log(`[INFO] Health check request received. Total requests: ${requestCount}`);
    res.json({ status: 'healthy', requestCount });
});

app.get('/api/error', (req, res) => {
    errorCount++;
    console.error(`[ERROR] Error endpoint called. Total errors: ${errorCount}`);
    res.status(500).json({ error: 'Something went wrong', errorCount });
});

app.get('/api/metrics', (req, res) => {
    console.log(`[INFO] Metrics requested. Requests: ${requestCount}, Errors: ${errorCount}`);
    res.json({ requestCount, errorCount });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`[INFO] Server running on port ${port}`);
}); 