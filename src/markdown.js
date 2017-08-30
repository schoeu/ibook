module.exports = {
    /**
     * 处理mardown文档请求
     *
     * @param {Object} req 请求对象
     * @param {Object} res 相应对象
     * @param {Function} next 相应对象
     * */
    mdHandler: function (req, res, next) {
        var me = this;
        var headers = req.headers;
        var ua = headers['user-agent'] || '';
        var time = Date.now();

        var relativePath = url.parse(req.originalUrl);
        var pathName = relativePath.pathname || '';
        var mdPath = path.join(config.get('path'), pathName);
        var isPjax = headers['x-pjax'] === 'true';
        mdPath = decodeURIComponent(mdPath);
        fs.readFile(mdPath, 'utf8', function (err, file) {
            var content = '';
            if (file) {
                // 请求页面是否在缓存中
                var hasCache = cache.has(pathName);

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
                var editPath =  editPathRoot ? editPathRoot + pathName : '';

                // 判断是pjax请求则返回html片段
                if (isPjax) {
                    var rsPjaxDom = utils.getPjaxContent(pathName, content, editPath);
                    res.end(rsPjaxDom);
                }
                // 否则返回整个模板
                else {
                    var parseObj = Object.assign(
                        {}, me.locals,
                        {navData: htmlStr,
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
                var errPg = utils.compilePre('error', {errorType: errorType.notfound});

                // 判断是pjax请求则返回html片段
                if (isPjax) {
                    res.end(utils.getPjaxContent(pathName, errPg));
                }
                // 否则返回整个模板
                else {
                    var errPgObj = Object.assign({}, me.locals, {navData: htmlStr, mdData: errPg});
                    res.render('main', errPgObj);
                }
                logger.error(err);
            }
        });
    }
};