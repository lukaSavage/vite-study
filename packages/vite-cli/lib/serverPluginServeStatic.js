/*
 * @Descripttion: 输入静态静态资源的插件
 * @Author: lukasavage
 * @Date: 2022-05-22 12:00:06
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 21:07:52
 * @FilePath: \vite-demo\packages\vite-cli\lib\serverPluginServeStatic.js
 */
const path = require('path');
const static = require('koa-static');
function serveStaticPlugin({ app, root }) {
	app.use(static(root));
}
module.exports = serveStaticPlugin;
