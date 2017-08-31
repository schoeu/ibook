/**
 * @file config.js
 * @description 配置操作
 * @author schoeu
 * */

const path = require('path');
const fs = require('fs-extra');
let confCahe = '';

module.exports = {
    init(conf) {
        let me = this;

        conf = conf || '';
        if (!conf.trim()) {
            throw new Error('not valid conf file.');
        }
        // 缓存参数
        confCahe = conf;

        // 默认配置,减少配置文件条目数,增加易用性与容错
        let defaultOptions = {
            path: path.dirname(conf),
        };

        if (!path.isAbsolute(conf)) {
            conf = path.join(process.cwd(), conf);
        }

        // 读取配置内容
        if (path.extname(conf).trim === '') {
            conf = path.join(conf, defaultOptions.dirsConfName);
        }
        let confJson = fs.readJsonSync(conf);

        // 合并配置
        me.conf = Object.assign({}, defaultOptions, confJson);
    },
    set(key, value) {
        if (this.conf && key) {
            this.conf[key] = value;
            return true;
        }
        return false;
    },
    get(key) {
        if (this.conf && key) {
            let confItem = this.conf[key];
            if (confItem) {
                return confItem;
            }
        }
        return '';
    },
    getAll() {
        return this.conf;
    },
    refresh() {
        this.init(confCahe);
    }
};
