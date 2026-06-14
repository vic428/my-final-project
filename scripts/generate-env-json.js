const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env');
const OUTPUT_FILE_PATH = path.join(ROOT_DIR, 'env.json');
const CLIENT_ENV_KEYS = ['TMDB_API_KEY', 'YOUTUBE_API_KEY'];

function loadEnvFromFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split(/\r?\n/);

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        const separatorIndex = trimmedLine.indexOf('=');
        if (separatorIndex === -1) return;

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, '');

        if (key && !process.env[key]) {
            process.env[key] = value;
        }
    });
}

function getClientEnv() {
    return CLIENT_ENV_KEYS.reduce((env, key) => {
        if (process.env[key]) {
            env[key] = process.env[key];
        }

        return env;
    }, {});
}

try {
    require('dotenv').config({ path: ENV_FILE_PATH });
} catch (error) {
    loadEnvFromFile(ENV_FILE_PATH);
}

const clientEnv = getClientEnv();
const missingKeys = CLIENT_ENV_KEYS.filter(key => !clientEnv[key]);

if (missingKeys.length > 0) {
    console.error(`Missing required environment variables: ${missingKeys.join(', ')}`);
    process.exit(1);
}

fs.writeFileSync(OUTPUT_FILE_PATH, `${JSON.stringify(clientEnv, null, 2)}\n`, 'utf8');
console.log(`Generated ${path.basename(OUTPUT_FILE_PATH)} with ${CLIENT_ENV_KEYS.join(', ')}`);
