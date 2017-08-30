/**
 * @file index.js
 * @description 文档入口文件
 * @author schoeu
 * */

const path = require('path');
const config = require('./src/config');

config.init(path.join(__dirname, './config.json'));

// 获取配置信息
var mdb = require('./src/index');
