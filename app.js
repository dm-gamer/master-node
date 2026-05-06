const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hi from Jenkins 🚀');
});

const PORT = 3000;

server.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
});