import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import icon from '../../icon.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../utils/i18n';
import classNames from 'classnames';
import SiderMenu from '../SiderMenu/index';
import GlobalNav from 'components/GlobalNav';
import GlobalUtil from 'components/GlobalUtil';
import logoImg from '../../assets/favicon.png';
import studentCourseImg from '../../assets/studentCourse.png';
import libraryIcon from '../../assets/libraryIcon.png';
import '../../common/menu';

export default class GlobalHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
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
        let path = window.location.hash && window.location.hash.split('#')[1];
        let arr = global.menuList;
        let pageTitle;
        for (let i = 0; i < arr.length; i++) {
            if (path == arr[i].path) {
                pageTitle = arr[i].name;
                break;
            }
        }

        if (path == '/') {
            pageTitle = trans('course.selection', '课程选课');
        }
        // if(path == "/") {
        //     pageTitle = '收费管理';
        // }
        if (path == '/time/club') {
            pageTitle = trans('schedule.scheduleManagement', '课表管理');
        }
        if (path == '/course/student/list') {
            pageTitle = trans('course.selection', '课程选课');
        }
        return pageTitle;
    }

    render() {
        const { currentUser, navList, cur, switchNavList } = this.props;
        const iconClass = classNames(icon.iconfont, styles.triggerIcon);
        const pageTitle = this.getTitle();
        console.log('pageTitle', pageTitle);
        let path = location.hash && location.hash.split('#')[1];
        let isCourse = path == '/course/student/list' || path == '/';
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
                    <div className={styles.libraryIcon}>
                        <a href="http://librarysearch.yungu.org/opac/">
                            <img src={libraryIcon} />
                        </a>
                    </div>
                    <div className={styles.utilContent}>
                        <GlobalUtil currentUser={currentUser} />
                    </div>
                </div>
            </div>
        );
    }
}
