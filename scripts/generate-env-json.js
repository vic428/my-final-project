const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env');
const CLIENT_ENV_KEYS = ['TMDB_API_KEY', 'YOUTUBE_API_KEY'];
const outputArgument = process.argv.find(argument => argument.startsWith('--output='));
const outputPathValue = outputArgument ? outputArgument.split('=')[1] : 'env.json';
const OUTPUT_FILE_PATH = path.resolve(ROOT_DIR, outputPathValue);
const ENV_VALIDATORS = {
    TMDB_API_KEY: {
        test: value => /^[a-f0-9]{32}$/i.test(value),
        message: 'TMDB_API_KEY must be the actual 32-character TMDB API key value, not a label like "TMDB API KEY".'
    },
    YOUTUBE_API_KEY: {
        test: value => /^AIza[0-9A-Za-z_-]{20,}$/.test(value),
        message: 'YOUTUBE_API_KEY must be the actual Google API key value and usually starts with "AIza".'
    }
};

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

const invalidKeys = CLIENT_ENV_KEYS
    .map(key => ({ key, validator: ENV_VALIDATORS[key], value: clientEnv[key] }))
    .filter(({ validator, value }) => validator && !validator.test(value));

if (invalidKeys.length > 0) {
    invalidKeys.forEach(({ key, message, validator }) => {
        console.error(`${key} is invalid. ${validator.message}`);
    });
    process.exit(1);
}

fs.mkdirSync(path.dirname(OUTPUT_FILE_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_FILE_PATH, `${JSON.stringify(clientEnv, null, 2)}\n`, 'utf8');
console.log(`Generated ${path.basename(OUTPUT_FILE_PATH)} with ${CLIENT_ENV_KEYS.join(', ')}`);
