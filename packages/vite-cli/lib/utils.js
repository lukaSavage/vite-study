/*
 * @Descripttion: 存放一些工具函数
 * @Author: lukasavage
 * @Date: 2022-05-23 19:09:35
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-24 21:28:13
 * @FilePath: \vite-demo\packages\vite-cli\lib\utils.js
 */

const { Readable } = require('stream');
const Module = require('module');

async function readBody(stream) {
	if (stream instanceof Readable) {
		return new Promise(resolve => {
			let buffers = [];
			stream
				.on('data', chunk => buffers.push(chunk))
				.on('end', () => resolve(Buffer.concat(buffers).toString()));
		});
	} else {
		return stream.toString();
	}
}
exports.readBody = readBody;

function resolveVue(root) {
	// require是从当前目录里面找模块
	// 如果想从某个目录里找，可以用createRequire(root)就可以实现从root目录里找模块
	let require = Module.createRequire(root);
	const resolvePath = moduleName =>
		require.resolve(`@vue/${moduleName}/dist/${moduleName}.esm-bundler.js`);
	return {
		// vue的核心包会同时加载以下三个包，所以全部得用上(原版的vite中会把以下4个文件合并成一个vue.js文件)
		vue: resolvePath('runtime-dom'),
		'@vue/shared': resolvePath('shared'),
		// vue的响应式原理包
		'@vue/reactivity': resolvePath('reactivity'),
		'@vue/runtime-core': resolvePath('runtime-core'),
	};
}
exports.resolveVue = resolveVue;
