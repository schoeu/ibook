/**
 * @file index.js
 * @description 文档入口文件
 * @author schoeu
 * */
const path = require('path');
const files = require('./src/files');
const config = require('./src/config');
// 获取配置信息
let mdb = require('./src/index')(path.join(__dirname, './config.json'));
const filePath = config.get('path');
const dirNames = config.get('dirNames');

mdb.router.all('/', ctx => {
    let filtRs = files.walker(filePath, dirNames);
    let flieInfos = Object.assign({}, filtRs, {menus: files.getMenusInfo()});
    ctx.body = JSON.stringify(flieInfos);
});

mdb.router.all('/home', ctx => {
    let filtRs = files.walker(filePath, dirNames);
    let flieInfos = Object.assign({}, filtRs, {menus: files.getMenusInfo()});
    ctx.body = JSON.stringify(flieInfos);
});