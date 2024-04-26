import React, { Component } from 'react';
import styles from './index.less';
import { Link } from 'dva/router';
import BaseInfor from './baseInfor';
import Student from './student';
import { Skeleton } from 'antd';
import { connect } from 'dva';
import { getUrlSearch } from '../../utils/utils';
import { trans, locale } from '../../utils/i18n';

@connect((state) => ({
    basicInfo: state.courseBaseDetail.basicInfo,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    classList: state.time.classList,
    allGradeOfAS: state.courseTeacherDetail.allGradeOfAS,
    allGradeAndGroup: state.courseTeacherDetail.allGradeAndGroup,
    currentUser: state.global.currentUser,
    userSchoolId: state.global.userSchoolId,
    chooseCourseDetails: state.choose.chooseCourseDetails,
}))
class BaseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: getUrlSearch('tabIndex') || 1,
            // tabIndex: 0,
            navList: [trans('global.title', '课程信息'), trans('global.student', '学生')],
            loading: false,
            isAdmin: getUrlSearch('isAdmin') == 'true' ? true : false,
            nonAdminType: getUrlSearch('nonAdminType'),
            courseIntroductionType: getUrlSearch('courseIntroductionType'),
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'global/getCurrentUser',
        });
        this.initData();
        this.props.dispatch({
            type: 'course/showCoursePlanningDetail',
            payload: {
                coursePlanningId: getUrlSearch('coursePlanningId'),
                chooseCoursePlanId: getUrlSearch('chooseCoursePlanId'),
            },
        });
        this.props.dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id: getUrlSearch('chooseCoursePlanId'),
            },
        });
    }

    initData() {
        const { dispatch } = this.props;
        let planId = getUrlSearch('chooseCoursePlanId');

        // 所有班级
        let p1 = new Promise((resolve, reject) => {
            dispatch({
                type: 'time/getClassList',
                payload: {
                    sectionIds:
                        (getUrlSearch('sectionIds') && getUrlSearch('sectionIds').split('_')) || [],
                    planId,
                },
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        // 添加学生，添加班级专用获取年级接口
        let p2 = new Promise((resolve, reject) => {
            dispatch({
                type: 'courseTeacherDetail/allGradeOfAS',
                payload: {
                    planId,
                    sectionIds:
                        (getUrlSearch('sectionIds') && getUrlSearch('sectionIds').split('_')) || [],
                },
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p3 = new Promise((resolve, reject) => {
            dispatch({
                type: 'courseBaseDetail/getChooseCourseInfo',
                payload: {
                    chooseCourseName: getUrlSearch('chooseCourseName'),
                    courseId: getUrlSearch('courseId'),
                },
            }).then(() => {
                resolve(null);
            });
        });

        /* let p4 = new Promise((resolve, reject) => {
            dispatch({
                type: 'course/showCoursePlanningDetail',
                payload: {
                    coursePlanningId: getUrlSearch('coursePlanningId'),
                    chooseCoursePlanId: planId,
                },
            }).then(() => {
                resolve(null);
            });
        }); */

        // 全部加载完在去展示弹窗
        Promise.all([p1, p2, p3]).then(() => {
            this.setState({
                loading: true,
            });
        });
    }

    navHTML() {
        let { tabIndex, isAdmin } = this.state;
        let nonAdminType = getUrlSearch('nonAdminType');
        let navList = [trans('global.title', '课程信息'), trans('global.student', '学生')];
        if (!isAdmin) {
            navList = [trans('global.title', '课程信息')];
        }

        let sectionIds = getUrlSearch('sectionIds');

        let chooseCoursePlanId = getUrlSearch('chooseCoursePlanId');
        let ifOutside =
            window.self != window.top
                ? `&ifOutside=${getUrlSearch('ifOutside') ? getUrlSearch('ifOutside') : 'false'}`
                : '';
        return (
            <div className={styles.nav}>
                <div className={styles.inner}>
                    <div className={styles.link}>
                        <Link
                            to={`/course/teacher/detail?planId=${chooseCoursePlanId}&sectionIds=${sectionIds}${ifOutside}`}
                            className={styles.icon}
                        ></Link>
                        <span className={styles.title}>
                            {' '}
                            {locale() == 'en'
                                ? getUrlSearch('courseEname')
                                : getUrlSearch('courseName')}{' '}
                        </span>
                        {/* <span className={styles.sub}>
                            {' '}
                            {locale() == 'en'
                                ? getUrlSearch('chooseCourseEname')
                                : getUrlSearch('chooseCourseName')}{' '}
                        </span> */}
                    </div>
                    <div className={styles.tab}>
                        {navList.map((el, i) => (
                            <span
                                key={i}
                                onClick={() => {
                                    if (tabIndex !== i) {
                                        this.setState({
                                            tabIndex: i,
                                        });
                                    }
                                }}
                                className={styles.item}
                            >
                                <span className={tabIndex == i ? styles.active : null}>{el}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    hexToRgba = (bgColor, alpha) => {
        let color = bgColor.slice(1);
        let rgba = [
            parseInt('0x' + color.slice(0, 2)),
            parseInt('0x' + color.slice(2, 4)),
            parseInt('0x' + color.slice(4, 6)),
            alpha,
        ];
        return 'rgba(' + rgba.toString() + ')';
    };

    noToChinese = (num) => {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert('Number is wrong!');
            return 'Number is wrong!';
        }
        // eslint-disable-next-line no-array-constructor
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        // eslint-disable-next-line no-array-constructor
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            // eslint-disable-next-line default-case
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }
        if (a.length > 1) {
            //加上小数部分(如果有小数部分)
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    };

    contentHTML() {
        let { tabIndex, isAdmin, courseIntroductionType } = this.state;
        let {
            showCoursePlanningDetail,
            classList,
            allGradeOfAS,
            chooseCourseDetails,
            currentUser,
        } = this.props;
        let schoolId = currentUser.schoolId;
        let chooseCoursePlanId = getUrlSearch('chooseCoursePlanId');

        return tabIndex == 0 ? (
            <BaseInfor
                {...showCoursePlanningDetail}
                noToChinese={this.noToChinese}
                hexToRgba={this.hexToRgba}
                schoolId={schoolId}
                chooseCoursePlanId={chooseCoursePlanId}
                userSchoolId={this.props.userSchoolId}
                courseIntroductionType={chooseCourseDetails?.courseIntroductionType}
                classFeeShow={chooseCourseDetails.classFeeShow}
                materialFeeShow={chooseCourseDetails.materialFeeShow}
                startTime={chooseCourseDetails.startTime}
                endTime={chooseCourseDetails.endTime}
                classDate={chooseCourseDetails.classDate}
            />
        ) : (
            <Student gradeListOfAS={allGradeOfAS} classListOfAS={classList} isAdmin={isAdmin} />
        );
    }

    render() {
        // 首屏加载过度动画
        if (!this.state.loading) {
            return (
                <div className={styles.BaseDetail}>
                    {this.navHTML()}
                    <div className={styles.Skeleton}>
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.BaseDetail}>
                {this.navHTML()}
                {this.contentHTML()}
            </div>
        );
    }
}

export default BaseDetail;
