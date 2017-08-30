const Koa = require('koa');
const files = require('./files');
const config = require('./config');
const port = config.get('port');
const filePath = config.get('path');
const dirNames = config.get('dirNames');

const app = new Koa();
app.use(ctx => {
    var filtRs = files.walker(filePath, dirNames);
    var flieInfos = Object.assign({}, filtRs, {menus: files.getMenusInfo()});
    ctx.body = JSON.stringify(flieInfos);
});

app.listen(port);

module.exprots = app;
