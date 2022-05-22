/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-05-22 12:00:06
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-22 20:59:18
 * @FilePath: \vite-demo\packages\vite-cli\lib\serverPluginServeStatic.js
 */
const path = require('path');
const static = require('koa-static');
function serveStaticPlugin({ app, root }) {
    console.log('执行了插件111', );
	app.use(static(root));
}
module.exports = serveStaticPlugin;
