/*
 * @Descripttion: 改文件用于演示es-module-lexer中的parse
 * @Author: lukasavage
 * @Date: 2022-05-23 19:21:43
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-23 19:41:01
 * @FilePath: \vite-demo\docs\imports.js
 */

const { parse } = require('es-module-lexer');
const MagicString = require('magic-string');

(async bodyContent => {
	const ms = new MagicString(bodyContent);
	console.log(ms);
	const imports = await parse(bodyContent);
	console.log(imports);
})(`import {createApp} from 'vue'`);
