# Ibook

对文档信息，Koa，Koa-router的简单封装，适用于文档平台获取文档信息部分.

## Input

|属性|说明|默认|是否必选
|---|---|---|---
|port|端口|8910|否
|ignoreDir|忽略文件夹名|无|否
|path|读取文档的路径|无|是
|dirname|目录对应名称|文件夹名称|否

## Output

|属性|说明|
|---|---|
|app|koa实例
|router|koa-router对象|
|files|文档的路径，标题信息|

其中files对象是文档目录递归后结果，数据结构如下
```
{
  walkArr: [
    // 当为文件夹的时候
    {
      // 子目录
      child: [
        // child中的结构与外层文件/文件夹层级一致
        ...
      ],
      // 显示的名称，和dirname中的信息一一对应
      displayName: '',
      // 文件名称
      itemName: '',
      // 文件路径
      path: '',
      // 文件类型，dir为文件夹，file为文件
      type: ''
    }]
    // 当为文件的时候
    {
      itemName: '',
      path: '',
      title: '',
      type: ''
    }
}
```
