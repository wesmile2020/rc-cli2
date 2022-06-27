const ora = require('ora');
const config = require('./config');
const downGit = require('./downGit');
const FSUtils =  require('./FSUtils');
const path = require('path');

async function initTemplate(target, projectConfig) {
    const spinner = ora({
        text: 'downloading...',
    });
    spinner.start();

    try {
        await downGit(config.templateUrl, target);
        FSUtils.delFile(path.resolve(target, '.git'));

        // 处理 package.json
        FSUtils.updateJson(path.resolve(target, 'package.json'), projectConfig, 2);

        // 处理 index.html
        FSUtils.replaceText(path.resolve(target, 'public', 'index.html'), /\<title\>.*\<\/title\>/ig, `<title>${projectConfig.name}</title>`);

        spinner.succeed('> Your project create success');
    } catch (error) {
        console.log(error);
        spinner.fail('failed:', error.message);
    }
}

module.exports = initTemplate;
