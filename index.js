/**
 * @file index.js
 * @description ibook入口文件
 * @author schoeu
 * */

const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const defaultPort = 8910;

module.exports = (config = {}) => {
    const port = config.port || defaultPort;
    const app = new Koa();
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);
    return {
        app,
        router
    };
};
