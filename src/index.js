/**
 * @file index.js
 * @description markdown-book入口文件
 * @author schoeu
 * */

const Koa = require('koa');
const files = require('./files');
const config = require('./config');

module.exprots = configPath => {
    config.init(configPath);
    const port = config.get('port');
    const filePath = config.get('path');
    const dirNames = config.get('dirNames');

    const app = new Koa();
    app.use(ctx => {
        let filtRs = files.walker(filePath, dirNames);
        let flieInfos = Object.assign({}, filtRs, {menus: files.getMenusInfo()});
        ctx.body = JSON.stringify(flieInfos);
    });

    app.listen(port);
    return app;
};
