import React from 'react';
import collect from 'bisheng/collect';

import MainContent from './MainContent';
import * as utils from '../utils';

function lower(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return obj;
  }
  return Object.keys(obj).reduce((prev, key) => {
    if (key.includes('zh-CN') || key.includes('en-US')) {
      return obj[key];
    }
    const res = prev;
    const newKey = key.toLowerCase();
    res[newKey] = lower(obj[key]);
    return res;
  }, {});
}
// 通过 collect 将 router、markdown 数据通过 props 传给页面组件
export default collect(async (nextProps) => {
  const { pathname } = nextProps.location;
  const pageDataPath = pathname.replace('-cn', '').split('/');
  // get 方法来自 https://github.com/benjycui/exist.js
  // 会根据访问的路径结构，去获取相同的文件夹结构
  // 由于路径总是小写，而文件名可能大写，这里将文件名转为小写
  const data = lower(nextProps.data);
  const pageData = nextProps.utils.get(data, pageDataPath);
  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }
  const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
  const pageDataPromise = typeof pageData === 'function'
    ? pageData()
    : (pageData[locale] || pageData.index[locale] || pageData.index)();
  // 尝试读取 demo 文件夹
  // 由于 babel 只能在服务端运行，所以通过插件来完成
  const demosFetcher = nextProps.utils.get(data, [...pageDataPath, 'demo']);
  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
    return { localizedPageData, demos };
  }
  return { localizedPageData: await pageDataPromise };
})(MainContent);
