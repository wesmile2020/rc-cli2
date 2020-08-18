#!/usr/bin/env node
const fs = require('fs');
const utils = require('./utils');
const path = require('path');
const package = require('./package.json');

const cwd = process.cwd();
const [, , ...args] = process.argv;
const templateUrl = path.resolve(__dirname, 'template');

function init() {
    if (args.length === 0) {
        console.log(`you can use:\n rc-cli2 create \nrc-cli2 init \nrc-cli2 -v`);
        return;
    }
    if (args[0] === 'init') {
        const dir = fs.readdirSync(cwd);
        if (dir.length !== 0) {
            console.log(`rc-cli2 init: this dir is not empty`);
            return;
        }
        utils.copyFile(templateUrl, cwd, { exclude: 'node_modules' });
        const ignoreInput = path.resolve(__dirname, 'ignore.txt');
        const ignoreOutput = path.resolve(cwd, '.gitignore');
        fs.copyFileSync(ignoreInput, ignoreOutput);
        console.log('you react template init finish');
    }
    if (args[0] === 'create') {
        const name = args[1];
        if (!name) {
            console.log(`rc-cli2 create: rc-cli2 create [name]`);
            return;
        }
        const toPath = path.resolve(cwd, name);
        if (fs.existsSync(toPath)) {
            console.log(`rc-cli2 create: ${name} dir is exit`);
            return;
        }
        fs.mkdirSync(toPath);
        utils.copyFile(templateUrl, toPath, { exclude: 'node_modules' });
        const ignoreInput = path.resolve(__dirname, 'ignore.txt');
        const ignoreOutput = path.resolve(toPath, '.gitignore');
        fs.copyFileSync(ignoreInput, ignoreOutput);
        console.log('you react template init finish');
    }

    if (args[0] === '-v') {
        console.log(`rc-cli2: version ${package.version}`);
    }
}

init();
