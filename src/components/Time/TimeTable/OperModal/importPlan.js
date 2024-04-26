//导入课时计划
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Select, Input, Checkbox, Row, Col, message, Popconfirm, Button } from 'antd';
import { intersection } from 'lodash';
import { trans } from '../../../../utils/i18n';
const { Option } = Select;

@connect((state) => ({
    subjectList: state.course.subjectList,
    courseList: state.course.courseList,
    gradeListByVersion: state.timeTable.gradeListByVersion,
    importCourseList: state.timeTable.importCourseList,
}))
export default class importPlan extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            gradeValue: undefined,
            subjectValue: undefined,
            courseValue: undefined,
            selected: false,
            checkedList: [],
            disabledChecked: [],
            newCheckedList: [],
            isEditing: false,
            courseIdList: [],
            finalSelect: [],
            existedCourseList: [],
        };
    }

    componentDidMount() {
        this.getSubject();
        this.getCourse('');
    }

    componentDidMount() {
        this.fetchCourse();
        this.getGrade();
    }

    handleOk = () => {
        const {
            dispatch,
            currentVersion,
            getshowAcCourseList,
            fetchScheduleList,
            fetchWillArrangeList,
            fetchCourseList,
        } = this.props;
        const { checkedList, disabledChecked, finalSelect } = this.state;
        console.log('this.state :>> ', this.state);
        let courseIdList = checkedList.concat(disabledChecked);
        if (finalSelect.length === 0) {
            message.info('请选择您需要导入课时计划的课程');
            return false;
        } else {
            dispatch({
                type: 'timeTable/confirmImport',
                payload: {
                    courseIds: finalSelect,
                    weekVersionId: currentVersion,
                },
                onSuccess: () => {
                    this.handleCancel();
                    this.setState({
                        gradeValue: undefined,
                        subjectValue: undefined,
                        courseValue: undefined,
                        selected: false,
                        checkedList: [],
                        disabledChecked: [],
                        newCheckedList: [],
                        finalSelect: [],
                    });
                    typeof getshowAcCourseList == 'function' &&
                        getshowAcCourseList.call(this, true);
                    typeof fetchScheduleList == 'function' && fetchScheduleList.call(this);
                },
            });
        }
    };

    handleDelete = () => {
        const { dispatch, currentVersion, getshowAcCourseList, fetchScheduleList } = this.props;
        const { checkedList, disabledChecked, finalSelect } = this.state;
        console.log('finalSelect :>> ', finalSelect);
        let courseIdList = checkedList.concat(disabledChecked);

        console.log('this.state :>> ', this.state);
        if (finalSelect.length === 0) {
            message.info('请选择您需要删除的课程');
            return false;
        } else {
            dispatch({
                type: 'timeTable/deleteCoursePlanning',
                payload: {
                    // courseIdList: checkedList.concat(disabledChecked),
                    courseIdList: finalSelect,
                    versionId: currentVersion,
                },
                onSuccess: () => {
                    this.handleCancel();
                    this.setState({
                        gradeValue: undefined,
                        subjectValue: undefined,
                        courseValue: undefined,
                        selected: false,
                        checkedList: [],
                        disabledChecked: [],
                        newCheckedList: [],
                        finalSelect: [],
                    });
                    typeof getshowAcCourseList == 'function' &&
                        getshowAcCourseList.call(this, true);
                    typeof fetchScheduleList == 'function' && fetchScheduleList.call(this);
                },
            });
        }
    };

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal('importPlan');
        this.setState({
            gradeValue: undefined,
            subjectValue: undefined,
            courseValue: undefined,
            selected: false,
            checkedList: [],
            disabledChecked: [],
            newCheckedList: [],
            finalSelect: [],
        });
    };

    //获取科目
    getSubject = () => {
        const { dispatch } = this.props;
        if (typeof courseIndex_subjectList !== 'undefined') {
            dispatch({
                type: 'course/getCourseIndexSubjectList',
                payload: courseIndex_subjectList,
            });
        } else {
            dispatch({
                type: 'course/getSubjectList',
                payload: {},
            });
        }
    };

    //获取课程
    getCourse = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCourseList',
            payload: {
                subjectId: id,
            },
        });
    };

    //获取版本内年级
    getGrade = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/fetchGradeListBySubject',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //选择年级
    changeGrade = (value) => {
        this.setState(
            {
                gradeValue: value,
                checkedList: [],
                disabledChecked: [],
                newCheckedList: [],
                selected: false,
            },
            () => {
                this.fetchCourse();
            }
        );
    };

    //选择科目
    changeSubject = (value) => {
        this.setState(
            {
                subjectValue: value,
                courseValue: undefined,
                checkedList: [],
                disabledChecked: [],
                newCheckedList: [],
                selected: false,
            },
            () => {
                this.getCourse(value);
                this.fetchCourse();
            }
        );
    };

    //选择课程
    changeCourse = (value) => {
        this.setState(
            {
                courseValue: value,
                checkedList: [],
                disabledChecked: [],
                newCheckedList: [],
                selected: false,
            },
            () => {
                this.fetchCourse();
            }
        );
    };

    //查询导入的课程
    fetchCourse = () => {
        const { dispatch, currentVersion } = this.props;
        const { subjectValue, gradeValue, courseValue } = this.state;
        dispatch({
            type: 'timeTable/searchImportCourse',
            payload: {
                subjectId: subjectValue ? subjectValue : '',
                teachingOrgId: gradeValue ? gradeValue : '',
                courseIds: courseValue ? [courseValue] : [],
                weekVersionId: currentVersion,
            },
        }).then(() => {
            const { importCourseList } = this.props;
            let checkedArr = [];
            importCourseList &&
                importCourseList.length > 0 &&
                importCourseList.map((item, index) => {
                    if (item.choose) {
                        checkedArr.push(item.id);
                    }
                });
            this.setState({
                disabledChecked: checkedArr,
                existedCourseList: checkedArr,
            });
        });
    };

    //获取全部课程的id数组
    getCourseIdArr = () => {
        const { importCourseList } = this.props;
        let idList = [];
        importCourseList.map((item, index) => {
            idList.push(item.id);
        });
        return idList;
    };

    //勾选课程
    checkCourse = (value, option) => {
        console.log('this.state :>> ', this.state);
        let idList = this.getCourseIdArr();
        let currentCheck = value;
        const { disabledChecked } = this.state;
        const newArr = [];
        const newDisableArr = [];
        for (let i = 0; i < currentCheck.length; i++) {
            if (!disabledChecked.includes(currentCheck[i])) {
                newArr.push(currentCheck[i]);
            } else {
                newDisableArr.push(currentCheck[i]);
            }
        }
        this.setState({
            finalSelect: value,
            isEditing: true,
            checkedList: newArr,
            disabledChecked: newDisableArr,
            newCheckedList: newArr,
            selected: newArr.length === idList.length - disabledChecked.length,
        });
    };

    //全选
    selectAll = (e) => {
        const { disabledChecked } = this.state;
        let idList = this.getCourseIdArr();
        let operIdlist = idList;
        for (let i = 0; i < operIdlist.length; i++) {
            for (let j = 0; j < disabledChecked.length; j++) {
                if (operIdlist[i] == disabledChecked[j]) {
                    operIdlist.splice(i, 1);
                }
            }
        }
        this.setState({
            finalSelect: e.target.checked ? idList.concat(disabledChecked) : [],
            selected: e.target.checked,
            checkedList: e.target.checked ? idList : [],
            newCheckedList: e.target.checked ? operIdlist : [],
        });
    };

    render() {
        const { importPlanModal, gradeListByVersion, subjectList, courseList, importCourseList } =
            this.props;
        const {
            selected,
            gradeValue,
            courseValue,
            subjectValue,
            isEditing,
            checkedList, //总和
            disabledChecked, //不可选的
            newCheckedList, //用户操作的
            finalSelect,
            existedCourseList,
        } = this.state;
        let selectedLength = newCheckedList.length;
        let disableLength = disabledChecked.length;
        let valueList = JSON.parse(JSON.stringify(checkedList));
        let hasExistedCourseNum = intersection(existedCourseList, finalSelect).length;
        return (
            <Modal
                visible={importPlanModal}
                title="导入基础课时计划"
                onCancel={this.handleCancel}
                footer={null}
                width="750px"
                destroyOnClose={false}
                className={styles.importCoursePlan}
            >
                <div className={styles.importPlanPage}>
                    {selectedLength + disableLength == 0 ? (
                        <p className={styles.importTips}>请选择您需要导入课时计划的课程</p>
                    ) : (
                        <p className={styles.importTips}>已选择：{finalSelect.length}个课程</p>
                    )}

                    <div className={styles.searchCondition}>
                        <Select
                            placeholder="全部科目"
                            allowClear={true}
                            style={{ width: 120, marginRight: 8 }}
                            onChange={this.changeSubject}
                            value={subjectValue}
                        >
                            {subjectList &&
                                subjectList.length > 0 &&
                                subjectList.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Select
                            placeholder="全部年级"
                            allowClear={true}
                            value={gradeValue}
                            style={{ width: 120, marginRight: 8 }}
                            onChange={this.changeGrade}
                        >
                            {gradeListByVersion &&
                                gradeListByVersion.length > 0 &&
                                gradeListByVersion.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={index}>
                                            {item.orgName}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Select
                            placeholder={trans('global.searchCourses', '搜索课程')}
                            style={{ width: 250 }}
                            showSearch
                            value={courseValue}
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={this.changeCourse}
                        >
                            {courseList &&
                                courseList.length > 0 &&
                                courseList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                    <div className={styles.showCourseOption}>
                        {importCourseList && importCourseList.length > 0 ? (
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                defaultValue={[]}
                                onChange={this.checkCourse}
                                value={this.state.finalSelect}
                            >
                                <div>
                                    {importCourseList &&
                                        importCourseList.length > 0 &&
                                        importCourseList.map((item, index) => {
                                            return (
                                                <div key={item.id} className={styles.courseMargin}>
                                                    <Checkbox value={item.id}>
                                                        <em className={styles.courseName}>
                                                            {item.name}{' '}
                                                            {item.choose ? '(已存在)' : ''}
                                                        </em>
                                                    </Checkbox>
                                                </div>
                                            );
                                        })}
                                </div>
                            </Checkbox.Group>
                        ) : (
                            <span className={styles.noData}>暂无课程</span>
                        )}
                    </div>
                    <div className={styles.operButtonList}>
                        <Button
                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                            onClick={this.handleCancel}
                        >
                            取消
                        </Button>
                        <Popconfirm
                            title={`是否确认删除已选择的 ${finalSelect.length} 个课程的全部待排及已排课节`}
                            onConfirm={this.handleDelete}
                            okText="是"
                            cancelText="否"
                        >
                            <Button className={styles.modalBtn + ' ' + styles.submitBtn}>
                                删除
                            </Button>
                        </Popconfirm>
                        {hasExistedCourseNum ? (
                            <Popconfirm
                                title={`您选择了 ${finalSelect.length} 个课程，其中 ${hasExistedCourseNum} 个在当前课表已存在，重复导入将会删除已存在课程的排课结果并重新导入，是否确认继续？`}
                                onConfirm={this.handleOk}
                                okText="是"
                                cancelText="否"
                                overlayStyle={{ width: 400 }}
                            >
                                <Button
                                    type="primary"
                                    className={styles.modalBtn + ' ' + styles.submitBtn}
                                >
                                    导入
                                </Button>
                            </Popconfirm>
                        ) : (
                            <Button
                                type="primary"
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={this.handleOk}
                            >
                                导入
                            </Button>
                        )}
                    </div>
                    <p className={styles.selectAll}>
                        <Checkbox checked={selected} onChange={this.selectAll}>
                            {trans('global.choiceAll', '全选')}
                        </Checkbox>
                    </p>
                </div>
            </Modal>
        );
    }
}
