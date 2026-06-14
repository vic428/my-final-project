require('dotenv').config();

const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const ROOT_DIR = __dirname;
const PORT = Number(process.env.PORT) || 8000;
const CLIENT_ENV_KEYS = ['TMDB_API_KEY', 'YOUTUBE_API_KEY'];

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
}

function resolveRequestPath(requestPath) {
    const pathname = decodeURIComponent(requestPath);
    const normalizedPath = pathname === '/' ? '/index.html' : pathname;
    const absolutePath = path.normalize(path.join(ROOT_DIR, normalizedPath));

    if (!absolutePath.startsWith(ROOT_DIR)) {
        return null;
    }

    return absolutePath;
}

function getClientEnv() {
    return CLIENT_ENV_KEYS.reduce((env, key) => {
        if (process.env[key]) {
            env[key] = process.env[key];
        }

        return env;
    }, {});
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    if (requestUrl.pathname === '/env.json') {
        sendJson(res, 200, getClientEnv());
        return;
    }

    const filePath = resolveRequestPath(requestUrl.pathname);
    if (!filePath) {
        sendJson(res, 403, { error: 'Forbidden' });
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            sendJson(res, 404, { error: 'Not found' });
            return;
        }

        sendFile(res, filePath);
    });
});

server.listen(PORT, () => {
    console.log(`Film Discovery server running at http://localhost:${PORT}`);
});
