/**
 * @file files.js
 * @description 有关于文件操作的逻辑
 * @author schoeu
 * */
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./logger.js');
module.exports = {
    /**
     * 获取文件目录树
     *
     * @params {string} dirs 文档根目录路径
     * @params {string} dirname 文档名称数据
     * @return {Object} 文件目录树
     * */
    walker (dirs, dirname) {
        var me = this;
        var walkArr = [];
        var dirnameMap = {};
        var confDirname = dirname || [];
        var ignorDor = []/*config.get('ignoreDir')*/;
        docWalker(dirs, walkArr);
        function docWalker(dirs, dirCtt) {
            var dirArr = fs.readdirSync(dirs);
            dirArr = dirArr || [];
            dirArr.forEach((it) => {
                var childPath = path.join(dirs, it);
                var stat = fs.statSync(childPath);
                var relPath = childPath.replace(config.get('path'), '');
                // 如果是文件夹就递归查找
                if (stat.isDirectory()) {

                    // 如果是配置中忽略的目录,则跳过
                    if (ignorDor.indexOf(it) === -1) {
                        // 文件夹设置名称获取
                        var crtName = it || '';

                        for (var index = 0, length = confDirname.length; index < length; index++) {
                            var dnItems = confDirname[index];
                            if (dnItems[it]) {
                                crtName = dnItems[it].name;
                                dirnameMap[it] = crtName;
                                break;
                            }
                        }

                        // 如果没有配置文件夹目录名称,则不显示
                        var childArr = [];
                        dirCtt.push({
                            itemName: it,
                            type: 'dir',
                            path: relPath,
                            displayName: crtName,
                            child: childArr
                        });
                        docWalker(childPath, childArr);
                    }
                }
                // 如果是文件
                else {
                    if (/^\.md$|html$|htm$/i.test(path.extname(it))) {
                        var basename = path.basename(it, path.extname(it));
                        var title = me.getMdTitle(childPath);
                        dirCtt.push({
                            itemName: basename,
                            type: 'file',
                            path: relPath,
                            title: title
                        });
                    }
                }
            });
        }

        return {
            walkArr: walkArr,
            dirnameMap: dirnameMap
        };
    },

    /**
     * 获取markdown文件大标题
     *
     * @params {string} dir markdown文件的路径
     * @return {string} markdown文件大标题
     * */
    getMdTitle (dir) {
        if (!dir) {
            return '';
        }
        var titleArr = [];
        var ext = path.extname(dir);
        dir = decodeURIComponent(dir);
        var content = fs.readFileSync(dir).toString();

        if (ext === '.md') {
            titleArr =  /^\s*#+\s?([^#\r\n]+)/.exec(content) || [];
            return titleArr[1] || '';
        }
        else if (ext === '.html' || ext === '.htm') {
            titleArr = /<title>(.+?)<\/title>/.exec(content) || [];
            return titleArr[1] || '';
        }
        return '';
    },

    /**
     * 获取菜单配置
     *
     * @return {Array} 标题字符串数组
     * */
    getMenusInfo () {
        return config.get('menus') || [];
    }
};