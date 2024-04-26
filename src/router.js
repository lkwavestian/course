import React from 'react';
import { Route, Switch, routerRedux, Redirect } from 'dva/router';
import { getRouterData } from './common/routes';
import { ConnectedRouter } from 'react-router-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import { ConfigProvider } from 'antd';
import { locale } from './utils/i18n';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';

function RouterConfig({ history, app }) {
    const routerData = getRouterData(app);
    return (
        <ConfigProvider locale={locale() != 'en' ? zhCN : enUS}>
            <ConnectedRouter history={history}>
                <CacheSwitch>
                    {routerData.map(({ path, name, component }) => {
                        if (path == '/course/student/MyDetailMobile') {
                            return (
                                <CacheRoute path={path} key={name} exact component={component} />
                            );
                        } else {
                            return <Route path={path} key={name} exact component={component} />;
                        }
                    })}
                    <Route path="/" render={() => <Redirect to="/" />} />
                </CacheSwitch>
            </ConnectedRouter>
        </ConfigProvider>
    );
}

export default RouterConfig;
