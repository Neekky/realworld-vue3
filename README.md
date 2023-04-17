# 知乎 Vue3实现

### 项目运行
``` js
yarn
// or
npm install

// 开发调试
yarn dev

// 构建打包
yarn build
```

### 简介
该项目为一个全栈项目，该项目仿"知乎"，模拟实现了：
- 登录、注册页
- 个人资料页
- 问题列表首页
- 文章详情页
- 提问回答编辑页
...

技术栈为：
- Vue3 + Pinia + Nuxt3 + TS + Element-plus + Vite
- git action(CI/CD)
- PM2
- Nginx

项目使用了Nuxt3,实现服务端渲染，但新版相较于Nuxt2改动太大，文档写的不好，无奈换回纯Vue3.
处理了浏览器CORS问题。


### 更新日志
- 2023.04.17：增加CICD，使用 github action 完成自动部署
- 2023.03.06：增加用户评论功能，回复评论功能
- 2022.12.24：增加用户点赞功能，并处理已点赞情况
