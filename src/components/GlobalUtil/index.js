//个人设置 && 消息提醒 && 搜索学生
import React, { PureComponent } from 'react';
import { Menu, Modal, Spin, Dropdown, Avatar, Icon, Input } from 'antd';
import styles from './index.less';
import icon from '../../icon.less';
import { locale, trans } from '../../utils/i18n';
import Iframe from 'react-iframe';
import { connect } from 'dva';
const Search = Input.Search;

@connect((state) => ({
    readNoticeList: state.global.readNoticeList,
    noReadNoticeList: state.global.noReadNoticeList,
    totalRead: state.global.totalRead,
    unreadTotal: state.global.unreadTotal,
    currentUser: state.global.currentUser,
}))
export default class GlobalUtil extends PureComponent {
    constructor() {
        super();
        this.state = {
            iframeVisible: false,
            localVisible: false,
            modalVisible: false,
            iframeUrl: '',
            modalTitle: '',
            menuClickValue: '',
            IframeStyle: '',
            readNoticeList: [],
            noReadNoticeList: [],
            totalRead: 0,
            unreadTotal: 0,
        };
    }

    renderModal(el) {
        switch (el) {
            case 'language':
                return (
                    <div
                        className={styles.languagebox}
                        style={{ minHeight: '200px', maxWidth: '100%' }}
                    >
                        <div
                            className={styles.language}
                            style={{
                                color:
                                    locale() == 'CN' || locale() == 'cn' || locale() == 'zh-CN'
                                        ? '#3C76F7'
                                        : '#666',
                            }}
                        >
                            <i
                                className={icon.iconfont}
                                data-lang="zh"
                                onClick={this.checkLange}
                                href=""
                            >
                                &#xe64f;
                            </i>
                            <span>中文</span>
                        </div>
                        <div
                            className={styles.language}
                            style={{ color: locale() == 'en' ? '#3C76F7' : '#666' }}
                        >
                            <i
                                className={icon.iconfont}
                                data-lang="en"
                                onClick={this.checkLange}
                                href=""
                            >
                                &#xe61a;
                            </i>
                            <span>English</span>
                        </div>
                    </div>
                );
                break;
            default:
                return <div>加载失败，请稍重试</div>;
        }
    }
    onMenuClick = ({ key }) => {
        this.setState({
            menuClickValue: key,
        });

        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');

        switch (key) {
            case 'language':
                this.setState({
                    modalVisible: true,
                    localVisible: true,
                    iframeVisible: false,
                    modalTitle: trans('globalutil.language', '切换语言'),
                });
                break;
            case 'password':
                //获取host
                let language = locale() == 'cn' ? 'zh-CN' : 'en';

                let host =
                    currentUrl.indexOf('yungu.org') > -1
                        ? 'https://login.yungu.org/common/page'
                        : 'https://login.daily.yungu-inc.org/common/page';
                let modifyPsdUrl = host + '/#/user/changePsd?language=' + language;
                this.changeIdentify(
                    trans('globalutil.password', '修改密码'),
                    modifyPsdUrl,
                    '254px'
                );
                break;
            case 'logout':
                window.location.href = window.location.origin + '/?doLogout=yes';
                break;
            default:
                return;
        }
    };

    changeIdentify(title, url, iframeStyle) {
        this.setState({
            modalVisible: true,
            iframeVisible: true,
            localVisible: false,
            modalTitle: title,
            iframeHeight: iframeStyle,
        });
        if (url) {
            this.setState({
                iframeUrl: url,
            });
        } else {
            this.setState({
                iframeUrl: '',
            });
        }
    }

    hideModal() {
        this.setState({
            modalVisible: false,
            stuDataCardVisible: false,
        });
    }

    checkLange = (e) => {
        let target = e.target,
            lang = target.getAttribute('data-lang');
        e.preventDefault();
        this.props.dispatch({
            type: 'global/checkLange',
            payload: {
                languageCode: lang,
            },
        });
    };

    showStudata(value) {
        this.setState({
            stuDataCardVisible: value,
        });
    }

    //获取消息列表
    getNoticeData = (payload) => {
        this.props.dispatch({
            type: 'global/getNoticeList',
            payload: payload,
        });
    };

    //标为已读
    pushRead = (ids) => {
        this.props.dispatch({
            type: 'global/noticeRead',
            payload: {
                ids: ids,
            },
            onSuccess: () => {
                const payload = {
                    pageNo: 1,
                    pageSize: 10,
                    read: false,
                };
                this.getNoticeData(payload);
            },
        });
    };

    render() {
        const {
            currentUser,
            readNoticeList,
            noReadNoticeList,
            totalRead,
            unreadTotal,
            fontColor,
            replace,
        } = this.props;

        let language = locale() == 'cn' ? 'zh-CN' : 'en';

        //切换身份
        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');

        let host =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://task.yungu.org/common/switchIdentity/'
                : 'https://task.daily.yungu-inc.org/common/switchIdentity';

        let identifyUrl = host + '/#/user/switchIdentity?language=' + language;
        let modifyAvatarUrl = host + '/#/user/changePortrait?language=' + language;
        // let modifyAvatarUrl = "http://30.14.104.203:8001/#/user/changePortrait";

        //跳转到学生主页
        let homePageUrl =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://profile.yungu.org'
                : 'https://student-profile.daily.yungu-inc.org';
        const menu = (
            <Menu
                key="personal"
                className={styles.menu}
                selectedKeys={[]}
                onClick={this.onMenuClick.bind(this)}
            >
                <Menu.Item className={styles.personal}>
                    <div className={styles.avatar}>
                        <img src={currentUser.avatar} alt="" />
                        <div
                            className={styles.changeImg}
                            onClick={this.changeIdentify.bind(
                                this,
                                trans('globalutil.changePortrait', '修改头像'),
                                modifyAvatarUrl,
                                '440px'
                            )}
                        >
                            {trans('globalutil.change', '更换')}
                        </div>
                    </div>
                    <div className={styles.information}>
                        <div className={styles.name}>{currentUser.identityShowName}</div>
                        <div className={styles.tel}>
                            {currentUser.identify &&
                                currentUser.identify.indexOf('student') > -1 &&
                                currentUser.studentNo}
                            {currentUser.identify &&
                                (currentUser.identify.indexOf('parent') > -1 ||
                                    currentUser.identify.indexOf('employee') > -1) &&
                                currentUser.phoneNumber}
                        </div>
                        <div
                            className={styles.identify}
                            onClick={this.changeIdentify.bind(
                                this,
                                trans('global.identity', '切换身份'),
                                identifyUrl,
                                '200px'
                            )}
                        >
                            <i className={icon.iconfont}>&#xe6bd;</i>
                            {trans('global.identity', '切换身份')}
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Item key="password">
                    <i className={icon.iconfont}>&#xe744;</i>
                    <span>{trans('globalutil.password', '修改密码')}</span>
                </Menu.Item>
                <Menu.Item key="language">
                    <i className={icon.iconfont}>&#xe7eb;</i>
                    <span>{trans('globalutil.language', '切换语言')}</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <i className={icon.iconfont}>&#xe64d;</i>
                    <span>{trans('globalutil.exit', '退出')}</span>
                </Menu.Item>
            </Menu>
        );

        let searchStyle = currentUser.currentIdentity == 'employee' ? 'visible' : 'hidden';

        return (
            <div className={styles.globalUtil}>
                {/* <i className={iconClass}>&#xe628;</i> */}
                <div className={styles.user} style={{ color: fontColor ? fontColor : '#fff' }}>
                    {/* <a className={ styles.homePageBtn } style={{ display: 'inline-block', visibility: searchStyle }} href={homePageUrl} target="_blank">
                <Search
                  placeholder={trans('global.searchStu','搜索学生')}
                  className={ styles.searchHomePage }
                  style={{ width: 140 }}
                />
            </a>
            <NewNotice
              noReadNoticeList={noReadNoticeList}
              readNoticeList={readNoticeList}
              totalRead={totalRead}
              unreadTotal={unreadTotal}
              getNoticeData={this.getNoticeData}
              pushRead={this.pushRead}
            /> */}
                    {currentUser.userId ? (
                        <Dropdown overlay={menu} trigger={['click']}>
                            <span className={`${styles.action} ${styles.account}`}>
                                <Avatar
                                    size="small"
                                    className={styles.avatar}
                                    src={currentUser.avatar}
                                    style={
                                        replace == 'replaceMobile'
                                            ? { margin: '0px 8px 0px 0px' }
                                            : {}
                                    }
                                />
                                <span
                                    className={styles.name}
                                    style={
                                        replace == 'replaceMobile'
                                            ? { color: 'rgba(0,17,61,.85)' }
                                            : {}
                                    }
                                >
                                    {currentUser.identityShowName || '...'}
                                </span>
                                <i
                                    className={icon.iconfont}
                                    style={{
                                        color:
                                            replace == 'replaceMobile'
                                                ? 'rgba(0,17,61,.85)'
                                                : fontColor
                                                ? fontColor
                                                : '#fff',
                                    }}
                                >
                                    &#xe659;
                                </i>
                            </span>
                        </Dropdown>
                    ) : (
                        <Spin size="small" style={{ marginLeft: 8 }} />
                    )}
                </div>
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width="520px"
                    onCancel={this.hideModal.bind(this)}
                    footer={null}
                >
                    {this.state.iframeVisible && (
                        <Iframe
                            url={this.state.iframeUrl}
                            className={styles.iframeStyle}
                            display="initial"
                            position="relative"
                            border="0"
                            marginWidth="0"
                            marginHeight="0"
                            scrolling="no"
                            width="100%"
                            height={this.state.iframeHeight}
                        />
                    )}
                    {this.state.localVisible && this.renderModal(this.state.menuClickValue)}
                </Modal>
            </div>
        );
    }
}
