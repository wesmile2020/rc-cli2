const fs = require('fs');
const ora = require('ora');

const question = require('./question');
const FSUtils = require('./FSUtils');
const log = require('./log');
const initTemplate = require('./initTemplate');

async function init(target) {
    const spinner = ora({
        text: 'downloading...',
    });
    let projectName = FSUtils.getFileName(target);

    const dir = fs.readdirSync(target);
    if (dir.length !== 0) {
        log.error(`rc-cli2 init: this dir ${projectName} is not empty`);
        return
    }
    let description = '';
    try {
        const answer = await question(projectName);
        projectName = answer.projectName;
        description = answer.description;
    } catch (error) {
        log.error('rc-cli2 init error:', error.message);
    }
    initTemplate(target, {
        name: projectName,
        description,
    });
}

module.exports = init;
