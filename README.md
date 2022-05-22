# vite源码学习

```
序篇介绍：
本项目主要是仓库从零手写一个类似vite1.x的脚手架，其主旨主要是理解vite的来龙去脉，彻底掌握vite；
```

## 一、单体仓库与多仓库的认知

### 1.1 单体仓库（`monoRepo`）和多仓库（multiRepo）的区别？

- monoRepo是将所有的模块统一的放在一个主干分支之中管理 (即一个仓库里面放很多个包)
- multiRepo 将项目分化成为多个模块，并针对每一个模块单独的开辟一个Repo来进行管理 (即每个仓库里面放一个包)

### 1.1.1 多仓库（multiRepo）

​	多仓库为我们带来的好处如下↓

1. 每一个服务都有一个独立的仓库，职责单一。
2. 代码量和复杂性受控，服务由不同的团队独立维护、边界清晰。
3. 单个服务也易于自治开发测试部署和扩展，不需要集中管理集中协调。
4. 利于进行权限控制，可以针对单个仓库来分配权限，权限分配粒度比较细。

但同时，多仓库也存在一下的问题：

1. 项目代码不容易规范。每个团队容易各自为政，随意引入依赖，code review 无法集中开展，代码风格各不相同。
2. 项目集成和部署会比较麻烦。虽然每个项目服务易于集成和部署，但是整个应用集成和部署的时候由于仓库分散就需要集中的管理和协调。
3. 开发人员缺乏对整个项目的整体认知。开发人员一般只关心自己的服务代码，看不到项目整体，造成缺乏对项目整体架构和业务目标整体性的理解。
4. 项目间冗余代码多。每个服务一个服务一个仓库，势必造成团队在开发的时候走捷径，不断地重复造轮子而不是去优先重用其他团队开发的代码。

### 1.1.2单仓库

​	单体仓库的优势：

1. 易于规范代码。所有的代码在一个仓库当中就可以标准化依赖管理，集中开展 code review，规范化代码的风格。
2. 易于集成和部署。所有的代码在一个仓库里面，配合自动化构建工具，可以做到一键构建、一键部署，一般不需要特别的集中管理和协调。
3. 易于理解项目整体。开发人员可以把整个项目加载到本地的 IDE 当中，进行 code review，也可以直接在本地部署调试，方便开发人员把握整体的技术架构和业务目标。
4. 易于重用。所有的代码都在一个仓库中，开发人员开发的时候比较容易发现和重用已有的代码，而不是去重复造轮子，开发人员（通过 IDE 的支持）容易对现有代码进行重构，可以抽取出一些公共的功能进一步提升代码的质量和复用度。

但同时，但仓库也有一些不足之处：

1. 单体仓库基本放弃了对读权限的限制，开发人员可以接触到项目所有代码，`Bilibili`的源代码泄露也印证了这个问题。
2. 对于写权限，单体仓库也是有着自己的解决方案，比如`OWNERS`，`CODEOWNERS`等，但相比多仓库还是差了一些。
3. 单个服务的开发测试部署和扩展，需要集中管理集中协调，降低了微服务单个服务的自治程度。
4. 代码量和复杂性不受控，随着公司业务团队规模的变大，单一的代码库会变得越来越庞大复杂性也呈极度的上升，容易受团队能力及开发流程等影响导致结果不可控。
5. 想要玩转单体仓库，一般需要独立的代码管理和集成团队进行支持，加上配套的自动化构建工具来支持。某些方面已经出现了开源的方案，比如 `Google` 自研的面向单体仓库的构建工具 `Bazel`：https://bazel.build/ 和 `Facebook` 的 `Buck`：https://buck.build/ 。但还是需要团队进行整合。

### 1.1.3图文详解

![](E:\vite-demo\img\01.png)

## 二、Lerna

### 2.1 前景说明

​	由于vite源码是由lerna来管理的，所以我们有必要系统的学习以下Lerna

	### 2.1 什么是lerna?

>  Lerna是一个管理多个 npm 模块的工具,优化维护多包的工作流，解决多个包互相依赖，且发布需要手动维护多个包的问题。
>
> (说白了就是一个工具,简化monoRepo操作的。)

### 2.2   安装

```bash
 npm i lerna -g
 
 lerna init  // 初始化
```

当你初始化的时候，此时你将会得到三个文件`packages`空文件夹，`lerna.json`，`package.json`文件，如下

![](E:\vite-demo\img\02.png)

### 2.3 文件分析

- `package.json` 文件分析

  ```json
  {
      "name": "root",
      "private": true,     // 代表不能发布到npm上
  	"devDependencies": {
          "lerna": "^4.0.0" // 开发依赖
      },
  +   "workspaces": [    // 所加字段将会以命名空间的方式进行管理
  +  		"packages/*"
  +   ]
  }
  ```

  

- `lerna.json`文件

  ```json
  {
      "packages": [          // 如果在package.json中配置了workspace，那么这里的packages内容将会被覆盖
          "packages/*"
      ],
      "version": "0.0.0",
  +   "useWorkspaces": true,  // 是否使用命名空间
  +   "npmClient": "yarn"     // 使用yarn控制版本
  }
  ```

- 拓展内容

  | 命令            | 功能                                                      |
  | :-------------- | :-------------------------------------------------------- |
  | lerna bootstrap | 安装依赖                                                  |
  | lerna clean     | 删除各个包下的node_modules                                |
  | lerna init      | 创建新的lerna库                                           |
  | lerna list      | 查看本地包列表                                            |
  | lerna changed   | 显示自上次release tag以来有修改的包， 选项通 list         |
  | lerna diff      | 显示自上次release tag以来有修改的包的差异， 执行 git diff |
  | lerna exec      | 在每个包目录下执行任意命令                                |
  | lerna run       | 执行每个包package.json中的脚本命令                        |
  | lerna add       | 添加一个包的版本为各个包的依赖                            |
  | lerna import    | 引入package                                               |
  | lerna link      | 链接互相引用的库                                          |
  | lerna create    | 新建package                                               |
  | lerna publish   | 发布                                                      |

### 2.4 yarn workspace

	#### 2.4.1 介绍

​	yarn workspace和lerna具有类似的功能，它允许我们使用monorepo的形式来管理项目。那它们的区别主要在哪呢？

- lerna主要用于项目的创建以及版本的发布

- yarn workspace的优势主要在于包的管理，比如安装包、链接包

- ```js
  // 拓展内容
  在安装 node_modules 的时候它不会安装到每个子项目的 node_modules 里面，而是直接安装到根目录下面，这样每个子项目都可以读取到根目录的 node_modules
  个项目只有根目录下面会有一份 yarn.lock 文件。子项目也会被 link 到 node_modules 里面，这样就允许我们就可以直接用 import 导入对应的项目
  yarn.lock文件是自动生成的,也完全Yarn来处理.yarn.lock锁定你安装的每个依赖项的版本，这可以确保你不会意外获得不良依赖
  ```

#### 2.4.2  配置yarn workspace

1. yarn workspace 常用的一些命令

   | 作用                        | 命令                                                         |
   | :-------------------------- | :----------------------------------------------------------- |
   | 查看工作空间信息            | yarn workspaces info                                         |
   | 给根空间添加依赖            | yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check |
   | 给某个项目添加依赖          | yarn workspace create-react-app3 add commander               |
   | 删除所有的 node_modules     | lerna clean 等于 yarn workspaces run clean                   |
   | 安装和link                  | yarn install 等于 lerna bootstrap --npm-client yarn --use-workspaces |
   | 重新获取所有的 node_modules | yarn install --force                                         |
   | 查看缓存目录                | yarn cache dir                                               |
   | 清除本地缓存                | yarn cache clean                                             |

2. 首先在根目录下安装vite，方便调试

   ```bash
   yarn add vite --ignore-workspace-root-check
   ```

3. 接着创建两个仓库

   ```bash
   lerna create vite-cli
   lerna create vite-project
   ```

   > 第一个项目用于手写vite-cli，第二个项目用于我们测试自己手写的vite

4. 在vite-cli文件目录下新建一个`bin`文件夹，并新建`vite.js`文件，如下

   ![](E:\vite-demo\img\03.png)

   > 该文件的作用是：告诉执行工具要通过node命令执行，从当前的环境变量中找到node执行

   配置如下(bin/vite.js)↓↓

   ```js
   #!/uer/bin/env node
   
   function start() {
   	require('../lib/cli');
   }
   start();
   ```

5. 配置`vite-cli`下的package.json文件，添加bin命令

   ```json
   {
       ...,
       "bin": {
       	"vite-cli": "./bin/vite.js"
   	}
   }
   ```

6. 将第4步中的命令部署到全局中去

   ```bash
   npm link
   // 执行完后，可以使用 npm root -g 查看链接到哪里去了
   ```

   接着执行脚本 `vite-cli`,就可以执行 `lib/cli.js`文件了

   > 坑！！！
   >
   > 在`lerna`创建项目的时候,lerna会自动给我们创建lib/vite-cli文件夹，此时命名会和vite-cli命令冲突导致执行不了，需要手动将`lib/vite-cli.js`改成`lib/cli.js`才能执行

## 三、vite-project配置

1. 首先我们在vite-project目录下新建一个index.html文件，并配置package.json方便跑起项目

   - package.json

     ```json
     {
     	...,
     	"scripts": {
     		"dev": "vite"
     	}
     }
     ```

   - index.html

   ```html
   <!--
    * @Descripttion: vite-project入口文件
    * @Author: lukasavage
    * @Date: 2022-05-22 11:12:02
    * @LastEditors: lukasavage
    * @LastEditTime: 2022-05-22 11:12:05
    * @FilePath: \vite-demo\packages\vite-project\index.html
   -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>vite实战</title>
   </head>
   
   <body>
       <div id="app"></div>
       <script type="module" src="/src/main.js"></script>
   </body>
   
   </html>
   ```

2. 接着创建src/main.js文件

   ```js
   console.log('项目启动了')
   ```

## 四、实战、vite-cli配置

1. 添加相关包

   ```bash
   yarn workspace vite-cli add  es-module-lexer koa koa-static magic-string chalk dedent hash-sum
   ```

   文件说明：

   - chalk                  适用于给输入端信息添加样式的
   - dedent               去除命令控制台文案的缩进
   - 

2. 修改vite-cli/lib/cli.js

   ```js
   /*
    * @Descripttion: vite-cli实现的入口文件
    * @Author: lukasavage
    * @Date: 2022-05-22 10:09:23
    * @LastEditors: lukasavage
    * @LastEditTime: 2022-05-22 11:54:56
    * @FilePath: \vite-demo\packages\vite-cli\lib\cli.js
    */
   const Koa = require('koa');
   // 此包去除缩进
   const dedent = require('dedent');
   
   function createServer() {
   	// koa实例
   	const app = new Koa();
   	// 当前命令所在的根目录
   	const root = process.cwd();
   	console.log(root);
   	// 上下文
   	const context = {
   		app,
   		root,
   	};
   	app.use((ctx, next) => {
   		Object.assign(ctx, context);
   		return next();
   	});
   	return app;
   }
   createServer().listen(4000, async err => {
   	// chalk适用于给输入端信息添加样式的
   	const chalk = await import('chalk');
   	if (!err) {
   		console.log(dedent(`
               ${chalk.default.green(`vite-cli dev server running at:`)}
               > Local: http://localhost:4000/
           `));
   	}
   });
   ```

   

3. 