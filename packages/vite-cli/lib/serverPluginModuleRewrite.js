/*
 * @Descripttion: 模块重写插件，专门用于将esm导入的模块进行路径的改写的
 * @Author: lukasavage
 * @Date: 2022-05-23 18:52:41
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 16:52:07
 * @FilePath: \vite-demo\packages\vite-cli\lib\serverPluginModuleRewrite.js
 */
const { readBody } = require('./utils.js');
const { parse } = require('es-module-lexer');
const MagicString = require('magic-string');
const hash = require('hash-sum');
const path = require('path');

/**
 * 读取响应体函数
 * @param {*} content
 * @returns
 */
async function rewriteImports(content, relativePath) {
	const magicString = new MagicString(content);
	const imports = await parse(content);
    console.log(imports);
	if (imports && imports[0].length > 0) {
		imports[0].forEach(({ n, s, e }) => {
			//如果开头既不是/也不是.的话才会需要替换
			if (/^[^\/\.]/.test(n)) {
				magicString.overwrite(
					s,
					e,
					`/node_modules/.vite/${n}.js?v=${hash(relativePath)}`
				);
			}
		});
	}
	return magicString.toString();
}

function moduleRewritePlugin({ root, app }) {
	app.use(async (ctx, next) => {
		await next();
		//如果有响应体，并且此响应体的内容类型是js  mime-type=application/javascript
		if (ctx.body && ctx.response.is('js')) {
            // 拿到相对路径为了解析成hash唯一值拼接成 ?v=0e64aa70
			const relativePath = path.relative(root, ctx.path);
            // readbody会把整个文件toString化，变成一个字符串
			const content = await readBody(ctx.body);
			// 拿到内容后重写导入路径
			const result = await rewriteImports(content, relativePath);
			ctx.body = result;
		}
	});
}

module.exports = moduleRewritePlugin;
