#!/usr/bin/env node

/**
 * Development Server with Live Reload
 * Automatically reloads the browser when files change
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const ROOT = __dirname;

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
};

// Live reload script to inject
const liveReloadScript = `
<script>
(function() {
    let lastUpdate = Date.now();
    const checkInterval = 1000; // Check every second

    function checkForUpdates() {
        fetch('/__livereload__?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                if (data.timestamp > lastUpdate) {
                    console.log('[Live Reload] Changes detected, reloading...');
                    location.reload();
                }
            })
            .catch(() => {}); // Ignore errors
    }

    setInterval(checkForUpdates, checkInterval);
    console.log('[Live Reload] Watching for changes...');
})();
</script>
`;

// Track last modification time
let lastModified = Date.now();

// Watch for file changes
function watchFiles() {
    const extensions = ['.html', '.css', '.js', '.json'];

    function watchDir(dir) {
        try {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                    watchDir(filePath);
                } else if (stat.isFile() && extensions.includes(path.extname(file))) {
                    fs.watch(filePath, (eventType) => {
                        if (eventType === 'change') {
                            console.log(`[Watch] File changed: ${file}`);
                            lastModified = Date.now();
                        }
                    });
                }
            });
        } catch (err) {
            // Ignore errors for inaccessible directories
        }
    }

    watchDir(ROOT);
    console.log('[Watch] Watching for file changes...');
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Live reload endpoint
    if (pathname === '/__livereload__') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ timestamp: lastModified }));
        return;
    }

    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(ROOT, pathname);

    // Security: prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // Check if file exists
    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Get MIME type
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': mimeType });

            // Inject live reload script into HTML files
            if (ext === '.html') {
                const html = data.toString();
                const modifiedHtml = html.replace('</body>', liveReloadScript + '</body>');
                res.end(modifiedHtml);
            } else {
                res.end(data);
            }
        });
    });
});

// Start server
server.listen(PORT, 'localhost', () => {
    console.log('=================================');
    console.log('  Development Server Started!');
    console.log('=================================');
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log('  Press Ctrl+C to stop');
    console.log('=================================');

    // Start watching files
    watchFiles();
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n[Server] Shutting down...');
    server.close(() => {
        console.log('[Server] Server closed');
        process.exit(0);
    });
});
