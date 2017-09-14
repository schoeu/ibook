/**
 * @file files.js
 * @description 有关于文件操作的逻辑
 * @author schoeu
 * */
const fs = require('fs');
const path = require('path');

/**
 * 获取文件目录树
 *
 * @config
 * @params {Object} config 遍历文档目录所需配置
 * @params {path} config.dirs 需要遍历的文档的路径
 * @params {Array} config.dirname 目录名字对应信息
 * @params {Array} config.ignoreDir 遍历时需要忽略的文档
 * @return {Object} 文件目录树对象
 * */
module.exports = (config = {}) => {
    let dirs = config.path;
    let dirname = config.dirname || [];
    let walkArr = [];
    let dirnameMap = {};
    let ignorDor = config.ignoreDir || [];

    if (typeof dirs !== 'string') {
        throw new Error('please input valid dirs path.');
    }

    if (!path.isAbsolute(dirs)) {
        dirs = path.join(process.cwd(), dirs);
    }

    docWalker(dirs, walkArr);
    function docWalker(dirs, dirCtt) {
        let dirArr = fs.readdirSync(dirs);
        dirArr = dirArr || [];
        dirArr.forEach(it => {
            let childPath = path.join(dirs, it);
            let stat = fs.statSync(childPath);
            let relPath = childPath.replace(dirs || '', '');
            // 如果是文件夹就递归查找
            if (stat.isDirectory()) {

                // 如果是配置中忽略的目录,则跳过
                if (ignorDor.indexOf(it) === -1) {
                    // 文件夹设置名称获取
                    let crtName = it || '';

                    for (let index = 0, length = dirname.length; index < length; index++) {
                        let dnItems = dirname[index];
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
                        child: childArr,
                        index: 10000
                    });
                    docWalker(childPath, childArr);
                    childArr.sort(function (x, y) {
                        return x.index >= y.index;
                    });
                }
            }
            // 如果是文件
            else {
                if (/^\.md$|html$|htm$/i.test(path.extname(it))) {
                    let basename = path.basename(it, path.extname(it));
                    let mdInfos = getMdInfos(childPath);
                    let index =
                    dirCtt.push({
                        itemName: basename,
                        type: 'file',
                        index: mdInfos.index,
                        path: relPath,
                        title: mdInfos.title
                    });
                }
            }

        });
    }

    return {
        walkArr,
        dirnameMap
    };
};

/**
 * 获取markdown文件信息
 *
 * @params {string} dir markdown文件的路径
 * @return {string} markdown文件大标题
 * */
function getMdInfos(dir) {
    if (!dir) {
        throw new Error ('Dir must be a path string.');
    }
    let titleArr;
    let ext = path.extname(dir);
    dir = decodeURIComponent(dir);
    let content = fs.readFileSync(dir).toString();
    let indexInfo = /<!--\s*file-index\s*:\s*(\d+)?\s*-->/.exec(content) || [];
    if (ext === '.md') {
        titleArr =  /^\s*#+\s?([^#\r\n]+)/.exec(content) || [];
    }
    else if (ext === '.html' || ext === '.htm') {
        titleArr = /<title>(.+?)<\/title>/.exec(content) || [];
    }

    return {
        index: indexInfo[1] === undefined ? 10000 : +indexInfo[1],
        title: titleArr[1] || ''
    };
}
