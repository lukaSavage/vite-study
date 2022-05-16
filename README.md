# vite-demo

## 一、单体仓库与多仓库的认知

	### 1.1 单体仓库（monoRepo）和多仓库（multiRepo）的区别？

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

### 2.0 前景说明

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

- package.json 文件分析
- lerna.json文件

​    1）package.json文件分析

​      {

​        "name": "root",

​        "private": true,     // 代表不能发布到npm上

​        "devDependencies": {   // 开发依赖

​          "lerna": "^4.0.0"

​        }

​      }

​    2）lerna.json

​      {

​        "packages": [      // 文件匹配模式，能匹配文件下的所有路径

​          "packages/*"

​        ],

​        "version": "0.0.0"

​      }

  ·常用命令

​    lerna bootstrap  安装依赖

​    lerna clean    删除各个包下的node_modules

​    lerna init    创建新的lerna库

​    lerna list    查看本地包列表

​    lerna changed   显示自上次release tag以来有修改的包， 选项通 list

​    lerna diff    显示自上次release tag以来有修改的包的差异， 执行 git diff

​    lerna exec    在每个包目录下执行任意命令

​    lerna run     执行每个包package.json中的脚本命令

​    lerna add     添加一个包的版本为各个包的依赖

​    lerna import   引入package

​    lerna link    链接互相引用的库

​    lerna create   新建package

​    lerna publish   发布

  ·yarn workspace

​    ·介绍

​      yarn workspace允许我们使用monorepo的形式来管理项目

​      在安装 node_modules 的时候它不会安装到每个子项目的 node_modules 里面，而是直接安装到根目录下面，这样每个子项目都可以读取到根目录的 node_modules

​      整个项目只有根目录下面会有一份 yarn.lock 文件。子项目也会被 link 到 node_modules 里面，这样就允许我们就可以直接用 import 导入对应的项目

​      yarn.lock文件是自动生成的,也完全Yarn来处理.yarn.lock锁定你安装的每个依赖项的版本，这可以确保你不会意外获得不良依赖

​    =====

​    ·启用yarn workspace

​      1) 配置lerna.json文件

​        {

​          "packages": [      // 如果在package.json中配置了workspace，那么这里的packages内容将会被覆盖

​            "packages/*"

​          ],

​          "version": "1.0.0",

​        \+  "useWorkspaces": true,

​        \+  "npmClient": "yarn"

​        }

​      2) 配置package.json文件

​        {

​          "name": "root",

​          "private": true,

​        \+  "workspaces": [

​        \+   "packages/*"

​        \+  ],

​          "devDependencies": {

​            "lerna": "^4.0.0"

​          }

​        }

​    ·一些常用命令

​      查看工作空间信息   yarn workspaces info

​      给根空间添加依赖   yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check

​      给某个项目添加依赖   yarn workspace create-react-app3 add commander

​      删除所有的      node_modules lerna clean 等于 yarn workspaces run clean

​      安装和link     yarn install 等于 lerna bootstrap --npm-client yarn --use-workspaces

​      重新获取所有的    node_modules  yarn install --force

​      查看缓存目录    yarn cache dir

​      清除本地缓存    yarn cache clean

​    

​    拓展：什么时候用lerna?什么时候用yarn workspace?

​      \# 依赖管理、安装包和链接包用yarn wrokspace命令

​      \# 初始化和发布包用lerna管理



  ·实战

​    1、创建2个项目

​      \# 使用lerna create vite-cli  // 我们用此项目来手写vite脚手架

​      \# 使用lerna create vite-project // 我们用此项目来对我们手写的vite进行测试

​    2.修改package.json文件，添加如下代码

​      "bin": {

​        "vite-cli": "./bin/vite.js"  // 会全局注册一个命令：vite-cli , 并执行命令: ./bin/vite.js

​      }

​      // 以此我们可以通过全局命令 vite-cli xxx 执行脚本了。