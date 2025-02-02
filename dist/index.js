"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const worker_threads_1 = require("worker_threads");
const ws_1 = __importDefault(require("ws"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Enable CORS for all origins
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
// WebSocket server setup
const wss = new ws_1.default.Server({ noServer: true });
// Handle WebSocket connection
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    // Send a message to the client
    ws.send('Connected to WebSocket server');
});
// Upgrade HTTP server to handle WebSocket requests
app.server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// Handle WebSocket upgrade
app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
// Start Task API for factorial, expensive, and prime tasks
app.get('/start-task', (req, res) => {
    const { task, value } = req.query;
    const worker = new worker_threads_1.Worker('./dist/worker.js');
    worker.on('message', (result) => {
        res.send({ result });
        worker.terminate();
    });
    worker.on('error', (err) => {
        res.status(500).send({ error: 'Worker thread error', details: err.message });
        worker.terminate();
    });
    worker.postMessage({ task: String(task), value: Number(value) });
});
