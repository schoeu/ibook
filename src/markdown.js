/**
 * @file markdown.js
 * @description markdown处理逻辑
 * @author schoeu
 * */
const logger = require('./logger.js');
const config = require('./config');

module.exports = {
    /**
     * 处理mardown文档请求
     *
     * @param {Object} req 请求对象
     * @param {Object} res 相应对象
     * @param {Function} next 相应对象
     * */
    mdHandler: function (req, res, next) {
        let me = this;
        let headers = req.headers;
        let ua = headers['user-agent'] || '';
        let time = Date.now();

        let relativePath = url.parse(req.originalUrl);
        let pathName = relativePath.pathname || '';
        let mdPath = path.join(config.get('path'), pathName);
        let isPjax = headers['x-pjax'] === 'true';
        mdPath = decodeURIComponent(mdPath);
        fs.readFile(mdPath, 'utf8', function (err, file) {
            let content = '';
            if (file) {
                // 请求页面是否在缓存中
                let hasCache = cache.has(pathName);

                if (hasCache) {
                    content = cache.get(pathName);
                }
                else  {
                    // markdown转换成html
                    content = utils.getMarked(file.toString());

                    // 有内容才缓存
                    content && cache.set(pathName, content);
                }

                // 编辑页逻辑
                let editPath =  editPathRoot ? editPathRoot + pathName : '';

                // 判断是pjax请求则返回html片段
                if (isPjax) {
                    let rsPjaxDom = utils.getPjaxContent(pathName, content, editPath);
                    res.end(rsPjaxDom);
                }
                // 否则返回整个模板
                else {
                    let parseObj = Object.assign(
                        {}, me.locals,
                        {
                            navData: htmlStr,
                            mdData: content,
                            editPath: editPath
                        });
                    res.render('main', parseObj);
                }
                logger.info({
                    access: pathName,
                    isCache: hasCache,
                    error: null,
                    referer: headers.referer,
                    ua: ua,
                    during: Date.now() - time + 'ms'
                });
            }
            // 如果找不到文件,则返回错误提示页
            else if (err) {
                // 错误页面
                let errPg = utils.compilePre('error', {errorType: notfound});

                // 判断是pjax请求则返回html片段
                if (isPjax) {
                    res.end(utils.getPjaxContent(pathName, errPg));
                }
                // 否则返回整个模板
                else {
                    let errPgObj = Object.assign({}, me.locals, {navData: htmlStr, mdData: errPg});
                    res.render('main', errPgObj);
                }
                logger.error(err);
            }
        });
    }
};