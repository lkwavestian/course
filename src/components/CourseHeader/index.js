import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import ParentLoginView from '../GlobalUtil/ParentLoginView';
import GlobalUtil from '../../components/GlobalUtil';
import { Dropdown, Icon, Menu } from 'antd';
import SiderMenu from '../SiderMenu';
import { saveCurrent } from '../../utils/utils';
import { trans } from '../../utils/i18n';

@connect((state) => ({
    collapsed: state.global.collapsed,
    currentUser: state.global.currentUser,
    courseCur: state.global.courseCur,
}))
export default class CourseHeader extends PureComponent {
    state = {
        foldStatus: false,
        navList: [],
    };
    componentDidMount() {
        this.getCurrentUserInfo();
    }

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        let tempNavList = [
            { name: trans('course.CourseSchedule', '课表管理'), key: '0' },
            { name: trans('course.CourseSetting', '课程设置'), key: '1' },
            { name: trans('course.CoursePlan', '课时计划'), key: '2' },
            { name: trans('course.Timetable', '作息设置'), key: '3' },
            { name: trans('course.activityManagement', '活动管理'), key: '4' },
            { name: trans('course.transferAndSubstitute', '调代课'), key: '5' },
            { name: trans('course.Calendar', '查看日程'), key: '6' },
            {
                name: trans('course.selection.tabTitle', '选课管理'),
                key: '7',
            },
            // {
            //     name: trans('course.Division', '分班'),
            //     key: '8',
            // },
            { name: '备课模板', key: '8' },
            { name: '评价模板', key: '9' },
            { name: '素养指标', key: '10' },
        ];
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
            if (currentUser.schoolId != 1) {
                let navList = tempNavList.slice(0, -4);
                this.setState({
                    navList,
                });
            } else {
                this.setState({
                    navList: tempNavList,
                });
            }
        });
    };

    toggle = () => {
        const { collapsed } = this.props;
        this.handleMenuCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    iFrameToggle = () => {
        const { foldStatus } = this.state;
        parent.postMessage({ updateShow: 'true' }, '*');
        this.setState({
            foldStatus: !foldStatus,
        });
    };

    handleMenuCollapse = (collapsed) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    // @Debounce(600)
    triggerResizeEvent() {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
        ('');
    }

    switchNavList = (key) => {
        const {
            dispatch,
            match: { params },
            courseCur,
        } = this.props;
        let cur = courseCur ? courseCur : params.tabs ? params.tabs : '0';
        saveCurrent('courseMenu', key);

        //是否是iFrame嵌套
        let isIframe = window.top != window.self;

        //如果是iframe，跳转到特定路由
        if (isIframe) {
            //课表管理
            if (key == '0') {
                window.open(document.referrer + '#/schedule/coursePlan');
            }
            //课程设置
            if (key == '1') {
                window.open(document.referrer + '#/schedule/courseManage');
            }
            //课时计划
            if (key == '2') {
                window.open(document.referrer + '#/schedule/teachingCoursePlan');
            }
            //作息设置
            if (key == '3') {
            }
            //活动管理
            if (key == '4') {
            }
            //调代课
            if (key == '5') {
            }
            //日程
            if (key == '6') {
                window.open(document.referrer + '#/searchschedule');
            }
            //选课管理
            if (key == '7') {
                window.open(document.referrer + '#/schedule/courseSelect');
            }
            //备课模板
            if (key == '8') {
                window.open(document.referrer + '#/schedule/lessonPrepareTemplate');
            }
            //评价模板
            if (key == '9') {
                window.open(document.referrer + '#/schedule/evaluationTemplate');
            }
            //素养指标
            if (key == '10') {
                window.open(document.referrer + '#/schedule/indicatorTree');
            }
        } else {
            //调代课
            if (key == '5') {
                window.open(`/#/replace/index`);
                return;
            }

            if (key == '6') {
                let currentUrl = window.location.href;
                currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
                let host =
                    currentUrl.indexOf('yungu.org') > -1
                        ? 'https://calendar.yungu.org/'
                        : 'https://calendar.daily.yungu-inc.org/';
                window.open(host + '#/searchAgenda');
                return;
            }

            //如果是从课表点击的,打开新页面，否则原页面刷新
            if (cur == '0') {
                window.open(`/courseIndex#/course/index/${key}`);
            } else {
                window.open(`/courseIndex#/course/index/${key}`, '_self');
            }
        }
    };

    navItemClick = (key) => {
        this.switchNavList(key);
    };

    render() {
        const { currentUser, collapsed, searchDateHtml, cur } = this.props;
        const { foldStatus, navList } = this.state;
        let path = location.hash && location.hash.split('#')[1];
        let isCourse = path == '/course/student/list';

        //是否是iFrame嵌套
        let isIframe = window.top != window.self;

        return (
            <div className={styles.courseHeaderWrapper}>
                {isIframe ? (
                    <div>
                        {foldStatus ? (
                            <Icon
                                type="menu-fold"
                                onClick={this.iFrameToggle}
                                className={styles.foldIcon}
                            />
                        ) : (
                            <Icon
                                type="menu-unfold"
                                onClick={this.iFrameToggle}
                                className={styles.foldIcon}
                            />
                        )}
                    </div>
                ) : (
                    <Icon type="menu-unfold" onClick={this.toggle} className={styles.foldIcon} />
                )}
                {navList && navList.length > 0 && (
                    <Dropdown
                        overlay={
                            <Menu>
                                {navList.map((item) => (
                                    <Menu.Item onClick={() => this.navItemClick(item.key)}>
                                        <span>{item.name}</span>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        className={styles.currentNav}
                        overlayClassName={styles.overlayMenuList}
                        placement="bottomCenter"
                    >
                        <span>
                            <span>{navList[cur].name}</span>
                            <Icon type="down" />
                        </span>
                    </Dropdown>
                )}

                {cur == 0 && searchDateHtml}
                <div className={styles.utilContent}>
                    {currentUser.currentIdentity == 'parent' && isCourse ? (
                        <ParentLoginView
                            currentUser={currentUser}
                            color="#fff"
                            nameColor="#fff"
                            isFromDetail={false}
                        />
                    ) : (
                        <GlobalUtil currentUser={currentUser} fontColor="rgba(1, 17, 61, 0.65)" />
                    )}
                </div>
                <SiderMenu
                    collapsed={collapsed}
                    onCollapse={this.handleMenuCollapse}
                    {...this.props}
                />
            </div>
        );
    }
}
