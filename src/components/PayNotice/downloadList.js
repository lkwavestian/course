//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './downloadList.less';
import { Modal, Checkbox, Button, message, Select, Radio } from 'antd';
import { gradeValues } from '../../utils/utils';
import { trans, locale } from '../../utils/i18n';

const { Option } = Select;
const studentOptions = [
    { label: trans('charge.onlyTeachChildren', '教职工子女'), value: 1 },
    { label: trans('charge.noOnlyTeachChildren', '非教职工子女'), value: 2 },
];
const allStudentOption = [{ label: trans('global.all.students', '全部学生'), value: 0 }];

@connect((state) => ({
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    planningSemesterInfo: state.course.planningSemesterInfo, // 学年学期
    currentUser: state.global.currentUser,
}))
export default class AddPro extends PureComponent {
    constructor(props) {
        super(props);
        this.props.onRef && this.props.onRef(this);
        this.state = {
            visible: false,
            isKindergarten: true,
            isNoKindergarten: true,
            isNoTeacherChildren: true,
            studentRadioValue: [],
            options: [],
            teacherValue: [],
            downLoadSection: [],
            downLoadStudent: [],
            studentType: [],
            allStudent: [],
            gradeCheckValues: [],
            grade: [],
            newGrade: [],
            arrayValue: [],
            arrayValue1: [],
            semesterValue: undefined,
            exportFlag: 2,
        };
    }

    componentDidMount() {
        const { currentUser, dispatch } = this.props;
        console.log(currentUser, 'currentUser');
        this.getSelectTeachers();

        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId: currentUser?.schoolId || '',
            },
        });
    }
    //取消
    handleCancel = () => {
        this.props.changeVisible(false);
        this.props.isloading(false);
        this.setState({
            studentRadioValue: [],
            studentType: [],
            isKindergarten: true,
            isNoKindergarten: true,
            isNoTeacherChildren: true,

            newGrade: [],
            downLoadSection: [],
            arrayValue: [],
            arrayValue1: [],
            semesterValue: undefined,
            exportFlag: 2,
        });
    };
    getSelectTeachers = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTeachingOrgStage',
        }).then(() => {
            const { campusAndStage } = this.props;
            let teacherValue = [];
            campusAndStage.stage &&
                campusAndStage.stage.length &&
                campusAndStage.stage.map((item) => {
                    teacherValue.push(item);
                });
            this.setState({
                teacherValue,
            });
        });
    };

    //确认
    okBtn = () => {
        const { studentType, studentRadioValue, grade, semesterValue } = this.state;
        if (studentType.length == 0) {
            message.info(trans('charge.changeStudent_Type', '请选择学生类型'));
            return;
        } else if (studentRadioValue.length == 0) {
            message.info(trans('charge.change_stage', '请选择学段'));
            return;
        } else if (!semesterValue) {
            message.info('请选择学年学期');
            return;
        }
        const payload = {
            studentType: studentType,
            studentStage: studentRadioValue,
            grade,
            semesterValue,
        };
        console.log('payload', payload);
        this.props.changeVisible(payload);
        this.props.isloading(true);

        this.setState({
            semesterValue: undefined,
        });
    };
    recoverStatus = () => {
        this.setState({
            studentRadioValue: [],
            isKindergarten: true,
            isNoKindergarten: true,
            isNoTeacherChildren: true,
            gradeCheckValues: [],
        });
    };

    onChange = (value) => {
        const { isTrue } = this.props;
        const { studentRadioValue } = this.state;
        if (!isTrue) {
            this.setState({
                studentType: value,
            });
            if (value.indexOf(2) > -1) {
                this.setState({
                    isKindergarten: false,
                });
            } else {
                if (
                    studentRadioValue.indexOf(1) > -1 ||
                    studentRadioValue.indexOf(2) > -1 ||
                    studentRadioValue.indexOf(3) > -1
                ) {
                    this.setState({
                        isKindergarten: false,
                    });
                } else {
                    this.setState({
                        isKindergarten: true,
                    });
                }
            }
        } else {
            this.setState({
                downLoadSection: value,
            });
            let array = [];
            let arrayValue = [];
            let newArray = [];
            value.length > 0 &&
                value.map((item, index) => {
                    gradeValues.map((items, index) => {
                        // console.log(items.value.split('-')[0], '201');
                        // console.log(item, '202');
                        if (items.value.split('-')[0] == item) {
                            array.push(items);
                            arrayValue.push(items.value);
                        }
                    });
                });
            arrayValue.map((item) => {
                if (item.split('-')[0] == 0) {
                    newArray.push(item.split('-')[1] * -1);
                } else {
                    newArray.push(item.split('-')[1]);
                }
            });
            this.setState({
                gradeCheckValues: array,
                arrayValue,
                newGrade: newArray,
            });
        }
    };
    onchangeAllStudent = (e) => {
        this.setState({
            allStudent: e,
            studentRadioValue: [1, 2],
        });
        if (e.length == 0) {
            this.setState({
                studentRadioValue: [],
            });
        }
    };
    onChangeStudent = (e) => {
        const { studentType, isNoKindergarten } = this.state;
        const { isTrue } = this.props;
        if (isTrue) {
            this.setState({
                studentRadioValue: e,
            });
            if (e.length == 2) {
                this.setState({
                    allStudent: [0],
                });
            } else if (e.length == 1) {
                this.setState({
                    allStudent: [],
                });
            }
        } else {
            if (e.indexOf(1) > -1) {
                this.setState({
                    isNoKindergarten: false,
                    isNoTeacherChildren: false,
                });
            } else {
                this.setState({
                    isNoKindergarten: true,
                    isNoTeacherChildren: true,
                });
            }
            if (e.indexOf(2) > -1 || e.indexOf(3) > -1 || e.indexOf(4) > -1) {
                this.setState({
                    isKindergarten: false,
                });
            } else {
                if (studentType.indexOf(2) > -1) {
                    this.setState({
                        isKindergarten: false,
                    });
                } else {
                    this.setState({
                        isKindergarten: true,
                    });
                }
            }
            this.setState({
                studentRadioValue: e,
            });
            console.log('gradeValues', gradeValues);
            let array = [];
            let arrayValue1 = [];
            let newArray = [];
            e.length > 0 &&
                e.map((item, index) => {
                    gradeValues.map((items, index) => {
                        // console.log(items.value.split('-')[0], '201');
                        // console.log(item, '202');
                        if (items.value.split('-')[0] == item) {
                            array.push(items);
                            arrayValue1.push(items.value);
                        }
                    });
                });
            arrayValue1.map((item) => {
                if (item.split('-')[0] == 1) {
                    newArray.push(item.split('-')[1] * -1);
                } else {
                    newArray.push(item.split('-')[1]);
                }
            });
            this.setState({
                gradeCheckValues: array,
                arrayValue1,
                grade: newArray,
            });
        }
    };
    onChangeGrade = (e) => {
        console.log(e);
        const { isNoKindergarten } = this.state;
        // console.log(e);
        let grades = [];
        e.map((item) => {
            if (item.split('-')[0] == 1) {
                grades.push(item.split('-')[1] * -1);
            } else {
                grades.push(item.split('-')[1]);
            }
        });
        this.setState({
            grade: grades,
            newGrade: grades,
            arrayValue: e,
            arrayValue1: e,
        });
    };

    changeSemester = (value) => {
        this.setState({
            semesterValue: value,
        });
    };

    changeExportType = (e) => {
        if (e.target.value == 2) {
            this.setState({
                semesterValue: undefined,
            });
        }
        this.setState({
            exportFlag: e.target.value,
        });
    };

    downloadExcel = (semesterValue, downLoadSection, studentRadioValue, newGrade) => {
        const { exportFlag } = this.state;
        if (downLoadSection.length == 0) {
            message.warn('收费学段必选');
            return;
        }
        if (studentRadioValue.length == 0) {
            message.warn('学生类型必选');
            return;
        }
        if (newGrade.length == 0) {
            message.warn('年级必选');
            return;
        }

        if (exportFlag == 1) {
            if (!semesterValue) {
                message.warn('请选择学年学期');
            } else {
                window.open(
                    `/api/payTuition/getStudentTuitionExcel?studentStage=${downLoadSection}&studentType=${studentRadioValue}&studentGrade=${newGrade}&semesterId=${semesterValue}`
                );
            }
        } else if (exportFlag == 2) {
            window.open(
                `/api/payTuition/getStudentTuitionExcel?studentStage=${downLoadSection}&studentType=${studentRadioValue}&studentGrade=${newGrade}`
            );
        }
    };

    render() {
        const { downloadListVisible, isTrue, loading, planningSemesterInfo } = this.props;
        const {
            isKindergarten,
            isNoKindergarten,
            studentRadioValue,
            teacherValue,
            downLoadSection,
            isNoTeacherChildren,
            studentType,
            allStudent,
            gradeCheckValues,
            arrayValue1,
            arrayValue,
            newGrade,
            semesterValue,
            exportFlag,
        } = this.state;
        const tuiTionType = [
            { label: trans('charge.onlyTeachChildren', '教职工子女'), value: 1 },
            {
                label: trans('charge.noOnlyTeachChildren', '非教职工子女'),
                value: 2,
                disabled: !isNoTeacherChildren,
            },
        ];
        let teacherNewValue = [];
        for (let index = 0; index < teacherValue.length; index++) {
            if (teacherValue[index].name == '幼儿园') {
                teacherNewValue.push({
                    label: teacherValue[index].name,
                    value: teacherValue[index].stage,
                    disabled: !isKindergarten,
                });
            } else {
                teacherNewValue.push({
                    label: teacherValue[index].name,
                    value: teacherValue[index].stage,
                    disabled: !isNoKindergarten,
                });
            }
        }
        let orgStage = [];
        for (let index = 0; index < teacherValue.length; index++) {
            orgStage.push({
                label: teacherValue[index].name,
                value: teacherValue[index].stage,
            });
        }
        const footer = (
            <>
                {isTrue ? (
                    <a
                        className={styles.downloadBtn}
                        onClick={() =>
                            this.downloadExcel(
                                semesterValue,
                                downLoadSection,
                                studentRadioValue,
                                newGrade
                            )
                        }
                        // href={
                        //     semesterValue
                        //         ? `/api/payTuition/getStudentTuitionExcel?studentStage=${downLoadSection}&studentType=${studentRadioValue}&studentGrade=${newGrade}&semesterId=${semesterValue}`
                        //         : `/api/payTuition/getStudentTuitionExcel?studentStage=${downLoadSection}&studentType=${studentRadioValue}&studentGrade=${newGrade}`
                        // }
                        // target="_blank"
                    >
                        {trans('student.download', '下载')}
                    </a>
                ) : (
                    <div className={styles.sectionBtn}>
                        <Button style={{ width: '64px' }} onClick={this.handleCancel}>
                            {trans('charge.cancel', '取消')}
                        </Button>
                        <Button
                            type="primary"
                            style={{ width: '90px' }}
                            loading={loading}
                            onClick={this.okBtn}
                        >
                            {trans('charge.confirm', '确认')}
                        </Button>
                    </div>
                )}
            </>
        );
        // console.log(gradeValues[2].value.split('-')[0], 'gradeValues');
        return (
            <Modal
                title={
                    isTrue
                        ? trans('charge.download_student', '下载学费信息')
                        : trans('charge.addPayNotice', '创建学费缴费通知')
                }
                visible={downloadListVisible}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={this.handleCancel}
                footer={footer}
                className={styles.downloadModal}
            >
                <div className={styles.secTionRadio}>
                    <span>
                        <span style={{ color: 'red' }}>*</span>
                        {isTrue ? '收费学段：' : trans('charge.student_type', '学生类型：')}
                    </span>
                    <div>
                        <Checkbox.Group
                            options={isTrue ? orgStage : tuiTionType}
                            onChange={this.onChange}
                            studentType={studentType}
                        />
                    </div>
                </div>
                <div className={styles.studentRadio}>
                    <span>
                        <span style={{ color: 'red' }}>*</span>
                        {isTrue ? '学生类型：' : trans('charge.stage', '学段：')}
                    </span>
                    <div>
                        {isTrue ? (
                            <Checkbox.Group
                                value={allStudent}
                                options={allStudentOption}
                                onChange={this.onchangeAllStudent}
                            ></Checkbox.Group>
                        ) : null}

                        <Checkbox.Group
                            value={studentRadioValue}
                            options={isTrue ? studentOptions : teacherNewValue}
                            onChange={this.onChangeStudent}
                        />
                    </div>
                </div>
                {!isTrue && studentRadioValue.length > 0 ? (
                    <div className={styles.gradeRadio}>
                        <span className={styles.grade}>{trans('charge.grade', '年级:')}</span>
                        <div className={styles.gradeCheck}>
                            <Checkbox.Group
                                value={arrayValue1}
                                options={gradeCheckValues}
                                onChange={this.onChangeGrade}
                            />
                        </div>
                    </div>
                ) : null}
                {isTrue && downLoadSection.length > 0 ? (
                    <div className={styles.gradeRadio}>
                        <span className={styles.grade}>{trans('charge.grade', '年级:')}</span>
                        <div className={styles.gradeCheck}>
                            <Checkbox.Group
                                value={arrayValue}
                                options={gradeCheckValues}
                                onChange={this.onChangeGrade}
                            />
                        </div>
                    </div>
                ) : null}
                {!isTrue && (
                    <div className={styles.gradeRadio}>
                        <span className={styles.grade} style={{ lineHeight: '34px' }}>
                            <span style={{ color: 'red' }}>*</span>收费学期：
                        </span>
                        <div className={styles.gradeCheck}>
                            <Select
                                value={semesterValue}
                                onChange={this.changeSemester}
                                placeholder="请选择学期"
                                style={{ width: '168px', height: '36px' }}
                            >
                                {planningSemesterInfo &&
                                    planningSemesterInfo.length > 0 &&
                                    planningSemesterInfo.map((item, index) => {
                                        return (
                                            <Option
                                                value={item.id}
                                                key={`${item.schoolYearName}${item.name}`}
                                            >
                                                {locale() != 'en' ? (
                                                    <span>
                                                        {item.schoolYearName} {item.name}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {item.schoolYearEname} {item.ename}
                                                    </span>
                                                )}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                    </div>
                )}

                {isTrue && (
                    <div className={styles.studentRadio}>
                        <span>
                            <span style={{ color: 'red' }}>*</span>是否导出学费账单：
                        </span>
                        <div>
                            <Radio.Group onChange={this.changeExportType} value={exportFlag}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                )}

                {isTrue && exportFlag == 1 && (
                    <div className={styles.gradeRadio}>
                        <span className={styles.grade} style={{ lineHeight: '34px' }}>
                            <span style={{ color: 'red' }}>*</span>收费学期：
                        </span>
                        <div className={styles.gradeCheck}>
                            <Select
                                value={semesterValue}
                                onChange={this.changeSemester}
                                placeholder="请选择学期"
                                style={{ width: '168px', height: '36px' }}
                            >
                                {planningSemesterInfo &&
                                    planningSemesterInfo.length > 0 &&
                                    planningSemesterInfo.map((item, index) => {
                                        return (
                                            <Option
                                                value={item.id}
                                                key={`${item.schoolYearName}${item.name}`}
                                            >
                                                {locale() != 'en' ? (
                                                    <span>
                                                        {item.schoolYearName} {item.name}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {item.schoolYearEname} {item.ename}
                                                    </span>
                                                )}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                    </div>
                )}
            </Modal>
        );
    }
}
