import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';

import Header from './Header';
import * as utils from '../utils';
import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';
import '../../static/style';

export default class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    const { pathname } = props.location;
    const appLocale = utils.isZhCN(pathname) ? cnLocale : enLocale;
    addLocaleData(appLocale.data);

    this.state = {
      appLocale,
    };
  }

  render() {
    const { appLocale } = this.state;
    const { children, ...restProps } = this.props;
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={appLocale.locale === 'zh-CN' ? zhCN : null}>
          <div className="page-wrapper">
            <Header {...restProps} />
            {children}
          </div>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
