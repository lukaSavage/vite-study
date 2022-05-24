/*
 * @Descripttion: vite配置文件
 * @Author: lukasavage
 * @Date: 2022-05-22 20:51:56
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-05-23 17:44:54
 * @FilePath: \vite-demo\packages\vite-project\vite.config.js
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()]
});
