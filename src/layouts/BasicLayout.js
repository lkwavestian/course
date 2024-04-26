import React, { PureComponent } from 'react';
import styles from './BasicLayout.less';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import GlobalHeader from 'components/GlobalHeader';
import SiderMenu from 'components/SiderMenu';
import { Layout } from 'antd';
import '../common/menu';

const { Header, Sider, Content } = Layout;

@connect((state) => ({
    collapsed: state.global.collapsed,
    currentUser: state.global.currentUser,
    // currentPayUser: state.global.currentPayUser,
}))
export default class BasicLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleMenuCollapse = (collapsed) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            // if (window.location.search !== '') {
            //     if(window.location.search.indexOf('hash=') > -1) {
            //       let url = window.location.search.split('hash=')[1] || ''
            //       if(url.indexOf('&ticket=') > -1) {
            //         url = url.split('&ticket=')[0]
            //       }
            //       window.location.href = window.location.origin + '/#/' + url;
            //     } else {
            //       window.location.href = window.location.origin + '/' + window.location.hash
            //     }
            //   }

            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });

        this.notChrome();
    }

    // 非chrome浏览器做友好提示
    notChrome() {
        // 严格chrome浏览器
        // https://blog.csdn.net/qq_38652603/article/details/77108773
        let isChrome = navigator.userAgent.indexOf('Chrome') > -1;
        let isSafari = navigator.userAgent.indexOf('Safari') > -1;

        if (
            !(
                isChrome ||
                isSafari ||
                /mobile/i.test(navigator.userAgent.toLowerCase()) ||
                /ipad/i.test(navigator.userAgent.toLowerCase())
            )
        ) {
            let root = document.getElementById('root');
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:50px;background:#f7c452;color:#fff;line-height:50px;text-align:center;z-index: 9999;font-size: 16px;">
                为了让您有更好的用户体验，建议您下载安装谷歌浏览器(Chrome)访问我们的网站，谢谢。
                <span style="position: fixed; right: 21px; top: 0;cursor: pointer;" id="close_propmt">X</span>
                </div>
            `;
            root.parentNode.insertBefore(newDiv, root.previousSibling);

            root.style.position = 'relative';
            root.style.top = '50px';
            root.style.left = 0;

            let closePropmt = document.getElementById('close_propmt');
            closePropmt.addEventListener('click', function () {
                newDiv.innerHTML = null;
                root.style = null;
            });
        }
    }

    render() {
        const {
            collapsed,
            currentUser,
            // currentPayUser,
            navList,
            cur,
            switchNavList,
            isNeedOpen,
            replace
        } = this.props;
        let path = location.hash && location.hash.split('#')[1];
        return (
            <div style={{ display: window.top == window.self ? 'block' : 'none' }}>
                <SiderMenu
                    collapsed={collapsed}
                    onCollapse={this.handleMenuCollapse}
                    {...this.props}
                />
                <GlobalHeader
                    currentUser={currentUser || currentPayUser}
                    onCollapse={this.handleMenuCollapse}
                    collapsed={collapsed}
                    navList={navList}
                    cur={cur}
                    switchNavList={switchNavList}
                    isNeedOpen={isNeedOpen}
                    replace={replace}
                />
                {/* <Layout>
                <SiderMenu 
                    collapsed={collapsed}
                    onCollapse={this.handleMenuCollapse}
                />
                <Layout>
                    <Content style={{heigth: '100%'}}>
                        <GlobalHeader 
                            currentUser={currentUser}
                            onCollapse={this.handleMenuCollapse}
                            collapsed={collapsed}
                        />
                        <div className={styles.mainContent}>
                        </div>
                    </Content>
                </Layout>
            </Layout> */}
            </div>
        );
    }
}
