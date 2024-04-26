//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import CourseMange from 'components/Course/SetUp/index';
import CoursePlan from 'components/Course/Plan/index';
import CourseSelect from 'components/Course/CourseSelect';
import Division from 'components/Course/Division';
import Club from 'components/Club/index';

import TimeSchedule from '../../components/Time/Schedule/index';
import TimeTable from '../../components/Time/TimeTable/index';
import LessonTemplate from '../../components/LessonTemplate/index';
import EvaluationTemplate from '../../components/LessonTemplate/evaluationTemplate';
import IndicatorTree from '../../components/LessonTemplate/indicatorTree';
import { Skeleton } from 'antd';

import { getUrlSearch, saveCurrent } from '../../utils/utils';
import CourseHeader from '../../components/CourseHeader';
@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
    courseCur: state.global.courseCur,
}))
export default class CourseManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchDateHtml: '',
            isTimeTableManage: false,
        };
    }

    componentWillMount() {
        const {
            match: { params },
        } = this.props;
        let title = '课表管理';
        switch (params.tabs) {
            case '0':
                title = '课表管理';
                break;
            case '1':
                title = '课程设置';
                break;
            case '2':
                title = '课时计划';
                break;
            case '3':
                title = '作息设置';
                break;
            case '4':
                title = '活动管理';
                break;
            case '7':
                title = '选课管理';
                break;
            case '8':
                title = '备课模版';
                break;
            case '9':
                title = '评价模版';
            break;
            case '10':
                title = '素养指标';
                break;
            default:
                title = '课表管理';
        }
        document.getElementsByTagName('title')[0].innerHTML = title;
    }

    componentDidMount() {
        this.ifHavePower();
        let _this = this;
        window.onmessage = function (e) {
            if (e.data.isTimeTableManage) {
                _this.setState({
                    isTimeTableManage: true,
                });
            }
        };
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        let arr = []; // 获取当前权限的所有key
        dispatch({
            type: 'global/havePower',
            payload: {},
        }).then(() => {
            let { powerStatus } = this.props;

            this.setState({
                loading: false,
            });
        });
    }

    getSearchDateHtml = (searchDateHtml) => {
        this.setState({
            searchDateHtml,
        });
    };

    judgeCourseHeaderVisible = () => {
        let isIPad = getUrlSearch('isIPad') === 'true' ? true : false;
        const { isTimeTableManage } = this.state;
        if (isIPad) return false;
        // if(window.top != window.self) {
        //     const { match: { params } } = this.props;
        //     if(params.tabs === 4 || params.tabs === 3) return false;
        // }
        if (window.top == window.self) return true;
        return isTimeTableManage;
    };

    render() {
        const {
            match: { params },
            courseCur,
        } = this.props;
        const { loading, searchDateHtml, isTimeTableManage } = this.state;
        let cur = courseCur ? courseCur : params.tabs ? params.tabs : '0';

        if (loading) {
            return (
                <div>
                    {this.judgeCourseHeaderVisible() && <CourseHeader cur={cur} />}
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            );
        }

        return (
            <div className={styles.coursePage}>
                {/* 如果是task嵌套，并且是课表、可是计划、作息表其中一个 */}
                {this.judgeCourseHeaderVisible() && (
                    <CourseHeader
                        searchDateHtml={searchDateHtml}
                        cur={cur}
                        match={this.props.match}
                    />
                )}

                <div className={styles.mainContent}>
                    {/* 课表管理 */}
                    {cur == '0' && (
                        <TimeTable
                            getSearchDateHtml={this.getSearchDateHtml}
                            match={this.props.match}
                        />
                    )}

                    {/* 课程设置 */}
                    {cur == '1' && <CourseMange match={this.props.match}/>}

                    {/* 课时计划 */}
                    {cur == '2' && <CoursePlan />}

                    {/* 作息设置 */}
                    {cur == '3' && <TimeSchedule />}

                    {/* 活动管理 */}
                    {cur == '4' && <Club />}

                    {/* 调代课 */}
                    {/* {cur == '5' && <Division />} */}

                    {/* 日程 */}

                    {/* 选课管理 */}
                    {cur == '7' && <CourseSelect />}

                    {/* 分班 */}
                    {/* {cur == '8' && <Division />} */}

                    {/* 备课模板 */}
                    {cur == '8' && <LessonTemplate />}
                    {/* {cur == '7' && <SchoolManagement />} */}
                    {/* 评价模板 */}
                    {cur == '9' && <EvaluationTemplate />}
                    {/* 素养指标 */}
                    {cur == '10' && <IndicatorTree />}
                </div>
            </div>
        );
    }
}
