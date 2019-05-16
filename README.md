# bisheng-theme-antd

将 [ant-design](https://github.com/ant-design/ant-design) 中相关代码拷贝出来，可以直接在其他项目中使用。

## Usage

其实更推荐的做法是将`bisheng-theme-antd`拷贝到本地`theme`文件夹。在使用`bisheng-theme-antd`（后面简称`theme`）前，有一些强制约定需要遵守。

### 目录结构

参考`antd`的目录，`components`是读取`md`文件的根文件夹，在之下直接存放所有公共组件：

```js
components
├── button
│   ├── demo
│   │   └── basic.md
│   └── index.md
├── form
│   └── index.md
└── input
    └── index.md
```

当访问路径`http://127.0.0.1:8000/components/button`时，会将`components/button`解析，以`components/button`去寻找是否有对应的`md`文件。
> 对应代码在`bisheng-theme-antd/src/template/Content/index.js`中`collect`部分。

### 代码示例

组件根文件，即`index.md`，必须有

```js
---
category: Components
type: 通用
title: Button
subtitle: 按钮
---
```

`category`和`type`是用来控制生成侧边菜单，菜单显示内容为 `title + subtitle`。

在每个组件文件夹下，如果存在`demo`文件夹，则会将该文件夹下所有`md`文件读取，并以`Demo`组件的形式展示：

![image-20190516093251199](/image-20190516093251199.png)

每个`md`文件会生成一个`Demo`组件，该文件内容有需要符合格式：

```js
---
order: 0
title:
  zh-CN: 按钮类型
  en-US: Type
---

## zh-CN

按钮有四种类型：主按钮、次按钮、虚线按钮、危险按钮。主按钮在同一个操作区域最多出现一次。

## en-US

There are `primary` button, `default` button, `dashed` button and `danger` button in antd.

这里可以放代码块，lang 需要是 jsx

```

`order`表示显示的顺序，`title`会显示在`Demo`和右侧。正文内容会根据当前语言显示。

### 依赖

- bisheng-plugin-antd
- bisheng-plugin-react

## 一些说明

### Header

网站顶部，对应组件`template/Layout/Header`。右侧菜单跳转路径是写死在这个文件内。

## bisheng 使用记录

### source

`source`支持字符串与对象，如果是字符串，比如`./components`，并且有如下文件夹：

```js
components
├── button
│   ├── demo
│   │   └── basic.md
│   └── index.md
├── form
│   └── index.md
└── input
    └── index.md
```

那么生成的`markdownData`就是：

```js
{
  button: {
    // ...
  },
  form: {
    // ...
  },
  input: {
    // ...
  },
}
```

如果是对象，配置为：

```js
source: {
  components: './components',
},
```

同样的文件夹，生成的`markdownData`变成了：

```js
{
  components: {
    button: {
      // ...
    },
    form: {
      // ...
    },
    input: {
      // ...
    },
  },
}
```

这个`markdownData`是在匹配到路由时，用路由去匹配这个数据的，从而获取到`md`文件内容。

## 问题

每次修改了`md`文件需要重启服务。

### 1、详情页 404
404 就是没有匹配到路由，这个很明显，但是为什么呢？因为`theme-one`配置的是`/posts/:post`路径，而我们指定`source`为其他名字的文件夹，比如

```js
// bisheng.config.s
module.exports = {
    source: './components',
};
```

那么，在`components`下的`md`文件实际访问路径就是`/components/:post`，所以匹配不到。

### 2、bisheng-plugin-react 不生效

首先，在`lazyload: true`的情况下，是使用了`src/loader/source-loader.js`来处理`md`文件，使用`themeConfig.plugins`，所以在这里断点查看实际使用了哪些`plugins`，并确定路径正确。

> 大部分不生效可能是因为路径错误。

由于不知道怎么配，所以直接修改`node_modules/bisheng-theme-one`下的配置文件：

```js
module.exports = {
    // ...
    plugins: [
        path.join(__dirname, '..', '..', 'bisheng-plugin-react?lang=__react'),
    ],
}
```

`bisheng-plugin-react`是作用在`theme`上的，那么只能自己实现`theme`，而不能使用第三方，因为`bisheng.config.js`无法覆盖`theme.config.js`。

在最终使用插件处理前，会使用`lib/utils/resolve-plugins.js`的`resolvePlugins`方法去寻找插件路径，并返回有效插件。

```js
function resolvePlugin(plugin) {
    var result;
    try {
        // https://www.npmjs.com/package/resolve
        result = resolve.sync(plugin, {
            basedir: process.cwd()
        });
    } catch (e) {} // eslint-disable-line no-empty
    return result;
}
```

是以当前执行命令为前提去找，所以在`theme`中安装的插件是找不到的，需要在项目，也就是这里安装。
> 如果`theme`是以依赖的形式安装，那它的依赖应该会放在项目中，就不存在这个问题了？如果只是将项目`clone`，依赖也不好解决，这又是一个问题。