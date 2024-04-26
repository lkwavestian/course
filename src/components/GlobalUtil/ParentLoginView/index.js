//个人设置 && 消息提醒 && 搜索学生
import React, { PureComponent } from 'react';
import { Modal, Avatar, Spin } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { locale, trans } from '../../../utils/i18n';
import Iframe from 'react-iframe';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect((state) => ({
    isOpen: state.studentDetail.isNeedOpen, // 判断是否详情页返回
}))
export default class ParentLoginView extends PureComponent {
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

    componentDidMount() {
        if (this.props.isOpen) {
            //切换身份
            let language = locale() == 'cn' ? 'zh-CN' : 'en';
            let currentUrl = window.location.href;
            currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
            let host =
                currentUrl.indexOf('yungu.org') > -1
                    ? 'https://task.yungu.org/common/switchIdentity/'
                    : 'https://task.daily.yungu-inc.org/common/switchIdentity';

            let identifyUrl = host + '/#/user/switchIdentity?language=' + language;

            setTimeout(() => {
                this.openIdentifyModal(trans('global.identity', '切换身份'), identifyUrl, '200px');
            }, 500);
        }
    }

    openIdentifyModal = (title, url, iframeStyle) => {
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
    };

    changeIdentify(title, url, iframeStyle) {
        const { isFromDetail } = this.props;
        console.log(isFromDetail, '----isFromDetail');
        if (isFromDetail) {
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/course/student/list',
                    isNeedOpen: true,
                })
            );
            this.openIdentifyModal(title, url, iframeStyle);
        } else {
            this.openIdentifyModal(title, url, iframeStyle);
        }
    }

    hideModal() {
        this.setState({
            modalVisible: false,
            stuDataCardVisible: false,
        });
    }

    render() {
        const { currentUser, color, nameColor, isFromDetail, replace } = this.props;
        //切换身份
        let language = locale() == 'cn' ? 'zh-CN' : 'en';
        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');

        let host =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://task.yungu.org/common/switchIdentity'
                : 'https://task.daily.yungu-inc.org/common/switchIdentity';

        let identifyUrl = host + '/#/user/switchIdentity?language=' + language;

        return (
            <div className={styles.parentLoginView}>
                <div className={styles.user} style={{ color: nameColor }}>
                    {currentUser.userId ? (
                        <div>
                            <span className={styles.account}>
                                <Avatar
                                    size="small"
                                    className={styles.avatar}
                                    src={currentUser.avatar}
                                    style={replace == 'replaceMobile'?{margin: '0px 8px 0px 0px'}:{}}
                                />
                                <span className={styles.name}>
                                    {currentUser.identityShowName || '...'}
                                </span>
                            </span>
                            <span
                                className={styles.identify}
                                style={{ color }}
                                onClick={this.changeIdentify.bind(
                                    this,
                                    trans('global.identity', '切换身份'),
                                    identifyUrl,
                                    '200px'
                                )}
                            >
                                {trans('global.identity', '切换身份')}
                                <i className={icon.iconfont}>&#xe659;</i>
                            </span>
                        </div>
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
                    // className={styles.modal}
                >
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
                </Modal>
            </div>
        );
    }
}
