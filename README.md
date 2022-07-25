# 云原生时代的应用平台

#### 多云 跨平台 全生命周期的应用管理

应用开发、测试、审核、上架、一键部署，升级、扩容、更新、下线等全过程
应用管理，无缝对接各类底层资源，支持商业化运营。
通过应用平台向数万家行政事业单位快速部署政务应用和展示您的产品和服务，提升品牌价值，通过开放协同新模式
帮助您取得商业成功。

## 演示地址

http://platform.assetcloud.org.cn/

## 代码规范

参考 https://github.com/mgbq/front-end-Doc/blob/master/base.md

## 工程目录

```
assetstore
├── public                       # 静态资源
├    ├── favicon.ico             # 后端接口管理模块
├    ├── static                  # 流程模块
├    ├── index                   # html模板
├── src                          # 工程代码
├    ├── api                     # 接口管理模块
├    ├── assets                  # 主题、图片等资源
├    ├── components              # 全局公用组件
├    ├── directives              # 全局指令
├    ├── layout                  # 全局布局
├    ├── plugins                 # 插件管理模块
├    ├── router                  # 路由管理模块
├         ├── index              # 入口文件
├         ├── axios              # 全局拦截器
├    ├── store                   # 全局store
├    ├── styles                  # 全局样式
├         ├── index              # 入口文件
├         ├── init               # 初始化样式
├         ├── variables          # 全局变量
├         ├── layout             # 布局样式
├         ├── components         # 自定义组件样式
├    ├── utils                   # 全局公用方法
├         ├── index              # 基础方法
├         ├── validate           # 验证方法
├         ├── auth               # 权限方法
├    ├── views                   # 业务界面模块
├    ├── App                     # 页面入口
├    ├── main                    # 入口文件
├    ├── permission              # 全局路由守卫
├── env                          # 环境变量
├── package.json                 # 依赖信息
└── vue.config.js                # 配置文件
```

## 安装教程

1.  yarn install
2.  yarn serve

## 分支命名规范

参考 https://blog.csdn.net/lnkToKing/article/details/78393789

## 参与贡献

1.  Fork 本仓库
2.  新建 feat-xxx 分支
3.  提交代码
4.  新建 Pull Request
