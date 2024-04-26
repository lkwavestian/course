import React, { PureComponent } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import icon from '../../icon.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../utils/i18n';
import classNames from 'classnames';
import { connect } from 'dva';
import SiderMenu from '../SiderMenu/index';
import GlobalNav from 'components/GlobalNav';
import GlobalUtil from 'components/GlobalUtil/index.js';
import ParentLoginView from '../GlobalUtil/ParentLoginView/index';
import logoImg from '../../assets/favicon.png';
import studentCourseImg from '../../assets/studentCourse.png';
import StudyCenterBar from './studyCenterBar';
import '../../common/menu';

@connect((state) => ({
    currentUser: state.global.currentUser,
}))
export default class GlobalHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuKey: 1,
            schoolList: [],
        };
    }
    componentDidMount() {
        window.addEventListener(
            'message',
            (e) => {
                // 通过origin对消息进行过滤，避免遭到XSS攻击
                if (
                    e.data &&
                    e.data.schoolList &&
                    e.data.schoolList.length &&
                    e.data.schoolList.length > 1
                ) {
                    this.setState({
                        schoolList: e.data.schoolList,
                    });
                }
            },
            false
        );
    }
    toggle = () => {
        const { onCollapse, collapsed } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };
    @Debounce(600)
    triggerResizeEvent() {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
        ('');
    }

    getTitle() {
        const { currentUser } = this.props;
        let path = window.location.hash && window.location.hash.split('#')[1];
        let arr = global.menuList;
        let pageTitle;
        for (let i = 0; i < arr.length; i++) {
            if (path == arr[i].path) {
                pageTitle = arr[i].name;
                break;
            }
        }
        // wm修改
        if (path == '/') {
            pageTitle = trans('teacher.teacherManagement', '员工管理');
        }
        // if(path == "/") {
        //     pageTitle = '收费管理';
        // }
        if (path == '/time/club') {
            pageTitle = trans('schedule.scheduleManagement', '课表管理');
        }
        if (path == '/course/student/list') {
            if (currentUser.currentIdentity == 'parent') {
                pageTitle =
                    trans('course.selection', '课程选课') + '-' + currentUser.currentChildName;
            } else {
                pageTitle = trans('course.selection', '课程选课');
            }
        }
        return pageTitle;
    }
    onMenuClick = (key) => {
        console.log(key);
        this.setState({
            menuKey: key,
        });
    };
    render() {
        const { currentUser, navList, cur, switchNavList, replace } = this.props;
        const { menuKey, schoolList } = this.state;
        const iconClass = classNames(icon.iconfont, styles.triggerIcon);
        const pageTitle = this.getTitle();
        let path = location.hash && location.hash.split('#')[1];
        let isCourse = path == '/course/student/list';
        let evaluatePath = '';
        if (window.location.origin.indexOf('daily') > -1) {
            evaluatePath = `https://task.daily.yungu-inc.org/common/switchIdentity/#/user/switchSchool?language=zh-CN`;
        } else {
            evaluatePath = `https://task.yungu.org/common/switchIdentity/#/user/switchSchool?language=zh-CN`;
        }
        const menu = (
            <Menu key="personal" className={styles.replaceMobileMenu} selectedKeys={[]}>
                <iframe src={evaluatePath} width="100%" height="100%" frameBorder="0"></iframe>
            </Menu>
        );
        if (replace == 'replaceMobile') {
            return (
                <div className={styles.replaceMobileHeader} id="header">
                    <iframe
                        src={evaluatePath}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ display: 'none' }}
                    ></iframe>
                    {schoolList && schoolList.length > 0 ? (
                        <Dropdown overlay={menu} trigger={['click']}>
                            <div className={styles.left}>
                                <span className={styles.schoolName}>{currentUser?.schoolName}</span>
                                <i
                                    className={icon.iconfont}
                                    style={{
                                        color: 'rgba(0,17,61,.85)',
                                    }}
                                >
                                    &#xe659;
                                </i>
                            </div>
                        </Dropdown>
                    ) : (
                        <div className={styles.left}>
                            <span className={styles.schoolName}>{currentUser?.schoolName}</span>
                        </div>
                    )}

                    <div className={styles.right}>
                        <div className={styles.utilContent}>
                            {currentUser.currentIdentity == 'parent' && isCourse ? (
                                <ParentLoginView
                                    currentUser={currentUser}
                                    color="#fff"
                                    nameColor="#fff"
                                    isFromDetail={false}
                                    replace={replace}
                                />
                            ) : (
                                <GlobalUtil currentUser={currentUser} replace={replace} />
                            )}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.header} id="header">
                    {
                        // 学生端选课不显示菜单导航
                        isCourse ? null : (
                            <i className={iconClass} onClick={this.toggle}>
                                &#xe908;
                            </i>
                        )
                    }
                    <div className={styles.headerTitle}>
                        <img src={isCourse ? studentCourseImg : logoImg} alt="" />
                        <span className={styles.titleTxt}>{pageTitle}</span>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.globalNav}>
                            <GlobalNav navList={navList} cur={cur} switchNavList={switchNavList} />
                        </div>
                        {currentUser.currentIdentity ==
                        'parent' ? null : currentUser.currentIdentity ? (
                            <div
                                className={styles.libraryIcon}
                                style={{
                                    right:
                                        currentUser.currentIdentity == 'parent'
                                            ? 'calc(2% + 159px)'
                                            : 'calc(2% + 150px)',
                                }}
                            >
                                <StudyCenterBar currentUser={currentUser} />
                            </div>
                        ) : null}
                        <div className={styles.utilContent}>
                            {currentUser.currentIdentity == 'parent' && isCourse ? (
                                <ParentLoginView
                                    currentUser={currentUser}
                                    color="#fff"
                                    nameColor="#fff"
                                    isFromDetail={false}
                                />
                            ) : (
                                <GlobalUtil currentUser={currentUser} />
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }
}
