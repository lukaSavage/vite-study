/*
 * @Descripttion: 解决process环境变量的插件
 * @Author: lukasavage
 * @Date: 2022-05-24 21:07:23
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 21:18:19
 * @FilePath: \vite-demo\packages\vite-cli\lib\injectProcessPlugin.js
 */
const { readBody } = require('./utils');
function injectProcessPlugin({ root, app }) {
	const devInjection = `
    <script>
        window.process = {env:{NODE_ENV:'development'}}
    </script>
    `;
	app.use(async (ctx, next) => {
		await next();
		console.log(2);
		if (ctx.response.is('html')) {
			const html = await readBody(ctx.body);
			ctx.body = html.replace(/<head>/, `$&${devInjection}`);
		}
	});
}
module.exports = injectProcessPlugin;
