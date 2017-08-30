const Koa = require('koa');
const files = require('./files');
const config = require('./config');
const port = config.get('port');
const filePath = config.get('path');
const dirNames = config.get('dirNames');

const app = new Koa();
app.use(ctx => {
    ctx.body = 'h1';

    var filtRs = files.walker(filePath, dirNames);
    console.log(filtRs);
});

app.listen(port);

module.exprots = app;
