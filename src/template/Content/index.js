import React from 'react';
import collect from 'bisheng/collect';

import MainContent from './MainContent';
import * as utils from '../utils';

// 通过 collect 将 router、markdown 数据传给页面组件
export default collect(async (nextProps) => {
  const { pathname } = nextProps.location;
  const pageDataPath = pathname.replace('-cn', '').split('/');
  // get 方法来自 https://github.com/benjycui/exist.js
  // 会根据访问的路径结构，去获取相同的文件夹结构
  const pageData = nextProps.utils.get({ components: nextProps.data }, pageDataPath);
  console.log('=-----', pageData, pageDataPath, nextProps.data);
  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }

  // const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
  // const locale = 'zh-CN';
  // const pageDataPromise = typeof pageData === 'function'
  //   ? pageData()
  //   : (pageData[locale] || pageData.index[locale] || pageData.index)();
  const pageDataPromise = pageData.index || pageData;
  // const demosFetcher = nextProps.utils.get(nextProps.data, [...pageDataPath, 'demo']);
  // if (demosFetcher) {
  //   const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
  //   return { localizedPageData, demos };
  // }
  return { localizedPageData: await pageDataPromise };
})(MainContent);
