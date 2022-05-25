/*
 * @Descripttion: 用于解析.vue文件的
 * @Author: lukasavage
 * @Date: 2022-05-25 20:14:29
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-25 21:51:46
 * @FilePath: \vite-demo\packages\vite-cli\lib\vuePlugin.js
 */

const fs = require('fs').promises;
const path = require('path');
const hash = require('hash-sum');
const {
	parse,
	compileScript,
	compileTemplate,
	rewriteDefault,
} = require('@vue/compiler-sfc');
// 针对于第一次加载App.vue做一次缓存，防止在解析css文件的时候多次请求
const descriptorCache = new Map();
function vuePlugin({ root, app }) {
	app.use(async (ctx, next) => {
		// 如果不是vue结尾的文件，直接return
		if (!ctx.path.endsWith('.vue')) {
			return await next();
		}
		const filePath = path.join(root, ctx.path);
		const descriptor = await getDescriptor(filePath, root);
		if (ctx.query.type === 'style') {
			const block = descriptor.styles[Number(ctx.query.index)];
            console.log(block.content);
			ctx.type = 'js';
			ctx.body = `
                let style = document.createElement('style');
                style.innerHTML = ${JSON.stringify(block.content)};
                document.head.appendChild(style);
            `;
		} else {
			let targetCode = ``;
			// css
			if (descriptor.styles.length) {
				let stylesCode = '';
				descriptor.styles.forEach((style, index) => {
					const query = `?vue&type=style&index=${index}&lang.css`;
					const id = ctx.path;
					const styleRequest = (id + query).replace(/\\/g, '/');
					stylesCode += `\nimport ${JSON.stringify(styleRequest)}`;
				});
				targetCode += stylesCode;
			}
			//js
			if (descriptor.script) {
				let script = compileScript(descriptor, {
					reactivityTransform: false,
				});
				scriptCode = rewriteDefault(script.content, '_sfc_main');
				targetCode += scriptCode;
			}
			//template
			if (descriptor.template) {
				let templateContent = descriptor.template.content;
				const { code: templateCode } = compileTemplate({
					source: templateContent,
				});
				targetCode += templateCode;
			}
			targetCode += `\n_sfc_main.render=render`;
			targetCode += `\nexport default _sfc_main`;
			ctx.type = 'js';
			ctx.body = targetCode;
		}
	});
}
async function getDescriptor(filePath) {
	if (descriptorCache.has(filePath)) {
		return descriptorCache.get(filePath);
	}
	const content = await fs.readFile(filePath, 'utf8');
	const { descriptor } = parse(content, { filename: filePath });
	// descriptor是一个对象，里面有filename、template等等信息
	descriptorCache.set(filePath, descriptor);
	return descriptor;
}
module.exports = vuePlugin;
