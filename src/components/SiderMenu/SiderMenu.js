import React, { PureComponent } from 'react';
import { Layout, Icon, Menu } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';
import logoImg from '../../assets/favicon.png';
import '../../common/menu';

const { Sider } = Layout;
const { SubMenu } = Menu;

@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
    // powerPayStatus: state.global.powerPayStatus,//是否有收费管理权限
}))
export default class SiderMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let self = this;
        window.onmessage = function (message) {
            if (message.data == 'close') {
                self.setState({
                    iframeVisible: false,
                });
            } else if (message.data == 'reload') {
                self.setState({
                    iframeVisible: false,
                });
                window.location.reload();
            }
        };
    }

    handleOpenChange = (openKeys) => {
        const lastOpenKey = openKeys[openKeys.length - 1];
    };

    activeMenuChange = (path) => {
        const { onCollapse } = this.props;
        document.getElementsByTagName('title')[0].innerHTML = '教务中心';
        onCollapse(true);
        this.toCourseIndex(path);
    };

    toCourseIndex = (path) => {
        if (path === '/course/index') {
            window.open(`/courseIndex#${path}`);
        } else {
            window.open(`/#${path}`);
        }
    };

    render() {
        const {
            onCollapse,
            powerStatus,
            // powerPayStatus,
        } = this.props;
        let menuData = global.menuList;
        //判断是否有课表管理的权限
        let powerSchedule =
            powerStatus.content && powerStatus.content.indexOf('smart:scheduling:timetable') != -1
                ? true
                : false;
        //判断是否有课程管理的权限
        let powerCourse =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:scheduling:course:manage') != -1
                ? true
                : false;
        //判断是否有机构管理的权限
        let powerOrganize =
            powerStatus.content && powerStatus.content.indexOf('smart:teaching:agency:manage') != -1
                ? true
                : false;
        // 判断线上，日常环境
        const Host =
            location.origin.indexOf('smart-scheduling.yungu.org') !== -1
                ? 'https://smart-scheduling.yungu.org'
                : 'https://smart-scheduling.daily.yungu-inc.org';

        /* let host = currentUrl.indexOf("smart-scheduling.yungu.org") > -1
          ? 'https://smart-scheduling.yungu.org/' 
          : 'https://smart-scheduling.daily.yungu-inc.org/'; */
        // 判断是否有收费管理的权限
        let powerPay =
            powerStatus.content && powerStatus.content.indexOf('pay:user:charge:manage') != -1
                ? true
                : false;
        // 判断线上，日常环境
        // const Host = location.origin.indexOf('.daily') !== -1 ? 'https://smart-scheduling.daily.yungu-inc.org' : 'https://smart-scheduling.yungu.org';

        //判断是否有看板管理的权限
        let powerKanBan =
            powerStatus.content && powerStatus.content.indexOf('smart:teacher:worksheet:show') != -1
                ? true
                : false;
        return (
            <Sider trigger={null} collapsible breakpoint="lg" className={styles.sider}>
                <div className={styles.userInfo} key="logo">
                    <Link to="/" className={styles.logoTitle}>
                        <img src={logoImg} alt="" />
                        <span className={styles.logoTxt}>
                            {trans('global.ManagementCenter', '教务中心')}
                        </span>
                    </Link>
                </div>

                <Menu
                    key="Menu"
                    //  theme="dark"
                    mode="inline"
                    className={styles.menu}
                    onOpenChange={this.handleOpenChange}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    <Menu.Item className={styles.subMenu}>
                        <a onClick={() => this.activeMenuChange('/student/index')} target="_blank">
                            <i className={icon.iconfont}>&#xe670;</i>
                            <span className={styles.menuTitle}>
                                {trans('student.studentManagement', '学生管理')}
                            </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item className={styles.subMenu}>
                        <a
                            onClick={() => this.activeMenuChange('/course/employees')}
                            target="_blank"
                        >
                            <i className={icon.iconfont}>&#xe6aa;</i>
                            <span className={styles.menuTitle}>
                                {trans('teacher.teacherManagement', '员工管理')}
                            </span>
                        </a>
                    </Menu.Item>
                    {powerCourse && (
                        <Menu.Item className={styles.subMenu}>
                            <a
                                onClick={() => this.activeMenuChange('/course/index')}
                                target="_blank"
                            >
                                <i className={icon.iconfont}>&#xe708;</i>
                                <span className={styles.menuTitle}>
                                    {' '}
                                    {trans('course.selection.menuTitle', '课程管理')}{' '}
                                </span>
                            </a>
                        </Menu.Item>
                    )}
                    {/* {
                    powerSchedule && 
                    <Menu.Item className={styles.subMenu}>
                      <Link to='/time/index' onClick={this.activeMenuChange}>
                        <i className={icon.iconfont}>&#xe62c;</i>
                        <span className={styles.menuTitle}>{trans('schedule.scheduleManagement','课表管理')}</span>
                      </Link>
                    </Menu.Item>
                  } */}
                    {powerOrganize && (
                        <Menu.Item className={styles.subMenu}>
                            <a
                                onClick={() => this.activeMenuChange('/organize/index')}
                                target="_blank"
                            >
                                <i className={icon.iconfont}>&#xe6bf;</i>
                                <span className={styles.menuTitle}>
                                    {trans('organization.organizationManagement', '机构管理')}
                                </span>
                            </a>
                        </Menu.Item>
                    )}
                    {powerPay && (
                        <Menu.Item className={styles.subMenu}>
                            <a
                                onClick={() => this.activeMenuChange('/charge/index')}
                                target="_blank"
                            >
                                <i className={icon.iconfont}>&#xe6bf;</i>
                                <span className={styles.menuTitle}>
                                    {trans('charge.chargeManagement', '收费管理')}
                                </span>
                            </a>
                        </Menu.Item>
                    )}
                    {powerKanBan && (
                        <Menu.Item className={styles.subMenu}>
                            <a
                                onClick={() => this.activeMenuChange('/kanBan/index')}
                                target="_blank"
                            >
                                <i className={icon.iconfont}>&#xe6bf;</i>
                                <span className={styles.menuTitle}>
                                    {trans('charge.KanbanManagement', '看板管理')}
                                </span>
                            </a>
                        </Menu.Item>
                    )}
                </Menu>
            </Sider>
        );
    }
}
