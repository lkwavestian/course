import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select } from 'antd';
import { trans, locale } from '../../../../../utils/i18n';

@connect((state) => ({
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    listSchoolYearSelectInfo: state.student.listSchoolYearSelectInfo,
    currentUser: state.global.currentUser, //当前用户信息
    roleSchoolId: state.teacher.roleSchoolId,
    listSchoolInfo: state.organize.listSchoolInfo,
}))
export default class SemesterSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            schoolId: '',
            semesterId: '',
            language: locale(),
        };
    }

    componentDidMount() {
        // this.getPlanningSchool();
        this.getListSchoolInfo();
    }

    getListSchoolInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organize/getlistSchool',
            payload: {
                companyId: 1, // 机构id
            },
        }).then(() => {
            this.getSemesterInfo();
        });
    };

    //获得学校
    getPlanningSchool = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCouserPlanningSchoolList',
        });
    };

    //获得学期
    getSemesterInfo = () => {
        const { dispatch } = this.props;
        //先请求人员信息
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            this.getSchoolYearList(false);
        });
    };

    // isFlag 为true是Select onChange触发时调用，false为didMount时调用
    getSchoolYearList = (isFlag) => {
        const { currentUser, listSchoolInfo, dispatch } = this.props;
        let tempSchoolId =
            listSchoolInfo && listSchoolInfo.length > 0
                ? listSchoolInfo[0].schoolId
                : currentUser.schoolId;

        console.log('isFlag', isFlag, listSchoolInfo, currentUser, tempSchoolId);

        dispatch({
            type: 'student/getListSchoolYear',
            payload: {
                schoolId: isFlag ? this.state.schoolId : tempSchoolId,
            },
            onSuccess: () => {
                const { listSchoolYearSelectInfo } = this.props;
                this.setState(
                    {
                        schoolId: isFlag ? this.state.schoolId : tempSchoolId,
                        semesterId: listSchoolYearSelectInfo.find((item) => item.current).id,
                    },
                    () => {
                        const { semesterId } = this.state;
                        this.getRoleList();
                        dispatch({
                            type: 'teacher/getRoleSemester',
                            payload: semesterId,
                        });
                        dispatch({
                            type: 'teacher/getRoleSchoolId',
                            payload: isFlag ? this.state.schoolId : tempSchoolId,
                        });
                        dispatch({
                            type: 'teacher/systemBuiltRole',
                            payload: {
                                schoolYearId: semesterId,
                                schoolId: isFlag ? this.state.schoolId : tempSchoolId,
                            },
                        });
                    }
                );
            },
        });
    };

    handleChange = (value, type) => {
        const { dispatch } = this.props;
        if (type === 'school') {
            dispatch({
                type: 'teacher/getRoleSchoolId',
                payload: value,
            });
            this.setState(
                {
                    schoolId: value,
                },
                () => {
                    this.getRoleList();
                    this.getSchoolYearList(true);
                }
            );
        }
        if (type === 'semester') {
            const { dispatch } = this.props;
            this.setState(
                {
                    semesterId: value,
                },
                () => {
                    this.getRoleList();
                    dispatch({
                        type: 'teacher/getRoleSemester',
                        payload: value,
                    });
                }
            );
        }
        this.props.dispatch({
            type: 'teacher/setTag',
            payload: '',
        });
        this.props.dispatch({
            type: 'teacher/clearData',
            payload: {},
        });
        this.props.dispatch({
            type: 'global/clearData',
            payload: {},
        });
        this.props.dispatch({
            type: 'teacher/setPermissiomList',
            payload: [],
        });
        this.props.dispatch({
            type: 'teacher/setPermissiomIndex',
            payload: undefined,
        });
    };

    getRoleList = () => {
        const { dispatch } = this.props;
        const { semesterId, schoolId } = this.state;
        dispatch({
            type: 'teacher/getRoleList',
            payload: {
                schoolId,
                schoolYearId: semesterId,
            },
        });
    };

    render() {
        const { planningSchoolListInfo, listSchoolYearSelectInfo, currentUser, listSchoolInfo } =
            this.props;
        const { schoolId, semesterId, language } = this.state;
        return (
            <div className={styles.semesterSelect}>
                <Select
                    value={schoolId}
                    className={styles.selectStyle}
                    onChange={(e) => this.handleChange(e, 'school')}
                >
                    {/* {planningSchoolListInfo?.map((item, index) => {
                        return (
                            <Option value={item.schoolId} key={item.schoolId}>
                                <span title={language != 'en' ? item.name : item.englishName}>
                                    {language != 'en' ? item.name : item.englishName}
                                </span>
                            </Option>
                        );
                    })} */}
                    {/* 替换接口 */}
                    {listSchoolInfo?.map((item, index) => {
                        return (
                            <Option value={item.schoolId} key={item.schoolId}>
                                <span title={language != 'en' ? item.name : item.enName}>
                                    {language != 'en' ? item.name : item.enName}
                                </span>
                            </Option>
                        );
                    })}
                </Select>
                <Select
                    value={semesterId}
                    onChange={(e) => this.handleChange(e, 'semester')}
                    className={styles.selectStyle}
                >
                    {listSchoolYearSelectInfo?.map((item, index) => {
                        return (
                            <Option value={item.id} key={item.id}>
                                {language != 'en' ? (
                                    <span>{item.name}</span>
                                ) : (
                                    <span>{item.ename}</span>
                                )}
                            </Option>
                        );
                    })}
                </Select>
            </div>
        );
    }
}
