const spawn = require('cross-spawn');
const path = require('path');

const s = `\\${path.sep}`;
let pattern = ['--coverage', '--no-cache', process.argv[2] === 'e2e'
    ? `test${s}e2e${s}.+\\.spec\\.js`
    : `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`
];

let results = spawn.sync(path.normalize('./node_modules/.bin/jest'), pattern, { stdio: 'inherit' });

process.exit(results.status);
