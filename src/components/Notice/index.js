//消息通知
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Tabs } from 'antd';
import styles from './index.less';
import { trans, locale } from '../../utils/i18n';
import icon from '../../icon.less';
const TabPane = Tabs.TabPane;
const PLAT = {
    pc: 'pc',
    mobile: 'mobile',
};
const PAGE_SIZE = 10;
// let CLevent = {[PLAT.pc]: 'MouseUp', [PLAT.mobile]: 'TouchEnd'}[window.PLATFORM_TYPE];
moment.locale('zh-cn');

class NewNotice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: false,
        };
    }

    pageNoticeRead = () => {
        const noticeList = this.props.noReadNoticeList.data;
        let ids = [];

        noticeList.map((item) => {
            ids.push(item.messageId);
        });

        this.props.pushRead(ids);
    };

    showClick = () => {
        this.setState({ message: true });

        const payload = {
            pageNo: 1,
            pageSize: PAGE_SIZE,
            read: false,
        };
        this.props.getNoticeData(payload);
    };
    hideClick = () => {
        this.setState({ message: false });
    };
    tabChange = (key) => {
        let payload = {
            pageNo: 1,
            pageSize: PAGE_SIZE,
        };

        if (key === '1') {
            payload.read = false;
        }

        if (key === '2') {
            payload.read = true;
        }

        this.props.getNoticeData(payload);
    };
    readItem = (e) => {
        const id = e.target.dataset.id;
        this.props.pushRead([id]);
    };
    linkTo = (e) => {
        if (e.target.dataset.id) return;
        const div = getDivDom(e.target);
        const link = div.dataset.link;
        const id = div.dataset.id;
        if (id) {
            this.props.pushRead([id]);
        }

        window.location.href = link;
    };

    render() {
        const { message } = this.state;
        const { noReadNoticeList, readNoticeList, totalRead, unreadTotal } = this.props;
        // const { formatMessage } = this.props.intl;
        // const bindBellHit = {
        //   ['on' + CLevent]: event => this.showClick(event)
        // };
        // const bindCloseHit = {
        //   ['on' + CLevent]: event => this.hideClick(event)
        // };

        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
        let historyUrl =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://message.yungu.org/#/notice'
                : 'https://message.daily.yungu-inc.org/#/notice';
        return (
            <Fragment>
                {message && <div className={styles.noticeMask} onClick={this.hideClick}></div>}
                {message ? (
                    <div className={styles.notice} onTouchMove={this.handleTouchMove}>
                        <div className={styles.title}>
                            {/* <span className={styles.close}  onClick={this.hideClick }><i className={icon.iconfont} style={{color: '#3b6ff5'}}>&#xe6a9;</i></span> */}
                            <span className={styles.title_content}>
                                {trans('notice.title', '消息通知')}
                            </span>
                            <span className={styles.bell}></span>
                        </div>
                        <Tabs
                            className={styles.tabs}
                            tabBarGutter={0}
                            defaultActiveKey="1"
                            onChange={this.tabChange}
                        >
                            <TabPane
                                tab={trans('notice.noRead', '未读消息') + `(${unreadTotal})`}
                                key="1"
                            >
                                <div className={styles.mainDom}>
                                    {noReadNoticeList.data && noReadNoticeList.data.length > 0 ? (
                                        noReadNoticeList.data.map((item, key) => (
                                            <div
                                                className={styles.listItem}
                                                key={key}
                                                data-id={item.messageId}
                                                data-link={item.messageUrl}
                                                onClick={this.linkTo}
                                            >
                                                <div className={styles.userImg}>
                                                    <img
                                                        alt={trans('notice.userPhoto', '用户头像')}
                                                        src={item.senderAvatar}
                                                    />
                                                </div>
                                                <div className={styles.main}>
                                                    <div className={styles.commentTitle}>
                                                        <span className="employee">
                                                            {item.senderName}
                                                        </span>{' '}
                                                        {item.title}：
                                                    </div>
                                                    <div className={styles.commentCon}>
                                                        {item.content}
                                                    </div>
                                                    <div className={styles.time}>
                                                        {moment(item.messageSendTime).fromNow()}
                                                    </div>
                                                </div>
                                                <div
                                                    className={styles.mask}
                                                    data-id={item.messageId}
                                                    onClick={this.readItem}
                                                >
                                                    {trans('notice.pushRead', '标记已读')}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noMessage}>
                                            {trans('notice.noMessage', '还没有消息哦~')}
                                        </div>
                                    )}
                                </div>
                                {noReadNoticeList.data && noReadNoticeList.data.length > 0 ? (
                                    <div className={styles.bottom} onClick={this.pageNoticeRead}>
                                        {trans('notice.allRead', '全部已读')}
                                    </div>
                                ) : (
                                    <div className={[styles.bottom, styles.disabled].join(' ')}>
                                        {trans('notice.allRead', '全部已读')}
                                    </div>
                                )}
                            </TabPane>
                            <TabPane
                                tab={trans('notice.haveRead', '已读消息') + `(${totalRead})`}
                                key="2"
                            >
                                <div className={styles.mainDom}>
                                    {readNoticeList.data && readNoticeList.data.length > 0 ? (
                                        readNoticeList.data.map((item, key) => (
                                            <div
                                                className={styles.listItem}
                                                key={key}
                                                data-link={item.messageUrl}
                                                onClick={this.linkTo}
                                            >
                                                <div className={styles.userImg}>
                                                    <img
                                                        alt={trans('notice.userPhoto', '用户头像')}
                                                        src={item.senderAvatar}
                                                    />
                                                </div>
                                                <div className={styles.main}>
                                                    <div className={styles.commentTitle}>
                                                        <span className="employee">
                                                            {item.senderName}
                                                        </span>{' '}
                                                        {item.title}：
                                                    </div>
                                                    <div className={styles.commentCon}>
                                                        {item.content}
                                                    </div>
                                                    <div className={styles.time}>
                                                        {moment(item.messageSendTime).fromNow()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noMessage}>
                                            {trans('notice.noMessage', '还没有消息哦~')}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.bottom}>
                                    <a target="_blank" href={historyUrl}>
                                        {trans('notice.lookHistory', '查看历史消息')}
                                    </a>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                ) : null}
                <div className={styles.notice_mini}>
                    <div onClick={this.showClick} className={styles.bell}>
                        <span className={styles.noticeIcon}>
                            <i
                                className={icon.iconfont}
                                style={{ textShadow: '0px 0px 3px rgba(59, 111, 245, 0.5)' }}
                            >
                                &#xe75b;
                            </i>
                        </span>
                        {unreadTotal && unreadTotal > 0 ? (
                            <span className={styles.num}>{unreadTotal}</span>
                        ) : null}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default NewNotice;

const getDivDom = (dom) => {
    if (!dom.dataset.link) {
        return getDivDom(dom.parentNode);
    } else {
        return dom;
    }
};
