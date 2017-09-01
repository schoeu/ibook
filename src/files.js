/**
 * @file files.js
 * @description 有关于文件操作的逻辑
 * @author schoeu
 * */
const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * 获取文件目录树
     *
     * @params {string} dirs 文档根目录路径
     * @params {string} dirname 文档名称数据
     * @return {Object} 文件目录树
     * */
    walker(dirs, dirname) {
        let me = this;
        let walkArr = [];
        let dirnameMap = {};
        let confDirname = dirname || [];
        let ignorDor = config.get('ignoreDir');
        docWalker(dirs, walkArr);
        function docWalker(dirs, dirCtt) {
            let dirArr = fs.readdirSync(dirs);
            dirArr = dirArr || [];
            dirArr.forEach(it => {
                let childPath = path.join(dirs, it);
                let stat = fs.statSync(childPath);
                let relPath = childPath.replace(config.get('path'), '');
                // 如果是文件夹就递归查找
                if (stat.isDirectory()) {

                    // 如果是配置中忽略的目录,则跳过
                    if (ignorDor.indexOf(it) === -1) {
                        // 文件夹设置名称获取
                        let crtName = it || '';

                        for (let index = 0, length = confDirname.length; index < length; index++) {
                            let dnItems = confDirname[index];
                            if (dnItems[it]) {
                                crtName = dnItems[it].name;
                                dirnameMap[it] = crtName;
                                break;
                            }
                        }

                        // 如果没有配置文件夹目录名称,则不显示
                        let childArr = [];
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
                        let basename = path.basename(it, path.extname(it));
                        let title = me.getMdTitle(childPath);
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
            walkArr,
            dirnameMap
        };
    }
};
