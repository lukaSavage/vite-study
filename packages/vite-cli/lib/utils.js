/*
 * @Descripttion: 存放一些工具函数
 * @Author: lukasavage
 * @Date: 2022-05-23 19:09:35
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-23 19:09:54
 * @FilePath: \vite-demo\packages\vite-cli\lib\utils.js
 */

const { Readable } = require('stream');
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
