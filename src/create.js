const path = require('path');
const fs = require('fs');

const question = require('./question');
const log = require('./log');
const initTemplate = require('./initTemplate');

async function create(cwd, name) {
    let projectName = name;
    let description = '';
    try {
        const answer = await question(projectName, {
            projectName: (value) => {
                const target = path.resolve(cwd, value);
                if (fs.existsSync(target)) {
                    return `rc-cli2 create: this dir ${value} is exited`;
                }
                return true;
            }
        });
        projectName = answer.projectName;
        description = answer.description;
    } catch (error) {
        log.error('rc-cli2 create error:', error.message);
    }
    const target = path.resolve(cwd, projectName);
    fs.mkdirSync(target);
  
    initTemplate(target, {
        name: projectName,
        description,
    });
}

module.exports = create;
