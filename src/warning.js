/**
 * @file warning.js
 * @author schoeu
 * @description 邮件报警实现
 * */

const config = require('./config');
const warnEmail = config.get('warningEmail');
const waringFlag = config.get('waringFlag');

if (waringFlag) {
    const nodemailer = require('nodemailer');

    /**
     * 发送邮件
     *
     * @param {string} content 邮件内容,支持html
     * */
    exports.sendMail = function (content) {
        if (warnEmail) {
            const transporter = nodemailer.createTransport({
                host: warnEmail.host,
                port: warnEmail.port,
                auth: {
                    user: warnEmail.user,
                    pass: warnEmail.pass
                }
            });

            const mailOptions = {
                from: warnEmail.from,
                to: warnEmail.to,
                subject: warnEmail.subject,
                text: content || ''
            };
            transporter.sendMail(mailOptions, function (error) {
                // 错误处理
            });
        }
    };
}
