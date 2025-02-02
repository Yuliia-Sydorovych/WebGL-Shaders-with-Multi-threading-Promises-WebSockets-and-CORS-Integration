import express, { Application } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { Worker } from 'worker_threads';
import WebSocket from 'ws';
import path from 'path';

const app = express() as Application & { server?: Server };
const port = 3000;

// Enable CORS for all origins
app.use(cors()); 
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) =>
    {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connection
wss.on('connection', (ws) =>
{
    ws.on('message', (message) =>
    {
        console.log('received: %s', message);
    });

    // Send a message to the client
    ws.send('Connected to WebSocket server');
});

// Upgrade HTTP server to handle WebSocket requests
app.server = app.listen(port, () =>
{
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle WebSocket upgrade
app.server.on('upgrade', (request, socket, head) =>
{
    wss.handleUpgrade(request, socket, head, (ws) =>
    {
        wss.emit('connection', ws, request);
    });
});

// Start Task API for factorial, expensive, and prime tasks
app.get('/start-task', (req, res) =>
{
    const { task, value } = req.query;
    const worker = new Worker('./dist/worker.js');

    worker.on('message', (result) =>
    {
        res.send({ result });
        worker.terminate();
    });

    worker.on('error', (err) =>
    {
        res.status(500).send({ error: 'Worker thread error', details: err.message });
        worker.terminate();
    });

    worker.postMessage({ task: String(task), value: Number(value) });
});
