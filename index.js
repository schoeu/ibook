/**
 * @file index.js
 * @description ibook入口文件
 * @author schoeu
 * */

const os = require('os');
const chalk = require('chalk');
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const fileInfos = require('./src/files');
const defaultPort = 8910;


module.exports = (config = {}) => {
    const port = config.port || defaultPort;
    const app = new Koa();
    let files = fileInfos(config);
    let ip = getLocalRealIp();
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);
    console.log('server listening on ', chalk.green(`http://${ip}:${port}`));
    return {
        app,
        router,
        files
    };
};

/**
 * 获取IP地址
 *
 * @return {string} 返回本地IP
 * */
function getLocalRealIp() {
    let ifaces = os.networkInterfaces();
    let defultAddress = '127.0.0.1';
    let ip = defultAddress;

    for (let dev of Object.keys(ifaces)) {
        if (ifaces[dev]) {
            ifaces[dev].forEach(function (details) {
                if (ip === defultAddress && details.family === 'IPv4') {
                    ip = details.address;
                }
            });
        }
    }
    return ip;
}
