/**
 * @file index.js
 * @description 文档入口文件
 * @author schoeu
 * */

const path = require('path');

// 获取配置信息
var Mdb = require('./src/index');
var Mb = new Mdb(path.join(__dirname, './config.json'));
console.log(Mb);