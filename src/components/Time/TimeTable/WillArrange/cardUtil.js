//编辑课程-课程卡片
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, TreeSelect, Select, InputNumber, Modal } from 'antd';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import styles from './cardUtil.less';
import icon from '../../../../icon.less';
import { trans, locale } from '../../../../utils/i18n';

import { FormOutlined, PlusOutlined } from '@ant-design/icons';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const confirm = Modal.confirm;

@connect((state) => ({
    changeWeekTeachingPlanGroup: state.timeTable.changeWeekTeachingPlanGroup,
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化
}))
export default class CardUtil extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addNum: 0,
            inputId: '',
            newWeekLessons: '',
            isAdd: false,
            studentGroupValue: [],
            necessaryTeacherVisible: false,
            assistTeacherVisible: false,
            exchangeModalVisible: false,
            selectTeacherIndex: '',
            frequencyWeekly: '',
            frequencyWeeklyValue: '',
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }
    //格式化教师数据格式
    formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length == 0) return [];
        let teacherArr = [];
        teacherList &&
            teacherList.length > 0 &&
            teacherList.map((el) => {
                let obj = {
                    key: el.teacherId,
                    value: el.teacherId,
                    // title: el.name + ' ' + el.englishName,
                    title:
                        el.englishName && el.englishName != el.name
                            ? `${el.name}-${el.englishName}`
                            : `${el.name}`,
                };
                teacherArr.push(obj);
            });
        return teacherArr;
    };

    //回显选中教师value
    showTeacherValue = (teacherValue) => {
        if (!teacherValue || teacherValue.length == 0) return [];
        let teacherArr = [];
        teacherValue.map((el) => {
            teacherArr.push(el.id);
        });
        return teacherArr;
    };

    //选择主教老师
    changeMaster(index, fatherKey, value) {
        //暂存修改
        let payloadObj = {
            fatherKey: fatherKey,
            mainTeacherInfoList: this.getSelectedDetail(value),
            groupIndex: index,
            editItem: 'mainTeacherInfoList',
        };
        this.saveUserChange(payloadObj);
    }

    //改变单双周
    changeWeek(index, fatherKey, value) {
        let payloadObj = {
            fatherKey: fatherKey,
            singleOrNot: value,
            groupIndex: index,
            editItem: 'singleOrNot',
        };
        this.saveUserChange(payloadObj);
    }

    //选择辅教老师
    changeAssist(index, fatherKey, value) {
        //暂存修改
        let payloadObj = {
            fatherKey: fatherKey,
            assistTeacherInfoList: this.getSelectedDetail(value),
            groupIndex: index,
            editItem: 'assistTeacherInfoList',
        };
        this.saveUserChange(payloadObj);
    }

    //修改连排次数
    changeWeekLesson(weekLessons, index, fatherKey, id, arrangedNum, addNum, value) {
        //暂存修改
        //weekLesson = 需排 + 已排
        let lesson = id == '' ? value : Number(weekLessons || 0) + Number(value || 0);
        this.setState({
            newWeekLessons: lesson,
        });
        let payloadObj = {
            fatherKey: fatherKey,
            newWeekLessons: lesson,
            groupIndex: index,
            editItem: 'weekLessons',
            minValue: value,
        };
        this.saveUserChange(payloadObj);
    }
    //    //修改连排次数
    //    changeWeekLesson(index, fatherKey, id, arrangedNum, value) {
    //     //暂存修改
    //     //weekLesson = 需排 + 已排
    //     let lesson = id == "" ? value : Number(arrangedNum || 0) + Number(value || 0)
    //     let payloadObj = {
    //         fatherKey: fatherKey,
    //         weekLessons: lesson,
    //         groupIndex: index,
    //         editItem: 'weekLessons'
    //     }
    //     this.saveUserChange(payloadObj);
    // }

    changeUnitDuration(index, fatherKey, value) {
        //暂存修改
        let payloadObj = {
            fatherKey: fatherKey,
            unitDuration: value,
            groupIndex: index,
            editItem: 'unitDuration',
        };
        this.saveUserChange(payloadObj);
    }

    chaneOnceLesson(index, fatherKey, value) {
        //暂存修改
        let payloadObj = {
            fatherKey: fatherKey,
            onceLessons: value,
            groupIndex: index,
            editItem: 'onceLessons',
        };
        this.saveUserChange(payloadObj);
    }

    //存取用户的修改
    saveUserChange(detail) {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/saveUserChange',
            payload: detail,
        });
    }

    //获取选择老师的详情
    getSelectedDetail = (arr) => {
        const { teacherList } = this.props;
        let teacherArr = [];
        teacherList.map((item) => {
            arr.map((el) => {
                if (item.teacherId == el) {
                    let obj = {};
                    obj.id = item.teacherId;
                    obj.name = item.name;
                    obj.ename = item.englishName;
                    teacherArr.push(obj);
                }
            });
        });
        return teacherArr;
    };

    //添加行
    addRow(item, index) {
        const { dispatch } = this.props;
        console.log('item', item);
        this.setState({
            isAdd: true,
        });
        let copyResult = JSON.parse(JSON.stringify(item));
        copyResult.id = '';
        copyResult.arrangedNum = 0;
        copyResult.weekLessons = 1;
        copyResult.onceLessons = 1;
        copyResult.unitDuration, console.log('copyResult', copyResult);
        dispatch({
            type: 'timeTable/addPlanningRow',
            payload: {
                rowDetail: copyResult,
                effictiveIndex: index,
            },
        });
    }

    //删除行
    deleteRow(item, index, fatherKey) {
        const { dispatch } = this.props;
        let self = this;
        if (item.id == '') {
            //自己添加的计划删除
            dispatch({
                type: 'timeTable/deleteOwnPlanningRow',
                payload: {
                    fatherKey: fatherKey,
                    groupIndex: index,
                },
            });
        } else {
            confirm({
                title: '您确定要删除吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    dispatch({
                        type: 'timeTable/deletePlanningRow',
                        payload: {
                            id: item.id,
                        },
                        onSuccess: () => {
                            const {
                                findWeekCoursePlanning,
                                selectId,
                                selectCourseName,
                                selectIndex,
                                selectCourse,
                                selectGrade,
                                fetchWillArrangeList,
                                fetchCourseList,
                                showTable,
                            } = self.props;
                            typeof findWeekCoursePlanning == 'function' &&
                                findWeekCoursePlanning.call(self);
                            //调用待排课程卡片列表
                            typeof fetchWillArrangeList == 'function' &&
                                fetchWillArrangeList(selectId, selectCourseName, selectIndex);
                            //左侧待排课程
                            let course = selectCourse ? selectCourse : '',
                                grade = selectGrade ? selectGrade : '';
                            typeof fetchCourseList == 'function' && fetchCourseList();
                            //刷新课程表
                            typeof showTable == 'function' && showTable.call(this, '删除周计划');
                        },
                    });
                },
                onCancel() {},
            });
        }
    }
    newHandle = () => {};

    //处理子级班
    formatClassData = (classList, val) => {
        const { copyCard } = this.state;
        let group = [];
        copyCard &&
            copyCard.studentGroupList &&
            copyCard.studentGroupList.map((item, index) => {
                group.push(item.id);
            });
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        let isDisabled = false;
        classList.map((item, index) => {
            group.map((el) => {
                if (el == item.id) isDisabled = true;
            });
            let obj = {};
            obj.title = item.name;
            obj.key = item.id;
            obj.id = item.id;
            obj.disabled = isDisabled;
            obj.type = item.type;
            obj.ename = item.ename;

            obj.value = val == 'groupList' ? item.id + '*' + item.type : item.id;
            classGroup.push(obj);
        });
        return classGroup;
    };

    // 通用change
    handleChange = (value) => {
        console.log('value :>> ', value);
        this.setState({
            studentGroupValue: value,
        });
    };

    renderTagPlaceholder = (omittedValues) => {
        let len = omittedValues && omittedValues.length;
        return <em className={styles.omittedStyle}>+ {len}</em>;
    };

    modalConfirm = () => {
        const _that = this;
        Modal.confirm({
            content: '确定要换课嘛',
            okText: '确认',
            onOk() {
                const { dispatch, courseItemDetail, versionId, selectId } = _that.props;
                const { studentGroupValue } = _that.state;
                dispatch({
                    type: 'timeTable/changeWeekTeachingPlanGroup',
                    payload: {
                        courseId: selectId,
                        versionId,
                        oldStudentGroupIdList: courseItemDetail.studentGroupList.map(
                            (item) => item.id
                        ),
                        newStudentGroupIdList: studentGroupValue,
                    },
                }).then(() => {
                    _that.setState({
                        exchangeModalVisible: false,
                        studentGroupValue: [],
                    });
                    const {
                        findWeekCoursePlanning,
                        selectId,
                        selectCourseName,
                        selectIndex,
                        fetchWillArrangeList,
                        fetchCourseList,
                    } = _that.props;
                    typeof findWeekCoursePlanning == 'function' &&
                        findWeekCoursePlanning.call(_that);
                    //调用待排课程卡片列表
                    typeof fetchWillArrangeList == 'function' &&
                        fetchWillArrangeList(selectId, selectCourseName, selectIndex);
                    typeof fetchCourseList == 'function' && fetchCourseList();
                });
            },
        });
    };

    handleEdit = () => {
        const { courseItemDetail } = this.props;
        this.setState({
            exchangeModalVisible: true,
            studentGroupValue: courseItemDetail.studentGroupList?.map((item) => Number(item.id)),
        });
    };

    changeNecessaryTeacherVisible = (visible) => {
        this.setState({
            necessaryTeacherVisible: visible ?? false,
        });
    };

    changeAssistTeacherVisible = (visible) => {
        this.setState({
            assistTeacherVisible: visible ?? false,
        });
    };

    //选人组件回显value
    selectTeacherValue = (teacherValue) => {
        if (!teacherValue || teacherValue.length == 0) return [];
        let teacherArr = [];
        teacherValue.map((el) => {
            teacherArr.push({
                id: el.id,
                name: el.name,
                englishName: el.ename,
            });
        });
        return teacherArr;
    };

    searchTeacherConfirm = (ids, index, fatherKey, selectRole) => {
        if (selectRole === 'necessaryTeacher') {
            this.changeMaster(index, fatherKey, ids);
            this.changeNecessaryTeacherVisible(false);
        } else if (selectRole === 'assistantTeacher') {
            this.changeAssist(index, fatherKey, ids);
            this.changeAssistTeacherVisible(false);
        }
    };

    clickPlus = (index, selectRole) => {
        if (selectRole === 'necessaryTeacher') {
            this.changeNecessaryTeacherVisible(true);
        } else if (selectRole === 'assistantTeacher') {
            this.changeAssistTeacherVisible(true);
        }
        this.setState({
            selectTeacherIndex: index,
        });
    };

    render() {
        const {
            addNum,
            isAdd,
            studentGroupValue,
            necessaryTeacherVisible,
            assistTeacherVisible,
            selectTeacherIndex,
            frequencyWeeklyValue,
        } = this.state;
        const { teacherList, fatherKey, courseItemDetail, gradeByTypeArr } = this.props;
        const mainTreePropsStyle = {
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            style: {
                width: 135,
            },
        };
        const assistTreePropsStyle = {
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            style: {
                width: 165,
                height: 33,
            },
        };

        const treeProps = {
            style: {
                width: 150,
                marginRight: 8,
                verticalAlign: 'top',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeCheckable: true,
        };

        const studentGroupProps = {
            treeData: gradeByTypeArr,
            value: studentGroupValue,
            placeholder: trans('course.plan.class', '全部班级'),
            onChange: this.handleChange,
            maxTagCount: 2,
            filterTreeNode: (inputValue, treeNode) => {
                if (
                    treeNode &&
                    treeNode.props &&
                    treeNode.props.title &&
                    treeNode.props.title.indexOf(inputValue) > -1
                ) {
                    return true;
                } else {
                    return false;
                }
                // return true;
            },
            maxTagPlaceholder: (omittedValues) => this.renderTagPlaceholder(omittedValues),
            ...treeProps,
        };

        const { exchangeModalVisible } = this.state;
        console.log('first', courseItemDetail.weekCoursePlanningOutputModelList);

        return (
            <div className={styles.globalCardUtil}>
                <div className={styles.wrapper}>
                    <div className={styles.courseName}>
                        <p style={{ marginBottom: '0', marginTop: '0' }}>
                            {courseItemDetail &&
                                courseItemDetail.studentGroupList &&
                                courseItemDetail.studentGroupList.length > 0 &&
                                courseItemDetail.studentGroupList.map((item, index) => {
                                    return (
                                        <span key={item.id} className={styles.groupName}>
                                            {item.name}
                                        </span>
                                    );
                                })}
                            <FormOutlined onClick={this.handleEdit} />
                            {
                                <Modal
                                    visible={exchangeModalVisible}
                                    title="调换课"
                                    onOk={this.modalConfirm}
                                    onCancel={() => this.setState({ exchangeModalVisible: false })}
                                >
                                    <span title={trans('course.plan.enter.search', '请回车查询')}>
                                        <TreeSelect {...studentGroupProps} />
                                    </span>
                                </Modal>
                            }
                        </p>
                    </div>
                    <div className={styles.setPlanTable}>
                        {courseItemDetail &&
                            courseItemDetail.weekCoursePlanningOutputModelList &&
                            courseItemDetail.weekCoursePlanningOutputModelList.length > 0 &&
                            courseItemDetail.weekCoursePlanningOutputModelList.map(
                                (item, index) => {
                                    console.log('item', item);
                                    return (
                                        <Row className={styles.rowStyle} key={item.id}>
                                            <Col span={3}>
                                                <PlusOutlined
                                                    onClick={() =>
                                                        this.clickPlus(index, 'necessaryTeacher')
                                                    }
                                                    style={{ marginLeft: '5px' }}
                                                />
                                                <TreeSelect
                                                    treeData={this.formatTeacherList(teacherList)}
                                                    value={this.showTeacherValue(
                                                        item.mainTeacherInfoList
                                                    )}
                                                    placeholder="主教老师"
                                                    onChange={this.changeMaster.bind(
                                                        this,
                                                        index,
                                                        fatherKey
                                                    )}
                                                    className={styles.treeSelectStyle}
                                                    {...mainTreePropsStyle}
                                                />
                                                {necessaryTeacherVisible &&
                                                    selectTeacherIndex === index && (
                                                        <SearchTeacher
                                                            modalVisible={necessaryTeacherVisible}
                                                            cancel={
                                                                this.changeNecessaryTeacherVisible
                                                            }
                                                            language={'zh_CN'}
                                                            confirm={(ids) =>
                                                                this.searchTeacherConfirm(
                                                                    ids,
                                                                    index,
                                                                    fatherKey,
                                                                    'necessaryTeacher'
                                                                )
                                                            }
                                                            selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                                                            selectedList={this.selectTeacherValue(
                                                                item.mainTeacherInfoList
                                                            )}
                                                        />
                                                    )}
                                            </Col>
                                            <Col span={4}>
                                                <PlusOutlined
                                                    onClick={() =>
                                                        this.clickPlus(index, 'assistantTeacher')
                                                    }
                                                />
                                                <TreeSelect
                                                    treeData={this.formatTeacherList(teacherList)}
                                                    value={this.showTeacherValue(
                                                        item.assistTeacherInfoList
                                                    )}
                                                    placeholder="辅教老师"
                                                    onChange={this.changeAssist.bind(
                                                        this,
                                                        index,
                                                        fatherKey
                                                    )}
                                                    className={styles.treeSelectStyle}
                                                    {...assistTreePropsStyle}
                                                />
                                                {assistTeacherVisible &&
                                                    selectTeacherIndex === index && (
                                                        <SearchTeacher
                                                            modalVisible={assistTeacherVisible}
                                                            cancel={this.changeAssistTeacherVisible}
                                                            language={'zh_CN'}
                                                            confirm={(ids) =>
                                                                this.searchTeacherConfirm(
                                                                    ids,
                                                                    index,
                                                                    fatherKey,
                                                                    'assistantTeacher'
                                                                )
                                                            }
                                                            selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                                                            selectedList={this.selectTeacherValue(
                                                                item.assistTeacherInfoList
                                                            )}
                                                        />
                                                    )}
                                            </Col>
                                            <Col span={8}>
                                                {/* <span>
                                            {item.frequency == 0
                                                ? '每周'
                                                : item.frequency == 1
                                                ? '单周'
                                                : '双周'}
                                        </span> */}
                                                <span>
                                                    <Select
                                                        value={item.frequency}
                                                        className={styles.eachWeek}
                                                        // defaultValue={item.frequency}
                                                        // defaultValue={0}
                                                        onChange={this.changeWeek.bind(
                                                            this,
                                                            index,
                                                            fatherKey
                                                        )}
                                                    >
                                                        <Option value={0}>
                                                            {trans('global.weekly', '每周')}
                                                        </Option>
                                                        <Option value={1}>
                                                            {trans('global.weekly.one', '单周')}
                                                        </Option>
                                                        <Option value={2}>
                                                            {trans('global.weekly.two', '双周')}
                                                        </Option>
                                                    </Select>
                                                </span>
                                                <span className={styles.everytime}>每次</span>
                                                <InputNumber
                                                    value={item.onceLessons}
                                                    min={1}
                                                    style={{ width: 60 }}
                                                    onChange={this.chaneOnceLesson.bind(
                                                        this,
                                                        index,
                                                        fatherKey
                                                    )}
                                                    disabled={item.id == '' ? false : true}
                                                />
                                                <span className={styles.numberText}>节/次</span>
                                                <span className={styles.everytime}>每节</span>
                                                <InputNumber
                                                    value={item.unitDuration}
                                                    style={{ width: 60 }}
                                                    min={1}
                                                    onChange={this.changeUnitDuration.bind(
                                                        this,
                                                        index,
                                                        fatherKey
                                                    )}
                                                    disabled={item.id == '' ? false : true}
                                                />
                                                <span className={styles.numberText}>min</span>
                                                <span></span>
                                            </Col>
                                            <Col span={6}>
                                                <span className={styles.arrangeHas}>
                                                    已排
                                                    <span className={styles.num}>
                                                        {item.arrangedNum}
                                                    </span>
                                                    次
                                                </span>
                                                <span className={styles.arrangeHas}>
                                                    待排
                                                    <span className={styles.num}>
                                                        {/* {isAdd ? 0 : item.weekLessons - item.arrangedNum} */}
                                                        {item.weekLessons - item.arrangedNum}
                                                        {/* {item.weekLessons} */}
                                                    </span>
                                                    次
                                                </span>
                                                <span className={styles.arrangeHas}>新增</span>
                                                <InputNumber
                                                    min={item.minValue || 0}
                                                    value={
                                                        item.minValue
                                                            ? item.minValue
                                                            : item.id
                                                            ? 0
                                                            : 1
                                                    }
                                                    // defaultValue={0}
                                                    step={1}
                                                    style={{ width: 65 }}
                                                    onChange={this.changeWeekLesson.bind(
                                                        this,
                                                        item.weekLessons,
                                                        index,
                                                        fatherKey,
                                                        item.id,
                                                        item.arrangedNum,
                                                        addNum
                                                    )}
                                                />
                                                <span className={styles.numberText}>次</span>
                                            </Col>
                                            <Col span={2}>
                                                <div>
                                                    <i
                                                        className={
                                                            icon.iconfont + ' ' + styles.addRow
                                                        }
                                                        onClick={this.addRow.bind(
                                                            this,
                                                            item,
                                                            fatherKey
                                                        )}
                                                    >
                                                        &#xe759;
                                                    </i>
                                                    <i
                                                        className={
                                                            icon.iconfont + ' ' + styles.deleteRow
                                                        }
                                                        onClick={this.deleteRow.bind(
                                                            this,
                                                            item,
                                                            index,
                                                            fatherKey
                                                        )}
                                                    >
                                                        &#xe739;
                                                    </i>
                                                </div>
                                            </Col>
                                        </Row>
                                    );
                                }
                            )}
                    </div>
                </div>
            </div>
        );
    }
}
