/*
 * @Descripttion: 解析vue.js里面的内容
 * @Author: lukasavage
 * @Date: 2022-05-24 17:19:28
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 21:19:07
 * @FilePath: \vite-demo\packages\vite-cli\lib\serverPluginModuleResolve.js
 */
const fs = require('fs').promises;
const node_modulesRegexp = /^\/node_modules\/\.vite\/(.+?)\.js/;
const { resolveVue } = require('./utils');

function moduleResolvePlugin({ app, root }) {
	const vueResolved = resolveVue(root);
	app.use(async (ctx, next) => {
		/* 
            拓展一下：
                ctx.url: '/node_modules/.vite/deps/vue.js?v=0e64aa70'
                ctx.path: '/node_modules/.vite/deps/vue.js'
                ctx.query: { v: 0e64aa70 }
        */
		if (!node_modulesRegexp.test(ctx.path)) {
			return next();
		}
		console.log(1);
		const moduleId = ctx.path.match(node_modulesRegexp)[1];
		const modulePath = vueResolved[moduleId];
		//如果vite预构建
		//const modulePath = path.join(root, ctx.path)
		const content = await fs.readFile(modulePath, 'utf8');
		ctx.type = 'js';

		ctx.body = content;
	});
}
module.exports = moduleResolvePlugin;
