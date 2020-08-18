const Oss = require('ali-oss');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../uploadConfig.json');

const { targetPath, version } = config;
const output = `${targetPath}${version ? '/' + version : '' }`;
const distPath = path.resolve(__dirname, '..', config.uploadDir);

const client = new Oss({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    region: config.region,
});

function listFile(output) {
    return client.list({
        prefix: `${output}/`,
        'max-keys': 1000,
    });
}

function deleteFiles(files) {
    if (Array.isArray(files)) {
        return client.deleteMulti(files, {
            quite: true,
        });
    } else {
        return client.delete(files);
    }
}

function loopUpload(entry, output) {
    const promises = [];
    function loop(entry, output) {
        const dir = fs.readdirSync(entry);
        for (let i = 0; i < dir.length; i += 1) {
            const stats = fs.statSync(`${entry}/${dir[i]}`);
            if (stats.isDirectory()) {
                loop(`${entry}/${dir[i]}`, `${output}/${dir[i]}`);
            } else if (stats.isFile()) {
                const promise = client.put(`${output}/${dir[i]}`, `${entry}/${dir[i]}`);
                promise.then(() => {
                    console.log(chalk.green(`> Upload ${entry}/${dir[i]} success`));
                }, () => {
                    console.log(chalk.red(`> Upload ${entry}/${dir[i]} failed`));
                });
                promises.push(promise);
            }
        }
    }

    loop(entry, output);
    return Promise.all(promises);
}

function upload(entry, output) {
    if (fs.existsSync(entry)) {
        const stats = fs.statSync(entry);
        stats.isDirectory() && listFile(output).then(async (res) => {
            try {
                if (res.objects) {
                    const exitFiles = res.objects.map(val => val.name);
                    await deleteFiles(exitFiles);
                    console.log(chalk.green('> Delete exit files success'));
                }
                await loopUpload(entry, output);
                console.log(chalk.green('> Upload all success'));
                console.log(chalk.bgGreen(chalk.white(`url: ${config.baseUrl}/${output}/index.html`)));
            } catch (error) {
                console.log(chalk.red('> Upload filed'));
            }
        });
    }
}

upload(distPath, output);
