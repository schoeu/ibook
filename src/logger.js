/**
 * @file logger.js
 * @description 日志模块
 * @author schoeu
 * */

const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

const config = require('./config');

const maxSize = 1024 * 1024 * 5;
const accessLogName = 'access.log';
const errorLogName = 'error.log';

// 时间格式化方法
const dateFormat = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};

let loggerPath = config.get('logPath');
// 日志文件设置,如果是绝对路径,则使用绝对路径, 如果是相对路径,则计算出最终路径
if (!path.isAbsolute(loggerPath)) {
    loggerPath = path.join(process.cwd(), loggerPath);
}

// 没有该目录则创建
fs.mkdirsSync(loggerPath);

const accesslog = path.join(loggerPath, accessLogName);
const errorlog = path.join(loggerPath, errorLogName);

const accessLoggerTransport = new DailyRotateFile({
    name: 'access',
    filename: accesslog,
    timestamp: dateFormat,
    level: config.get('logLevel'),
    colorize: true,
    maxsize: maxSize,
    datePattern: '.yyyy-MM-dd'
});
const errorTransport = new DailyRotateFile({
    name: 'error',
    filename: errorlog,
    timestamp: dateFormat,
    level: 'error',
    colorize: true,
    maxsize: maxSize,
    datePattern: '.yyyy-MM-dd'
});

/**
 * 日志方法定义
 * @param {string} loggerPath 日志路径
 * @return {Object}
 * */
module.exports = new winston.Logger({
    transports: [
        accessLoggerTransport,
        errorTransport
    ]
});
