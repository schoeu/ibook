/**
 * @file index.js
 * @description ibook入口文件
 * @author schoeu
 * */

const Koa = require('koa');
const Router = require('koa-router');
const config = require('./config');
const router = new Router();

module.exports = configPath => {
    config.init(configPath);
    const port = config.get('port');
    const app = new Koa();
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);
    return {
        app,
        router,
        config: config.getAll()
    };
};
