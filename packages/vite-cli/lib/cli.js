/*
 * @Descripttion: vite-cli实现的入口文件
 * @Author: lukasavage
 * @Date: 2022-05-22 10:09:23
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 17:23:30
 * @FilePath: \vite-demo\packages\vite-cli\lib\cli.js
 */
const Koa = require('koa');
// 此包去除缩进
const dedent = require('dedent');
const serveStaticPlugin = require('./serverPluginServeStatic');
const moduleRewritePlugin = require('./serverPluginModuleRewrite');
const moduleResolvePlugin = require('./serverPluginModuleResolve');

function createServer() {
	// koa实例
	const app = new Koa();
	// 当前命令所在的根目录: /vite-demo
	const root = process.cwd();
	// 上下文
	const context = {
		app,
		root,
	};
	app.use((ctx, next) => {
		Object.assign(ctx, context);
		return next();
	});

	// resolvedPlugins将集中放入插件
	const resolvedPlugins = [
		moduleRewritePlugin,
		moduleResolvePlugin,
		serveStaticPlugin,
	];
	resolvedPlugins.forEach(plugin => plugin(context));

	return app;
}
createServer().listen(9999, async err => {
	// chalk适用于给输入端信息添加样式的
	const chalk = await import('chalk');
	if (!err) {
		console.log(
			dedent(`
            ${chalk.default.green(`vite-cli dev server running at:`)}
            > Local: http://localhost:9999/
        `)
		);
	}
});
