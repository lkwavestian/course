//搜索课程组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Checkbox, Input, TreeSelect } from 'antd';
import icon from '../../../../icon.less';
import { Button } from 'antd';
import { remove, isEqual } from 'lodash';
import { trans, locale } from '../../../../utils/i18n';

const { Search } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@connect((state) => ({
    classGroupList: state.rules.classGroupList,
    allTeacherList: state.rules.allTeacherList,
    courseAllList: state.rules.courseAllList,
    courseAcList: state.rules.courseAcList,
    allAcList: state.rules.firstAcList,
    oneRuleInformation: state.rules.oneRuleInformation,
    acRuleFilterParamInputModelList: state.rules.acRuleFilterParamInputModelList,
}))
export default class SearchCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            teacherValue: '', // 选择老师
            classValue: '', // 选择班级
            selectCourseId: '', // 选中课程id
            courseName: trans('course.plan.allcourse', '全部课程'), // 选择课程的名字
            checkedList: [], //选中的AC
            setSelected: {},
            showSearchMain: false,

            saveCheckObj: [], //处理选中的checkbox,目的：为了取消勾选项

            selectLesson: 1,
            selectLessonLabel: '全部课节',
            selectClassLabel: trans('course.plan.class', '全部班级'),
            selectTeacherLabel: trans('global.All Teachers', '全部教师'),

            courseIdList: [],
        };
    }

    componentDidMount() {
        this.getAllTeacherList();
        this.getClassGroupList();
        this.getCourseAllList('');
        this.getCourseAcList().then(() => {
            const { dispatch, courseAcList } = this.props;
            //存取全部课程条件下的AC列表
            dispatch({
                type: 'rules/saveFirstAcList',
                payload: {
                    firstAcList: courseAcList,
                },
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.menuKey != this.props.menuKey) {
            //切换菜单操作
            if (nextProps.menuKey == nextProps.selfId) {
                this.getAllTeacherList();
                this.getClassGroupList();
                this.getCourseAllList('');
                this.getCourseAcList().then(() => {
                    const { dispatch, courseAcList } = this.props;
                    //存取全部课程条件下的AC列表
                    dispatch({
                        type: 'rules/saveFirstAcList',
                        payload: {
                            firstAcList: courseAcList,
                        },
                    });
                });
                this.setState({
                    checkedList: [],
                    setSelected: {},
                    saveCheckObj: [],
                    classValue: '',
                    teacherValue: '',
                });
            }
        }
        if (nextProps.isClearChecked != this.props.isClearChecked) {
            //清空选中项
            if (nextProps.isClearChecked) {
                this.setState({
                    checkedList: [],
                    setSelected: {},
                    saveCheckObj: [],
                    classValue: '',
                    teacherValue: '',
                });
            }
        }

        /*  if (
            JSON.stringify(nextProps.showEditCheckedIds) !=
            JSON.stringify(this.props.showEditCheckedIds)
        ) {
            if (nextProps.showEditCheckedIds.length > 0) {
                //统计编辑
                this.handleCheckAllSubject(nextProps.showEditCheckedIds, true);
            }
        } */
    }

    // 根据课程获取AC列表
    getCourseAcList = () => {
        const { dispatch, currentVersion } = this.props;
        const { teacherValue, classValue, selectCourseId } = this.state;
        return dispatch({
            type: 'rules/courseAcList',
            payload: {
                versionId: currentVersion,
                courseIdList: selectCourseId ? [selectCourseId] : [],
                studentGroupIdList: classValue ? [String(classValue)] : [],
                teacherIdList: teacherValue ? [String(teacherValue)] : [],
            },
        });
    };

    //获取班级
    getClassGroupList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/classGroupList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //获取所有课程
    getCourseAllList(keyWord) {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/courseAllList',
            payload: {
                versionId: currentVersion,
                courseName: keyWord,
            },
        }).then(() => {
            if (!keyWord) {
                const { courseAllList } = this.props;
                this.setState({
                    courseIdList: courseAllList.map((item) => item.id),
                });
            }
        });
    }

    //搜索老师回调
    searchTeacherValue = (value, Option) => {
        this.setState(
            {
                teacherValue: value,
                selectTeacherLabel: value
                    ? Option.props.children
                    : trans('global.All Teachers', '全部教师'),
            },
            () => {
                this.getCourseAcList();
            }
        );
    };

    // 搜索班级的回调
    searchClassValue = (value, label) => {
        this.setState(
            {
                classValue: value,
                selectClassLabel: value ? label : trans('course.plan.class', '全部班级'),
            },
            () => {
                this.getCourseAcList();
            }
        );
    };

    // 获取教师
    getAllTeacherList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/allTeacherList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //处理全选的checkboxgroup - [{id: 1, name: 数学, value: [1], activityId: 1}]
    handleCheckAllSubject = (arr, checked) => {
        const { courseAcList, statisticsChecked, getCheckedIds } = this.props;
        courseAcList &&
            courseAcList.length > 0 &&
            courseAcList.map((item, index) => {
                item.activityModelList &&
                    item.activityModelList.length > 0 &&
                    item.activityModelList.map((list) => {
                        arr.map((el) => {
                            if (el == list.activityId) {
                                let obj = {
                                    id: list.courseId,
                                    name: this.getCourseName(list.courseId),
                                    value: checked ? [el] : [],
                                    activityId: el,
                                };
                                typeof statisticsChecked == 'function' &&
                                    statisticsChecked(obj).then(() => {
                                        typeof getCheckedIds == 'function' &&
                                            this.setState({
                                                checkedList: getCheckedIds(),
                                            });
                                    });
                            }
                        });
                    });
            });
    };

    //处理单独勾选项--
    //选中{id: 1, name: 语文, value: [1]}
    //取消{id: 1, name: 语文, value: []}
    handleCheckbox = (e) => {
        const { courseAcList } = this.props;
        let targetValue = e.target.value;
        let isChecked = e.target.checked;
        let obj = {};
        courseAcList &&
            courseAcList.length > 0 &&
            courseAcList.map((item, index) => {
                item.activityModelList &&
                    item.activityModelList.length > 0 &&
                    item.activityModelList.map((list) => {
                        if (targetValue == list.activityId) {
                            (obj.id = list.courseId),
                                (obj.name = this.getCourseName(list.courseId));
                            obj.value = isChecked ? [targetValue] : [];
                            obj.activityId = targetValue;
                        }
                    });
            });
        return obj;
    };

    //获取所选课程的名称
    getCourseName = (id) => {
        const { courseAllList } = this.props;
        let name = '';
        courseAllList &&
            courseAllList.length > 0 &&
            courseAllList.map((el) => {
                if (el.id == id) {
                    name = locale() !== 'en' ? el.name : el.englishName;
                }
            });
        return name;
    };

    //选择AC
    changeAcCourse = (checkedList) => {
        console.log('checkedList', checkedList);
        this.setState({
            checkedList,
        });
    };

    //处理单个勾选框
    changeCheckbox = (e, planLessonNumber, activityName) => {
        const {
            statisticsChecked,
            getCheckedIds,
            courseAllList,
            allTeacherList,
            dispatch,
            acRuleFilterParamInputModelList,
        } = this.props;

        const { teacherValue, selectCourseId, classValue, selectLesson, courseIdList } = this.state;

        let ifCheck = e.target.checked;
        let selectId = e.target.value;
        // debugger;

        //选中状态
        if (ifCheck) {
            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: [
                    ...acRuleFilterParamInputModelList,
                    {
                        teacherIdList: teacherValue ? [teacherValue] : [],
                        courseIdList:
                            selectCourseId === 'all' || selectCourseId === ''
                                ? []
                                : [selectCourseId],
                        groupIdList: classValue ? [classValue] : [],
                        acIdList: [selectId],
                        acChooseType: selectLesson,
                        acPlanLessonNumberList: [planLessonNumber],
                        acShowList: [activityName],
                    },
                ],
            });
        } else {
            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: remove(
                    acRuleFilterParamInputModelList,
                    (item) => !item.acIdList.includes(selectId)
                ),
            });
        }
    };

    //获取全部AC的id数组
    getCourseIdArr = () => {
        const { courseAcList } = this.props;
        let idList = [];
        if (!courseAcList || courseAcList.length <= 0) return;
        courseAcList.map((item, index) => {
            return item.activityModelList.map((item, index) => {
                idList.push(item.activityId);
            });
        });
        return idList;
    };

    //判断当前删除的是哪个科目的id
    judgeIdFromSubject = (id) => {
        let subjectId = '';
        let saveCheckObj = JSON.parse(JSON.stringify(this.state.saveCheckObj));
        saveCheckObj &&
            saveCheckObj.length > 0 &&
            saveCheckObj.map((item) => {
                item.value &&
                    item.value.length > 0 &&
                    item.value.map((el, order) => {
                        if (el == id) {
                            item.value.splice(order, 1);
                            subjectId = item.id;
                        }
                    });
            });
        this.setState({
            saveCheckObj: saveCheckObj,
        });
        return subjectId;
    };

    //选择课程
    selectCourse(id, name) {
        // console.log('name', name);
        let setSelectedArr = {};
        setSelectedArr[id] = true;
        this.setState(
            {
                courseName: name,
                setSelected: setSelectedArr,
                selectCourseId: id === 'all' ? '' : id,
            },
            () => {
                //查询列表
                this.getCourseAcList();
            }
        );
    }

    showDropdown = () => {
        this.setState(
            {
                showSearchMain: !this.state.showSearchMain,
                setSelected: {},
                selectCourseId: '',
                teacherValue: '', // 老师
                classValue: '', // 班级
                selectLesson: 1,
                courseName: trans('course.plan.allcourse', '全部课程'),
                selectLessonLabel: '全部课节',
                selectClassLabel: trans('course.plan.class', '全部班级'),
                selectTeacherLabel: trans('global.All Teachers', '全部教师'),
            },
            () => {
                const { showSearchMain } = this.state;
                if (showSearchMain) {
                    this.getCourseAcList().then(() => {
                        const { dispatch, courseAcList } = this.props;
                        //存取全部课程条件下的AC列表
                        dispatch({
                            type: 'rules/saveFirstAcList',
                            payload: {
                                firstAcList: courseAcList,
                            },
                        });
                    });
                }
            }
        );
    };

    hideDropdown = () => {
        this.setState(
            {
                showSearchMain: false,
                setSelected: {},
                selectCourseId: '',
                teacherValue: '', // 老师
                classValue: '', // 班级
                selectLesson: 1,
                courseName: trans('course.plan.allcourse', '全部课程'),
                selectLessonLabel: trans('global.All Lessons', '全部课节'),
                selectClassLabel: trans('course.plan.class', '全部班级'),
                selectTeacherLabel: trans('global.All Teachers', '全部教师'),
            }
            /* () => {
                this.getCourseAcList().then(() => {
                    const { dispatch, courseAcList } = this.props;
                    //存取全部课程条件下的AC列表
                    dispatch({
                        type: 'rules/saveFirstAcList',
                        payload: {
                            firstAcList: courseAcList,
                        },
                    });
                });
            } */
        );
    };

    //搜索课程
    searchCourse = (value) => {
        this.getCourseAllList(value);
        //清空课程选中项
        this.setState({
            setSelected: {},
        });
    };

    // 处理班级信息
    processInformation = (classGroupList) => {
        const datevalue = [];
        if (!classGroupList || classGroupList.length <= 0) return;
        classGroupList &&
            classGroupList.length > 0 &&
            classGroupList.map((item, index) => {
                const itemObj = {
                    title: item.name + ' ' + item.englishName,
                    key: item.gradeId,
                    value: item.gradeId,
                    // disabled: true,
                };
                itemObj.children = item.studentGroupList.map((item, index) => {
                    const newChildren = {
                        title: locale() !== 'en' ? item.name : item.ename,
                        key: item.id,
                        value: item.id,
                    };
                    return newChildren;
                });
                return datevalue.push(itemObj);
            });
        return datevalue;
    };

    changeSelectLesson = (selectLesson) => {
        console.log('selectLesson :>> ', selectLesson);
        this.setState({
            selectLesson: selectLesson.key,
            selectLessonLabel: selectLesson.label,
        });
    };

    //筛选确认函数
    confirmSearchCourse = () => {
        const {
            dispatch,
            courseAcList,
            changeCheckedIds,
            courseAllList,
            allTeacherList,
            acRuleFilterParamInputModelList,
        } = this.props;
        const {
            selectLesson,
            courseName,
            selectClassLabel,
            selectTeacherLabel,
            selectLessonLabel,
            teacherValue,
            selectCourseId,
            classValue,
            courseIdList,
        } = this.state;
        if (selectLesson !== 4) {
            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: [
                    ...acRuleFilterParamInputModelList,
                    {
                        teacherIdList: teacherValue ? [teacherValue] : [],
                        courseIdList:
                            selectCourseId === 'all' || selectCourseId === ''
                                ? []
                                : [selectCourseId],
                        groupIdList: classValue ? [classValue] : [],
                        acIdList: this.getItemFromActivityList('activityId'),
                        acChooseType: selectLesson,
                        acPlanLessonNumberList: this.getItemFromActivityList('planLessonNumber'),
                        acShowList: [
                            courseName +
                                '-' +
                                selectClassLabel +
                                '-' +
                                selectTeacherLabel +
                                '-' +
                                selectLessonLabel,
                        ],
                    },
                ],
            }).then(() => {
                this.hideDropdown();
            });
        } else {
            this.hideDropdown();
        }
    };

    //渲染所选课节
    renderSelectCourseList = () => {
        const {
            allAcList,
            acRuleFilterParamInputModelList,
            oneRuleInformation: { deletedACIdList },
        } = this.props;
        const { checkedList, selectLesson } = this.state;
        if (acRuleFilterParamInputModelList?.length > 0) {
            return (
                <div>
                    {acRuleFilterParamInputModelList.map((item) => {
                        return (
                            <span
                                style={
                                    deletedACIdList?.includes(item.acIdList[0])
                                        ? {
                                              backgroundColor: 'rgb(251, 232, 232)',
                                          }
                                        : {}
                                }
                            >
                                {item.acShowList}
                                <i
                                    className={icon.iconfont}
                                    onClick={(e) =>
                                        this.deleteCheckList(
                                            item.acShowList,
                                            item.acChooseType,
                                            item.acIdList,
                                            e
                                        )
                                    }
                                >
                                    &#xe6ca;
                                </i>
                                {deletedACIdList?.includes(item.acIdList[0]) && (
                                    <span
                                        style={{
                                            backgroundColor: 'rgb(251, 232, 232)',
                                            padding: '0',
                                            margin: ' 0 0 0 0',
                                        }}
                                    >
                                        （已删除）
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            );
        } else {
            return (
                <p className={styles.searchPlaceholder}>
                    {trans('global.Search or select courses', '搜索或选择课程')}
                </p>
            );
        }
    };

    getItemFromActivityList = (type) => {
        const { courseAcList } = this.props;
        let res = [];
        courseAcList.forEach((item) => {
            item.activityModelList.forEach((ele) => {
                res.push(ele[type]);
            });
        });
        return res;
    };

    //全部、连堂课等删除标签
    deleteCheckList = (acShowList, acChooseType, acIdList, e) => {
        e.stopPropagation();
        const { dispatch, acRuleFilterParamInputModelList } = this.props;
        const { checkedList } = this.state;

        //如果是指定课节
        //删除acRuleFilterParamInputModelList中item.acIdList === acIdList的元素
        if (acChooseType === 4) {
            this.setState({
                checkedList: remove(checkedList, (id) => !acIdList.includes(id)),
            });

            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: remove(
                    acRuleFilterParamInputModelList,
                    (item) => !isEqual(item.acIdList, acIdList)
                ),
            });
        } else {
            //非指定课节
            //根据acShowList来判断
            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: remove(
                    acRuleFilterParamInputModelList,
                    (item) => !isEqual(item.acShowList, acShowList)
                ),
            });
        }
    };

    render() {
        const {
            classGroupList,
            courseAllList,
            allTeacherList,
            courseAcList,
            allAcList,
            acRuleFilterParamInputModelList,
        } = this.props;
        const { checkedList, setSelected, showSearchMain, selectCourseId, selectLesson } =
            this.state;
        const classCourseProps = {
            treeData: this.processInformation(classGroupList),
            placeholder: trans('course.plan.class', '全部班级'),
            onChange: this.searchClassValue,
            style: {
                width: 102,
            },
            dropdownStyle: {
                maxHeight: 300,
                overflow: 'auto',
            },
            allowClear: true,
            showSearch: true,
            treeDefaultExpandAll: true,
            filterTreeNode: (inputValue, treeNode) => {
                console.log('inputValue', inputValue);
                console.log('treeNode', treeNode);
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
            },
        };

        let selectAcIdList = acRuleFilterParamInputModelList.map((item) => item.acIdList[0]);
        return (
            <div className={styles.searchCourseMain}>
                <div className={styles.searchResult} onClick={this.showDropdown}>
                    {this.renderSelectCourseList()}
                </div>
                {showSearchMain && (
                    <div onClick={this.hideDropdown} className={styles.maskContainer}></div>
                )}
                {showSearchMain && (
                    <div className={styles.searchContainer}>
                        <div className={styles.searchCourse}>
                            <Search
                                placeholder={trans('global.searchCourses', '搜索课程')}
                                onSearch={this.searchCourse}
                                style={{ width: 100 }}
                                className={styles.searchSelect}
                            />
                            <div className={styles.courseList}>
                                <p
                                    onClick={this.selectCourse.bind(this, 'all', '全部课程')}
                                    className={
                                        setSelected['all'] ? styles.courseBlue : styles.courseWhite
                                    }
                                >
                                    {trans('course.plan.allcourse', '全部课程')}
                                </p>
                                {courseAllList &&
                                    courseAllList.length > 0 &&
                                    courseAllList.map((item, order) => {
                                        // console.log('item1111', item);
                                        return (
                                            <p
                                                key={item.id}
                                                className={
                                                    setSelected[item.id]
                                                        ? styles.courseBlue
                                                        : styles.courseWhite
                                                }
                                                value={item.id}
                                                onClick={this.selectCourse.bind(
                                                    this,
                                                    item.id,
                                                    item.name
                                                )}
                                            >
                                                {locale() !== 'en' ? item.name : item.englishName}
                                            </p>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className={styles.dividerLine}></div>
                        <div className={styles.searchClass}>
                            <div className={styles.searchClassCondition}>
                                <TreeSelect {...classCourseProps} />
                                <Select
                                    style={{ width: '102px', marginLeft: '5px' }}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    onChange={this.searchTeacherValue}
                                    placeholder={trans('global.All Teachers', '全部教师')}
                                >
                                    {allTeacherList &&
                                        allTeacherList.length > 0 &&
                                        allTeacherList.map((item, index) => {
                                            return (
                                                <Option key={item.teacherId} value={item.teacherId}>
                                                    {`${item.name == null ? '' : item.name}` +
                                                        '  ' +
                                                        `${
                                                            item.englishName == null
                                                                ? ''
                                                                : item.englishName
                                                        }`}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Select
                                    placeholder={trans('global.All Lessons', '全部课节')}
                                    // defaultValue={{ key: '0', label: '全部课节' }}
                                    onChange={this.changeSelectLesson}
                                    style={{ width: '108px', marginLeft: '5px' }}
                                    labelInValue={true}
                                >
                                    <Option value={1}>
                                        {trans('global.All Lessons', '全部课节')}
                                    </Option>
                                    <Option value={2}>
                                        {trans('global.All single lessons', '全部单堂课节')}
                                    </Option>
                                    <Option value={3}>
                                        {trans('global.All consecutive lessons', '全部连堂课节')}
                                    </Option>
                                    <Option value={4}>
                                        {trans('global.designated period', '指定课节')}
                                    </Option>
                                </Select>
                            </div>
                            <div className={styles.searchCourseList}>
                                <div>
                                    {courseAcList && courseAcList.length > 0 ? (
                                        selectLesson === 4 ? (
                                            <CheckboxGroup
                                                onChange={this.changeAcCourse}
                                                value={selectAcIdList}
                                            >
                                                {courseAcList &&
                                                    courseAcList.length > 0 &&
                                                    courseAcList.map((item, index) => {
                                                        return (
                                                            item.activityModelList &&
                                                            item.activityModelList.length > 0 &&
                                                            item.activityModelList.map(
                                                                (el, order) => {
                                                                    return (
                                                                        <p
                                                                            className={
                                                                                styles.checkUtil
                                                                            }
                                                                            key={order}
                                                                        >
                                                                            <Checkbox
                                                                                onChange={(e) =>
                                                                                    this.changeCheckbox(
                                                                                        e,
                                                                                        el.planLessonNumber,
                                                                                        el.activityName
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    el.activityId
                                                                                }
                                                                                key={new Date().getTime()}
                                                                            >
                                                                                {el.activityName}
                                                                            </Checkbox>
                                                                        </p>
                                                                    );
                                                                }
                                                            )
                                                        );
                                                    })}
                                            </CheckboxGroup>
                                        ) : (
                                            <div>
                                                {courseAcList &&
                                                    courseAcList.length > 0 &&
                                                    courseAcList.map((item, index) => {
                                                        return (
                                                            item.activityModelList &&
                                                            item.activityModelList.length > 0 &&
                                                            item.activityModelList.map(
                                                                (el, order) => {
                                                                    return (
                                                                        <p
                                                                            className={
                                                                                styles.checkUtil
                                                                            }
                                                                            key={order}
                                                                        >
                                                                            {el.activityName}
                                                                        </p>
                                                                    );
                                                                }
                                                            )
                                                        );
                                                    })}
                                            </div>
                                        )
                                    ) : (
                                        <p className={styles.noDataSource}>暂无数据</p>
                                    )}
                                </div>
                            </div>
                            <div className={styles.bottomList}>
                                <div
                                    className={styles.promptText}
                                    style={{
                                        visibility: selectLesson === 4 ? 'visible' : 'hidden',
                                    }}
                                >
                                    {trans(
                                        'global.promptTextTitle',
                                        '若所勾选的课节被删除或重新导入课程，需要重新编辑确认包含这些课节的规则'
                                    )}
                                </div>
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="round"
                                    width={30}
                                    style={{}}
                                    className={styles.searchCourseConfirmBtn}
                                    onClick={this.confirmSearchCourse}
                                >
                                    {trans('global.confirm', '确定')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
