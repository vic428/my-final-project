const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_ENTRIES = [
    'detail.html',
    'discovery.html',
    'group.html',
    'index.html',
    'main.js',
    'mood.html',
    'results.html',
    'styles.css',
    'modules',
    'images'
];

function removeDirectoryIfExists(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true, force: true });
    }
}

function copyRecursive(sourcePath, destinationPath) {
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
        fs.mkdirSync(destinationPath, { recursive: true });

        fs.readdirSync(sourcePath).forEach(entryName => {
            copyRecursive(
                path.join(sourcePath, entryName),
                path.join(destinationPath, entryName)
            );
        });

        return;
    }

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
}

removeDirectoryIfExists(DIST_DIR);
fs.mkdirSync(DIST_DIR, { recursive: true });

PUBLIC_ENTRIES.forEach(entryName => {
    const sourcePath = path.join(ROOT_DIR, entryName);
    if (!fs.existsSync(sourcePath)) return;

    copyRecursive(sourcePath, path.join(DIST_DIR, entryName));
});

console.log(`Prepared GitHub Pages dist folder at ${DIST_DIR}`);
