//错开上规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { trans, locale } from '../../../../../utils/i18n';
import styles from './rules.less';
import {
    Tabs,
    Input,
    TreeSelect,
    message,
    Select,
    Tooltip,
    Icon,
    Table,
    Button,
    Modal,
    Spin,
    Upload,
    Form,
} from 'antd';
import { debounce } from '../../../../../utils/utils';
import CommonList from './common/commonList';
import { getIdValueArr } from '../../../../../utils/utils';
import lodash from 'lodash';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

@connect((state) => ({
    gradeList: state.time.gradeList,
    ruleListOfTypes: state.rules.ruleListOfTypes,
    courseAllList: state.rules.courseAllList, //版本下的课程
    staggerStatisticsChecked: state.rules.staggerStatisticsChecked,
    editRuleInformation: state.rules.oneRuleInformation,
    grades: state.rules.grades,
    subjects: state.rules.subjects,
    ruleImport: state.rules.ruleImport,
    classTypeListInfo: state.rules.classTypeListInfo,
    allAddress: state.course.allAddress,
    subjectList: state.course.subjectList,
}))
export default class SiteRules extends PureComponent {
    constructor(props) {
        super(props);
        this.lastFetchNameId = 0;
        this.state = {
            activeKey: '',
            controllerFormList: {},
            showConditionList: false,
            weightPercent: '100',
            remark: '',
            selectCourse: [], //选择课程
            checkedIds: [], //用户选中的id
            isClearChecked: false,
            confirmEditBtn: false, //确认修改按钮的显隐
            editListId: '',
            searchCourseValue: undefined, //课程查询条件
            grade: [], //筛选班级条件之一
            gradeType: [], //筛选班级条件之二
            courseName: '', //筛选班级条件之三
            subject: [], //筛选学科条件之一
            subGrade: [], //筛选学科条件之二
            course: '', //筛选学科条件之三
            batchSetVisible: false,
            importRuleVisible: false,
            fileList: [],
            isUploading: false,
            appointSite: [],
            selectedGroup: [],
            newSites: [], //设置班级场地
            newCourseSites: [], //设置课程场地
            batchType: 1,
            importType: 1,
            filterVisible: false,
            subjectVisible: false,
            grades: [],
            subjects: [],
            fetching: false,
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.getAddress();
        this.getClassTypeList();
        this.filterGrade();
        this.setState(
            {
                activeKey: this.props.activeTabKey && this.props.activeTabKey.toString(),
            },
            () => {
                let controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[this.state.activeKey] = true;
                this.setState({
                    controllerFormList,
                });

                /* if (this.state.activeKey == 3) {
                    this.getCourseAllList();
                } */
            }
        );
        //非指定元素，隐藏显示
        document.addEventListener('click', this.hideCondition);
    }

    //获取班级类型
    getClassTypeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/classTypeList',
            payload: {},
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey != this.props.activeKey) {
            if (nextProps.activeKey == nextProps.selfId) {
                this.setState(
                    {
                        activeKey: nextProps.activeTabKey && nextProps.activeTabKey.toString(),
                    },
                    () => {
                        let controllerFormList = Object.assign({}, this.state.controllerFormList);
                        controllerFormList[this.state.activeKey] = true;
                        this.setState({
                            controllerFormList: controllerFormList,
                        });
                        this.clearAll();
                        // this.getCourseAllList();
                    }
                );
            }
        }
    }

    //清空
    clearAll = () => {
        this.setState(
            {
                checkedIds: [],
                showConditionList: false,
                weightPercent: '100',
                remark: '',
                isClearChecked: true, //清空子组件的checked
                selectCourse: [],
                confirmEditBtn: false,
                searchCourseValue: undefined,
            },
            () => {
                //删除props存储的数据
                const { dispatch } = this.props;
                dispatch({
                    type: 'rules/staggerStatistics',
                    payload: {
                        clearStatistics: 'all',
                    },
                });
                this.setState({
                    isClearChecked: false,
                });
            }
        );
    };

    //课节下拉
    getCourseList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/getCourseList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //场地下拉
    getSiteList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/getSiteList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //获取错开上课程
    getCourseAllList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/courseAllList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //格式化课程
    formatCourseData = () => {
        const { courseAllList } = this.props;
        if (!courseAllList || courseAllList.length <= 0) return [];
        let courseData = [];
        courseAllList.map((item) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                key: item.id,
                value: item.id,
            };
            courseData.push(obj);
        });
        return courseData;
    };

    //选择课程
    changeCourse = (value) => {
        const { dispatch, currentVersion } = this.props;
        if (value.length == 0) {
            this.setState({
                selectCourse: [],
            });
            return false;
        }
        //校验课程是否同作息--根据课程查询作息id
        dispatch({
            type: 'rules/courseAcquisition',
            payload: {
                versionId: currentVersion,
                courseIdList: value,
            },
            onSuccess: () => {
                this.setState({
                    selectCourse: value,
                });
            },
        });
    };

    //切换tabs
    changeTabs = (activeKey) => {
        if (activeKey == 7) {
            this.filterSubject();
            this.setState({
                grade: [],
                gradeType: [],
                courseName: '',
            });
        } else if (activeKey == 8) {
            this.filterGrade();
            this.setState({
                subGrade: [],
                subject: [],
                course: '',
            });
        } else if (activeKey == 3) {
            this.getSiteList();
            this.getCourseList();
        }
        this.clearAll();
        this.setState(
            {
                activeKey: activeKey,
                controllerFormList: {},
            },
            () => {
                const controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[activeKey] = true;
                this.setState({
                    controllerFormList: controllerFormList,
                });
                if (activeKey == 3) {
                    this.getStaggerList(this.state.activeKey);
                }
            }
        );
    };

    //获取错开上规则列表
    getStaggerList(activeKey) {
        const { dispatch, currentVersion, selfId } = this.props;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                ruleType: selfId,
                ruleObject: activeKey,
            },
        });
    }

    //选择必须满足&&尽量满足的条件
    showSelectCondition = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showConditionList: true,
        });
    };

    //隐藏必选满足&&尽量满足条件列表
    hideCondition = () => {
        this.setState({
            showConditionList: false,
        });
    };

    //选择权重
    selectWeightPercent = (value) => {
        this.setState({
            weightPercent: value,
        });
    };

    //填写备注
    fillInRemark = (e) => {
        if (e.target.value && e.target.value.length > 50) {
            message.info('备注不能太长哦~');
            return false;
        }
        this.setState({
            remark: e.target.value,
        });
    };

    //格式化标题--课程
    formatCourseTitle = () => {
        let courseData = this.formatCourseData();
        const { selectCourse } = this.state;
        let courseTitle = '';
        courseData.map((el) => {
            selectCourse &&
                selectCourse.length > 0 &&
                selectCourse.map((item) => {
                    if (item == el.value) {
                        courseTitle += el.title + ', ';
                    }
                });
        });
        return courseTitle ? courseTitle + '错开上课' : '';
    };

    //格式化标题--课节
    formatLessonTitle = () => {
        const { staggerStatisticsChecked } = this.props;
        let staggerCheckedList = getIdValueArr(staggerStatisticsChecked);
        let courseTitle = '';
        staggerCheckedList &&
            staggerCheckedList.length > 0 &&
            staggerCheckedList.map((el) => {
                let length = el.value.length;
                let classLesson = length > 0 ? el.name + '-' + length + ', ' : '';
                courseTitle += classLesson;
            });
        return courseTitle ? courseTitle + '错开上课' : '';
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId } = this.props;
        const { activeKey, remark, weightPercent, checkedIds, selectCourse } = this.state;
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        let ruleParameter = {
            ifIsconsecutive: true,
            minDay: null,
            remark: remark, //备注
            weightPercentage: weightPercent, //权重
        };
        let utilObj = {};
        if (activeKey == 3) {
            //必填校验
            if (selectCourse.length == 0) {
                message.info('请完善信息再保存');
                return false;
            }
            //课程字段
            utilObj.courseIds = selectCourse; //课程id集合
            utilObj.title = this.formatCourseTitle();
        } else if (activeKey == 4) {
            //必填校验
            if (checkedIds.length == 0) {
                message.info('请完善信息再保存');
                return false;
            }
            if (checkedIds.length <= 1) {
                message.info('请选择多个课节~');
                return false;
            }
            //课节字段
            utilObj.activityIds = checkedIds; //AC列表id
            utilObj.title = this.formatLessonTitle();
        }

        let editObj = {};
        if (id) {
            editObj.id = id;
        }
        dispatch({
            type: dispatchType,
            payload: {
                ...editObj,
                baseRuleId: selfId,
                ruleParameter: JSON.stringify(ruleParameter),
                versionId: currentVersion,
                remark: remark,
                scheduleId: null,
                weightPercentage: Number(weightPercent),
                ...utilObj,
            },
            onSuccess: () => {
                const { getAddRules, getRuleCount } = this.props;
                this.clearAll();
                //错开上规则列表
                this.getStaggerList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                //清空子组件的checked归为初始状态
                if (activeKey == 4) {
                    this.setState({
                        isClearChecked: false,
                    });
                }
            },
        });
    };

    //统用户选择的id
    getCheckedIds = (arr) => {
        const { staggerStatisticsChecked } = this.props;
        let checkedIds = [];
        staggerStatisticsChecked &&
            staggerStatisticsChecked.length > 0 &&
            staggerStatisticsChecked.map((el) => {
                el.value &&
                    el.value.map((item) => {
                        checkedIds.push(item);
                    });
            });
        this.setState({
            checkedIds: checkedIds,
        });
        return checkedIds;
    };

    //取消，清空form表单
    handleCancel = (id) => {
        this.clearAll();
    };

    //统计用户添加的课程和AC列表
    statisticsChecked = (checkedUtil) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'rules/staggerStatistics',
            payload: {
                checkedUtil: checkedUtil,
            },
        });
    };

    //编辑之前删除props中存取的值
    clearBeforeEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/staggerStatistics',
            payload: {
                clearStatistics: 'all',
            },
        });
    };

    //编辑规则
    editSitesRules = (id) => {
        this.clearBeforeEdit();
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            const { editRuleInformation } = this.props;
            const { activeKey } = this.state;
            if (activeKey == 3) {
                //课节回显
                this.setState({
                    checkedIds: editRuleInformation && editRuleInformation.activityIds,
                });
            }
            this.setState({
                remark: editRuleInformation && editRuleInformation.remark,
                weightPercent:
                    editRuleInformation && editRuleInformation.weightPercentage.toString(),
                confirmEditBtn: true,
                editListId: id, //列表中的id
            });
        });
    };

    changeCourse = (key) => {
        this.setState(
            {
                courseName: key,
            },
            () => {
                this.filterGrade();
            }
        );
    };

    changeCurriculum = (key) => {
        this.setState(
            {
                course: key,
            },
            () => {
                this.filterSubject();
            }
        );
    };

    fetchRelate = (val) => {
        this.lastFetchNameId += 1;
        const fetchId = this.lastFetchNameId;
        this.setState({ siteList: [], fetching: true });
        let { dispatch } = this.props;
        dispatch({
            type: 'course/allAddress',
            payload: {
                name: val,
            },
        }).then(() => {
            // 请求时序控制
            if (fetchId !== this.lastFetchNameId) {
                // for fetch callback order
                return;
            }
            //返回的搜索的场地
            let { allAddress } = this.props;
            if (allAddress) {
                this.setState({ allAddress, fetching: false });
            }
        });
    };

    clearRelate = () => {
        this.lastFetchNameId += 1;
        const fetchId = this.lastFetchNameId;
        this.setState({ siteList: [], fetching: true });
        let { dispatch } = this.props;
        dispatch({
            type: 'course/allAddress',
            payload: {
                name: '',
            },
        }).then(() => {
            // 请求时序控制
            if (fetchId !== this.lastFetchNameId) {
                // for fetch callback order
                return;
            }
            //返回的搜索的场地
            let { allAddress } = this.props;
            if (allAddress) {
                this.setState({ allAddress, fetching: false });
            }
        });
    };

    updateClassSites = (value) => {
        const { dispatch, semesterValue } = this.props;
        const { newSites } = this.state;
        dispatch({
            type: 'rules/saveSites',
            payload: {
                semesterId: semesterValue,
                addressRuleSaveDTOList: [
                    {
                        ruleId: value.ruleId ? value.ruleId : undefined,
                        objectId: value.classId,
                        objectType: 1,
                        addressIdList: newSites,
                    },
                ],
            },
        }).then(() => {
            this.filterGrade();
            this.clearRelate();
            this.setState({
                filterVisible: false,
            });
        });
        this.setState({
            filterVisible: true,
        });
    };

    updateCourseSites = (value) => {
        const { dispatch, semesterValue } = this.props;
        const { newCourseSites } = this.state;
        dispatch({
            type: 'rules/saveSites',
            payload: {
                semesterId: semesterValue,
                addressRuleSaveDTOList: [
                    {
                        ruleId: value.ruleId ? value.ruleId : undefined,
                        objectId: value.courseId,
                        objectType: 2,
                        addressIdList: newCourseSites,
                    },
                ],
            },
        }).then(() => {
            this.filterSubject();
            this.clearRelate();
            this.setState({
                subjectVisible: false,
            });
        });
        this.setState({
            subjectVisible: true,
        });
    };

    changeGrade = (key) => {
        console.log('key', key);
        this.setState(
            {
                grade: key == 'null' ? [] : [Number(key)],
            },
            () => {
                this.filterGrade();
            }
        );
    };

    changeSubject = (key) => {
        this.setState(
            {
                subject: key == 'null' ? [] : [Number(key)],
            },
            () => {
                this.filterSubject();
            }
        );
    };

    changeType = (key) => {
        this.setState(
            {
                gradeType: key == 'null' ? [] : [Number(key)],
            },
            () => {
                this.filterGrade();
            }
        );
    };
    changeClass = (key) => {
        this.setState(
            {
                subGrade: key == 'null' ? [] : [Number(key)],
            },
            () => {
                this.filterSubject();
            }
        );
    };

    filterSubject = () => {
        const { dispatch, semesterValue } = this.props;
        const { subject, subGrade, course } = this.state;
        dispatch({
            type: 'rules/filterSubject',
            payload: {
                semesterId: semesterValue,
                gradeIdList: subGrade,
                subjectIdList: subject,
                keyWords: course,
            },
        }).then(() => {
            const { subjects } = this.props;
            this.setState(
                {
                    subjects: [],
                    subjectVisible: false,
                },
                () => {
                    this.setState({
                        subjects,
                    });
                }
            );
        });
        this.setState({
            subjectVisible: true,
        });
    };

    getAddress = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/allAddress',
        });
    };

    filterGrade = () => {
        const { dispatch, semesterValue } = this.props;
        const { grade, gradeType, courseName } = this.state;
        dispatch({
            type: 'rules/filterGrade',
            payload: {
                semesterId: semesterValue,
                gradeIdList: grade,
                classTypeList: gradeType,
                keyWords: courseName,
            },
        }).then(() => {
            const { grades } = this.props;
            if (grades && grades.length) {
                grades.map((item, index) => {
                    this[`myRef${index}`] = React.createRef();
                });
            }
            this.setState(
                {
                    grades: [],
                    filterVisible: false,
                },
                () => {
                    this.setState({
                        grades,
                    });
                }
            );
        });
        this.setState({
            filterVisible: true,
        });
    };

    changeAppointSite = (value) => {
        this.setState({
            appointSite: value,
        });
    };

    //Form表单
    renderForm = (item) => {
        const {
            selectCourse,
            showConditionList,
            weightPercent,
            remark,
            confirmEditBtn,
            editListId,
            filterVisible,
            subjectVisible,
            grades,
            subjects,
            fetching,
        } = this.state;

        const { gradeList, classTypeListInfo, allAddress, subjectList } = this.props;
        let gradeNo = [];
        for (let i = 0; i < grades.length; i++) {
            let gradesNo = [];
            for (
                let j = 0;
                grades[i]?.classAddressList && j < grades[i].classAddressList.length;
                j++
            ) {
                gradesNo.push(grades[i].classAddressList[j].id);
            }
            gradeNo.push(gradesNo);
        }

        let subjectNo = [];
        for (let i = 0; i < subjects.length; i++) {
            let subjectsNo = [];
            for (let j = 0; j < subjects[i].courseAddressList.length; j++) {
                subjectsNo.push(subjects[i].courseAddressList[j].id);
            }
            subjectNo.push(subjectsNo);
        }

        const courseProps = {
            treeData: this.formatCourseData(),
            value: selectCourse,
            placeholder: trans('global.Search or select courses', '搜索或选择课程'),
            onChange: this.changeCourse,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 406,
            },
            dropdownStyle: {
                maxHeight: 300,
                overflow: 'auto',
            },
        };
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedGroup: selectedRows,
                });
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const classColumns = [
            {
                title: trans('student.className', '班级'),
                dataIndex: 'className',
                align: 'center',
                width: '120px',
            },
            {
                title: trans('global.Venue course', '场地（课程场地规则全局生效）'),
                dataIndex: 'classAddressList',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Select
                            className={styles.selectSites}
                            style={{ width: '100%' }}
                            mode="multiple"
                            allowClear
                            autoClearSearchValue={true}
                            ref={this[`myRef${index}`]}
                            id={`select${index}`}
                            placeholder={trans('global.pleaseAppointSite', '请选择场地')}
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            defaultValue={gradeNo[index]}
                            // onChange={this.changeSites}
                            onChange={(value, e) => {
                                // this[`myRef${index}`] = React.createRef();
                                // console.log(this[`myRef${index}`], this, '11');
                                this[`myRef${index}`].current.focus();
                                // const dom = document.getElementById(`select${index}`);
                                // console.log(dom);
                                this.setState({
                                    newSites: value,
                                });
                            }}
                            onSearch={debounce(this.fetchRelate)}
                            onBlur={() => this.updateClassSites(record)}
                        >
                            {allAddress &&
                                allAddress.map((item2, index2) => {
                                    return (
                                        <Option key={item2.id} value={item2.id}>
                                            {item2.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
        ];
        const curriculumColumns = [
            {
                title: trans('global.course', '课程'),
                dataIndex: 'courseName',
                align: 'center',
                width: '120px',
            },
            {
                title: trans('global.Venue course', '场地（课程场地规则全局生效）'),
                dataIndex: 'classAddressList',
                align: 'center',
                // width: '250px',
                render: (text, record, index) => {
                    return (
                        <Select
                            className={styles.selectSites}
                            style={{ width: '100%' }}
                            mode="multiple"
                            allowClear
                            ref={this[`myRef${index}`]}
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            placeholder={trans('global.pleaseAppointSite', '请选择场地')}
                            defaultValue={subjectNo[index]}
                            // onChange={this.changeSites}
                            onChange={(value) => {
                                this[`myRef${index}`].current.focus();
                                this.setState({
                                    newCourseSites: value,
                                });
                            }}
                            onSearch={debounce(this.fetchRelate)}
                            onBlur={() => this.updateCourseSites(record)}
                        >
                            {allAddress &&
                                allAddress.map((item2, index2) => {
                                    return (
                                        <Option key={item2.id} value={item2.id}>
                                            {item2.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
        ];
        return (
            <div className={styles.formContent}>
                <div className={styles.searchCourse}>
                    {item.name == '班级' && (
                        <>
                            <div className={styles.selectors}>
                                <Select
                                    placeholder={trans('course.plan.allGrade', '全部年级')}
                                    style={{ width: 130 }}
                                    onChange={this.changeGrade}
                                >
                                    <Option key={null}>
                                        {trans(
                                            'course.setup.newcourse.choose.allGrade',
                                            '选择年级'
                                        )}
                                    </Option>
                                    {gradeList &&
                                        gradeList.map((item, index) => {
                                            return (
                                                <Option key={item.id}>
                                                    {locale() !== 'en'
                                                        ? item.orgName
                                                        : item.orgEname}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Select
                                    placeholder={trans('global.All class types', '全部班级类型')}
                                    style={{ width: 130 }}
                                    onChange={this.changeType}
                                >
                                    <Option key={null}>
                                        {trans('global.choose a different type', '请选择班级类型')}
                                    </Option>
                                    {classTypeListInfo &&
                                        classTypeListInfo.map((item, index) => {
                                            return (
                                                <Option key={item.type}>
                                                    {locale() !== 'en' ? item.name : item.enName}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Search
                                    placeholder={trans('global.searchClasses', '搜索班级')}
                                    onSearch={(value) => this.changeCourse(value)}
                                    style={{ width: 130 }}
                                />
                            </div>
                            <Table
                                className={styles.classInfo}
                                columns={classColumns}
                                dataSource={grades}
                                rowSelection={rowSelection}
                                pagination={false}
                                scroll={{ y: 420 }}
                                bordered="true"
                                loading={filterVisible}
                            ></Table>
                            <p className={styles.setStyle}>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        this.setState({ batchSetVisible: true, batchType: 1 })
                                    }
                                >
                                    {trans('global.courseList.batchSet', '批量设置')}
                                </Button>
                                &nbsp;
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        this.setState({ importRuleVisible: true, importType: 1 })
                                    }
                                >
                                    {trans('global.import rules', '导入规则')}
                                </Button>
                            </p>
                        </>
                    )}
                    {item.name == '课程' && (
                        <>
                            <div className={styles.selectors}>
                                <Select
                                    placeholder={trans('global.all Subjects', '全部学科')}
                                    style={{ width: 130 }}
                                    onChange={this.changeSubject}
                                >
                                    <Option key={null}>
                                        {trans('course.setup.newcourse.choose.subject', '选择学科')}
                                    </Option>
                                    {subjectList &&
                                        subjectList.map((item2, index2) => {
                                            return (
                                                <Option key={item2.id}>
                                                    {locale() !== 'en' ? item2.name : item2.ename}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Select
                                    placeholder={trans('course.plan.allGrade', '全部年级')}
                                    style={{ width: 130 }}
                                    onChange={this.changeClass}
                                >
                                    <Option key={null}>
                                        {trans(
                                            'course.setup.newcourse.choose.allGrade',
                                            '选择年级'
                                        )}
                                    </Option>
                                    {gradeList &&
                                        gradeList.map((item, index) => {
                                            return (
                                                <Option key={item.id}>
                                                    {locale() !== 'en'
                                                        ? item.orgName
                                                        : item.orgEname}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Search
                                    placeholder={trans('global.searchCourses', '搜索课程')}
                                    onSearch={(value) => this.changeCurriculum(value)}
                                    style={{ width: 130 }}
                                />
                            </div>
                            <Table
                                className={styles.classInfo}
                                columns={curriculumColumns}
                                dataSource={subjects}
                                rowSelection={rowSelection}
                                pagination={false}
                                scroll={{ y: 420 }}
                                bordered="true"
                                loading={subjectVisible}
                            ></Table>
                            <p className={styles.setStyle}>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        this.setState({ batchSetVisible: true, batchType: 2 })
                                    }
                                >
                                    {trans('global.courseList.batchSet', '批量设置')}
                                </Button>
                                &nbsp;
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        this.setState({ importRuleVisible: true, importType: 2 })
                                    }
                                >
                                    {trans('global.import rules', '导入规则')}
                                </Button>
                            </p>
                        </>
                    )}
                    {/* {item.name == '课节' && (
                        <>
                            <TreeSelect {...courseProps}></TreeSelect>
                            <TreeSelect {...courseProps}></TreeSelect>
                            <div className={styles.remarkArea}>
                                <Input
                                    placeholder={trans(
                                        'global.no more than',
                                        '备注（选填，50字以内）'
                                    )}
                                    maxLength={50}
                                    className={styles.remarkInput}
                                    onChange={this.fillInRemark}
                                    value={remark}
                                />
                                <div className={styles.conditionList}>
                                    <div className={styles.showResult}>
                                        {weightPercent == '100' ? (
                                            <span
                                                className={
                                                    styles.commonButton + ' ' + styles.necessaryBtn
                                                }
                                                onClick={this.showSelectCondition}
                                            >
                                                {trans('global.Must Satisfy', '必须满足')}
                                            </span>
                                        ) : (
                                            <span
                                                className={
                                                    styles.commonButton +
                                                    ' ' +
                                                    styles.unNecessaryBtn
                                                }
                                                onClick={this.showSelectCondition}
                                            >
                                                {trans('global.Try to Satisfy', '尽量满足')}
                                            </span>
                                        )}
                                    </div>
                                    {showConditionList && (
                                        <div className={styles.showConditionList}>
                                            <span
                                                className={
                                                    styles.commonButton + ' ' + styles.necessaryBtn
                                                }
                                                onClick={this.selectWeightPercent.bind(this, '100')}
                                            >
                                                {trans('global.Must Satisfy', '必须满足')}
                                            </span>
                                            <span
                                                className={
                                                    styles.commonButton +
                                                    ' ' +
                                                    styles.unNecessaryBtn
                                                }
                                                onClick={this.selectWeightPercent.bind(this, '95')}
                                            >
                                                {trans('global.Try to Satisfy', '尽量满足')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.operButton}>
                                <Tooltip title="如果同一节课同时设置了多种规则，则按照课节>课程>班级的优先级取最高优先级为最终适用规则。">
                                    <span>
                                        <Icon type="exclamation-circle" />
                                        {trans('global.Rules Description', '规则说明')}
                                    </span>
                                </Tooltip>
                                <div>
                                    {confirmEditBtn ? (
                                        <span
                                            className={styles.saveBtn}
                                            onClick={this.saveFormInformation.bind(
                                                this,
                                                editListId
                                            )}
                                        >
                                            {trans('global.confirm', '确认')}
                                        </span>
                                    ) : (
                                        <span
                                            className={styles.saveBtn}
                                            onClick={this.saveFormInformation.bind(this, '')}
                                        >
                                            {trans('global.save', '保存')}
                                        </span>
                                    )}
                                    <span
                                        className={styles.cancelBtn}
                                        onClick={this.handleCancel.bind(this, item.id)}
                                    >
                                        {trans('global.cancel', '取消')}
                                    </span>
                                </div>
                            </div>
                        </>
                    )} */}
                </div>
            </div>
        );
    };

    okSet = () => {
        const { dispatch, semesterValue } = this.props;
        const { appointSite, selectedGroup, batchType } = this.state;
        let newAppintSet = [];
        appointSite &&
            appointSite.map((item, index) => {
                newAppintSet.push(Number(item));
            });
        let addressRuleSaveDTOList = [];
        for (let i = 0; i < selectedGroup.length; i++) {
            addressRuleSaveDTOList.push({
                ruleId: selectedGroup[i].ruleId ? selectedGroup[i].ruleId : undefined,
                objectId: selectedGroup[i].classId || selectedGroup[i].courseId,
                objectType: batchType == 1 ? 1 : 2,
                addressIdList: newAppintSet,
            });
        }
        dispatch({
            type: 'rules/saveSites',
            payload: {
                semesterId: semesterValue,
                addressRuleSaveDTOList,
            },
        }).then(() => {
            if (batchType == 1) {
                this.filterGrade();
            } else {
                this.filterSubject();
            }
            this.setState({
                batchSetVisible: false,
                appointSite: [],
            });
        });
    };

    cancelSet = () => {
        this.setState({
            batchSetVisible: false,
            appointSite: [],
        });
    };
    okImport = (e) => {
        const { fileList, importType } = this.state;
        const { semesterValue } = this.props;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('importType', importType);
        formData.append('semesterId', semesterValue);
        if (!lodash.isEmpty(fileList)) {
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'rules/ruleImport',
                payload: formData,
            }).then(() => {
                const { ruleImport } = this.props;

                this.setState({
                    fileList: [],
                    isUploading: false,
                });
                if (!lodash.isEmpty(ruleImport)) {
                    Modal.error({
                        content: !lodash.isEmpty(ruleImport) && ruleImport.toString(),
                    });
                    this.setState({
                        fileList: [],
                        importRuleVisible: false,
                        successModalVisibility: true,
                    });
                } else {
                    message.success(trans('global.scheduleImportSuccess', '导入成功'));
                    // // this.ref.getImportStudentClass();
                    this.setState({
                        fileList: [],
                        importRuleVisible: false,
                        sureImportScore: true,
                    });
                }
            });
        }
    };

    cancelImport = () => {
        this.setState({
            importRuleVisible: false,
            fileList: [],
        });
    };

    render() {
        const { tabs, ruleListOfTypes, allAddress } = this.props;
        const {
            activeKey,
            controllerFormList,
            importRuleVisible,
            batchSetVisible,
            fileList,
            isUploading,
            appointSite,
            selectedGroup,
            fetching,
        } = this.state;
        const uploadProps = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState((state) => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <>
                <div className={styles.staggerRules}>
                    <div>
                        <Tabs tabPosition="top" activeKey={activeKey} onChange={this.changeTabs}>
                            {tabs &&
                                tabs.length > 0 &&
                                tabs.map((item, index) => {
                                    return (
                                        <TabPane
                                            tab={`${item.name}（${item.amount}）`}
                                            key={`${item.id}`}
                                        >
                                            <div className={styles.ruleContainer}>
                                                {item.id != 3 && (
                                                    <div className={styles.ruleTips}>
                                                        <p>
                                                            {trans(
                                                                'global.Rules Description',
                                                                '规则说明'
                                                            )}
                                                            :
                                                            {trans(
                                                                'global.Rules DescriptionContent',
                                                                '如果同一节课同时设置了多种规则，则按照课节&gt;课程&gt;班级的优先级取最高优先级为最终适用规则。'
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                                {controllerFormList[item.id] && (
                                                    <div className={styles.rulesForm}>
                                                        {this.renderForm(item)}
                                                    </div>
                                                )}
                                                {item.id == 3 && (
                                                    <div className={styles.showAddedRules}>
                                                        <div className={styles.searchCondition}>
                                                            <p className={styles.addRulesTitle}>
                                                                {trans(
                                                                    'global.Rules Added',
                                                                    '已添加规则'
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className={styles.staggerRuleList}>
                                                            {ruleListOfTypes &&
                                                                ruleListOfTypes.length > 0 &&
                                                                ruleListOfTypes.map(
                                                                    (item, index) => {
                                                                        return (
                                                                            <CommonList
                                                                                currentKey="siteRules"
                                                                                getStaggerList={
                                                                                    this
                                                                                        .getStaggerList
                                                                                }
                                                                                key={item.id}
                                                                                dataSource={item}
                                                                                editSitesRules={
                                                                                    this
                                                                                        .editSitesRules
                                                                                }
                                                                                currentTabKey={
                                                                                    activeKey
                                                                                }
                                                                                {...this.props}
                                                                            />
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TabPane>
                                    );
                                })}
                        </Tabs>
                    </div>
                </div>
                <Modal
                    visible={batchSetVisible}
                    title={trans('global.batchSetVisibleTitle', '批量设置场地规则')}
                    onOk={this.okSet}
                    onCancel={this.cancelSet}
                >
                    {selectedGroup && selectedGroup.length > 0 ? (
                        <p className={styles.siteRule}>
                            <span>{trans('course.setup.newcourse.select.site', '选择场地')}</span>
                            <Select
                                placeholder={trans('global.pleaseAppointSite', '请选择场地')}
                                style={{ width: 250 }}
                                onChange={this.changeAppointSite}
                                value={appointSite}
                                mode="multiple"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {allAddress &&
                                    allAddress.map((item2, index2) => {
                                        return <Option key={item2.id}>{item2.name}</Option>;
                                    })}
                            </Select>
                        </p>
                    ) : (
                        <p style={{ textAlign: 'center' }}>
                            {trans('global.course or class first', '请先选择至少一个课程或班级！')}
                        </p>
                    )}
                </Modal>
                <Modal
                    visible={importRuleVisible}
                    title={trans('global.Import class scheduling rules', '导入排课规则')}
                    onOk={this.okImport}
                    onCancel={this.cancelImport}
                >
                    <div>
                        <p>
                            <span className={styles.explain}>
                                {trans('student.operationDetail', '操作说明')}
                            </span>
                            &nbsp;
                            <span>
                                {trans(
                                    'global.Currently only supported',
                                    '目前仅支持导入班级场地规则'
                                )}
                            </span>
                        </p>
                    </div>

                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            <span className={styles.text}>
                                {trans('student.uploadFile', '上传文件')}
                            </span>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button
                                                type="primary"
                                                style={{
                                                    marginRight: '20px',
                                                    borderRadius: '10px',
                                                }}
                                            >
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                            <a
                                href="/api/addressRule/addressRuleExcelTemplateDownload"
                                target="_blank"
                                // style={{ marginLeft: "40px" }}
                            >
                                {trans('global.downloadImportTemplate', '下载导入模板')}
                            </a>
                        </div>
                    </Spin>
                </Modal>
            </>
        );
    }
}
