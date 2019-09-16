# Koa-blog

## 项目说明：
**该项目采用前后端分离结构，权限认证采用 token 来实现**

> **前端项目：** [点击此处 →](https://github.com/liandao0815/React-blog)

## 目录结构：
```
| public
| src
| | config ------------------配置文件
| | controller --------------控制层
| | database ----------------数据库相关
| | middleware --------------中间件
| | serviece ----------------服务层
| | utils -------------------工具类
| | app.js ------------------入口文件
| .babelrc
| .editorconfig
| .eslintrc
| .gitignore
| index.js ------------------启动文件
| package.json
```

## 技术栈：
- Node.js
- Koa
- MongoDB

## 项目启动:

```bash
# 安装依赖
yarn install 或者 npm install

# 启动项目
yarn start 或者 npm run start
```

## 项目核心代码：
- 项目的日志管理使用 log4js 模块，具体配置如下：

```javascript
// 配置文件
const log4jsConf = {
  appenders: {
    console: {
      type: 'console'
    },
    http: {
      type: 'dateFile',
      filename: path.resolve(__dirname, '../../log/http'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    error: {
      type: 'file',
      filename: path.resolve(__dirname, '../../log/error.log'),
      maxLogSize: 1048576,
      backups: 10
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    },
    http: {
      appenders: ['http'],
      level: 'info'
    },
    error: {
      appenders: ['error'],
      level: 'error'
    }
  }
}

// 日志管理
export default app => {
  app.use(async (ctx, next) => {
    const { method, host, url, headers } = ctx
    const httpInfo = {
      method,
      host,
      url,
      referer: headers['referer'],
      userAgent: headers['user-agent']
    }
    httpLogger.info(JSON.stringify(httpInfo))
    await next()
  })
```

- 统一错误处理则使用了 Decorator 装饰器来实现，从而减少一定的代码量：

```javascript
//装饰器配置
export function handleError(target, name, descriptor) {
  const oldValue = descriptor.value

  descriptor.value = async function() {
    try {
      return await oldValue.apply(this, arguments)
    } catch (error) {
      return Result.error(
        ERROR_INFO.DatabaseError.code,
        ERROR_INFO.DatabaseError.msg
      )
    }
  }
}

//使用装饰器
...
@handleError
async publish(headers) {
  const userid = await getUserId(headers)
  const category = await Category.findOne({
    _id: this.categoryid,
    author: userid
  })
  const article = new Article({
    author: userid,
    title: xss(this.title),
    content: xss(this.content),
    category: category._id,
    privated: this.privated
  })

  await article.save()
  return Result.success(null)
}
...
```

## API 接口功能：
- [x] 用户登录
- [x] 用户注册
- [x] 修改资料
- [x] 上传头像
- [x] 收藏文章
- [x] 发布文章
- [x] 删除文章
- [x] 更新文章
- [x] 模糊查询
- [x] 分页查询
- [x] 阅读统计
- [x] 用户评论
- [x] 文章分类
...

## LICENSE
**MIT**
