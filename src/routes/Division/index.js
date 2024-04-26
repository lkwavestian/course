import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import styles from './index.less';
import { trans } from '../../utils/i18n';
import BasicHeader from '../../layouts/BasicLayout';

// import Division from "components/Course/Division";
import { saveCurrent } from '../../utils/utils';
import Detail from '../../components/Course/Division/Detail/index';

@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class DetailToDivision extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            navList: [],
        };
    }

    componentWillMount() {
        const {
            match: { params },
        } = this.props;
        let title = '课表';
        switch (params.tabs) {
            case '0':
                title = '课时计划';
                break;
            case '1':
                title = '课表';
                break;
            case '2':
                title = '选课管理';
                break;
            case '3':
                title = '作息表';
                break;
            case '4':
                title = '课程设置';
                break;
            case '5':
                title = '分班';
                break;
            default:
                title = '课表';
        }
        document.getElementsByTagName('title')[0].innerHTML = title;
    }

    componentDidMount() {
        this.ifHavePower();
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        let { navList, cur } = this.state;
        let arr = []; // 获取当前权限的所有key
        dispatch({
            type: 'global/havePower',
            payload: {},
        }).then(() => {
            let {
                powerStatus,
                match: { params },
            } = this.props;
            console.log('powerStatus', powerStatus);
            if (powerStatus) {
                if (powerStatus.content.indexOf('smart:scheduling:courseManagement') != -1) {
                    navList.push({ name: trans('course.CoursePlan', '课时计划'), key: '0' });
                    arr.push('0');
                }
                if (powerStatus.content.indexOf('smart:scheduling:timetable') != -1) {
                    navList.push({ name: trans('course.CourseSchedule', '课表'), key: '1' });
                    arr.push('1');
                }
                if (powerStatus.content.indexOf('smart:scheduling:courseSelectionSetting') != -1) {
                    navList.push({
                        name: trans('course.selection.tabTitle', '选课管理'),
                        key: '2',
                    });
                    arr.push('2');
                }
                /* if (powerStatus.content.indexOf('smart:scheduling:division') != -1) {
                    navList.push({ name: trans('course.Division', '分班'), key: '6' });
                    arr.push('6');
                } */
                if (powerStatus.content.indexOf('smart:scheduling:schedule:manage') != -1) {
                    navList.push({ name: trans('course.Timetable', '作息表'), key: '3' });
                    arr.push('3');
                }
                if (powerStatus.content.indexOf('smart:scheduling:courseSetting') != -1) {
                    navList.push({ name: trans('course.CourseSetting', '课程设置'), key: '4' });
                    arr.push('4');
                }
            }

            if (!params.tabs) {
                cur = 1;
            } else {
                cur = params.tabs || 1;
            }

            navList.push({ name: trans('course.Division', '分班'), key: '6' });
            arr.push('6');
            navList.push({ name: trans('course.Calendar', '日程'), key: '5' });
            arr.push('5');

            this.setState({
                loading: false,
                navList: [...navList],
                cur,
            });
        });
    }

    switchNavList = (key) => {
        if (key == '5') {
            let currentUrl = window.location.href;
            currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
            let host =
                currentUrl.indexOf('yungu.org') > -1
                    ? 'https://calendar.yungu.org/'
                    : 'https://calendar.daily.yungu-inc.org/';
            window.open(host + '#/searchAgenda');
            return;
        }

        saveCurrent('courseMenu', key);
        window.open('/#/course/index/' + key);
    };

    render() {
        const { id, navList } = this.state;
        let {
            powerStatus,
            match: { params },
        } = this.props;
        console.log(params, 'params');
        return (
            <div>
                <BasicHeader navList={navList} cur={6} switchNavList={this.switchNavList} />
                <Detail id={this.state.id} params={params} />
            </div>
        );
    }
}
