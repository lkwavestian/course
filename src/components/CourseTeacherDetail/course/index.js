import React, { PureComponent } from 'react';
import styles from './index.less';
import '../../../common.less';
import { connect } from 'dva';
import {
    Select,
    Input,
    Button,
    Modal,
    Form,
    Pagination,
    Skeleton,
    Menu,
    Spin,
    Dropdown,
    Radio,
    Checkbox,
    Popover,
    TreeSelect,
    Row,
    Col,
    message,
    Table,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { trans, locale } from '../../../utils/i18n';
import CourseListHeader from '../component/courseListHeader';
import { getUrlSearch } from '../../../utils/utils';
import powerUrl from '../../../assets/noData.png';
import Step2 from '../../Course/CourseSelect/step/step2';
import EditCourseInfor from '../component/editCourseInfor';
import PrintBaseInfor from '../component/printBaseInfor';
import { isEmpty, debounce, isEqual } from 'lodash';

const { Search } = Input;
const { Option } = Select;
@connect((state) => ({
    subjectList: state.course.subjectList,
    getLotSubjects: state.course.getLotSubjects,
    modalSubject: state.course.modalSubject,
    newListCourse: state.course.newListCourse,
    excelImportInfo: state.choose.excelImportInfo,
    excelLotImportInfo: state.choose.excelLotImportInfo,
    selectionList: state.courseBaseDetail.selectionList,
    deleteCourseMsg: state.courseBaseDetail.deleteCourseMsg,
    groupSelectDetail: state.courseBaseDetail.groupSelectDetail,
    areaList: state.timeTable.areaList,
    groupUpdateMsg: state.courseBaseDetail.groupUpdateMsg,
    chooseCoursePlanBatchList: state.choose.chooseCoursePlanBatchList,
    checkCoursePlanAddPermission: state.courseBaseDetail.checkCoursePlanAddPermission,
    groupingList: state.courseBaseDetail.groupingList,
    listCourse: state.courseBaseDetail.listCourse,
    getLotsDetail: state.courseBaseDetail.getLotsDetail,
    userSchoolId: state.global.userSchoolId,
}))
@Form.create()
class Course extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            gradeId: '',
            weekId: '',
            keyWord: '',
            page: 1,
            pageSize: 20,
            total: 0,
            selectionList: [], // 课程列表数据
            planId: getUrlSearch('planId'),
            planStatus: getUrlSearch('planStatus'),
            firstLoad: false, // 首次加载
            visibleAddCourse: false, // 导入课程
            visibleEditCourseInfor: false, // 编辑课程信息
            coursePlanId: '', // 编辑时课程ID
            loadStatus: false, // 每次请求时加载动画
            isAllowCancel: false, // 是否允许取消开课
            showRepet: false, // 重复规则弹窗显隐
            showSign: false, //是否开放报名弹框
            indeterminate: false, // 全选框的样式控制
            isChecked: false, // 子选框的选中状态
            checkAll: false,
            checkedIds: [], //存取选中状态ids
            courseIdLists: [],
            radioValue: false, // 重复报名单选框值
            radioValueSign: undefined, //是否开放选课选框值
            exportCourseStatus: false, // 导入课程请求状态
            exportStartTime: '', // 导入课程开课周期开始日期
            exportEndTime: '', // 导入课程开课周期结束日期
            visibleFromExcel: false, // 从Excel导入弹层显隐
            courseRepeatApply: '', // 是否允许重复报名筛选 0 否 1 是
            openSelection: '',
            courseType: '',
            groupCountStatus: '', // 组班结果
            isShowError: false, // 导入失败弹框的显隐
            allClass: false,
            fullNumber: false,
            range: false,
            lower: false,
            allGroupCount: '',
            fullGroupCount: '',
            inRangeGroupCount: '',
            lessMinGroupCount: '',
            addCourseVisible: false,
            subjectId: '',
            keywords: undefined,
            checkedValues: [],
            printVisible: false,
            newSelectionList: [], //打包下载
            importErrorList: [],
            errorVisible: false,
            loading: false,
            groupType: '',

            batchUpdateVisible: false,
        };
    }

    componentDidMount() {
        this.initData();
        this.getTableList();
        this.getGroupList();
        this.props.onRef(this);
        const { selectionMessage } = this.props;
        this.setState({
            exportStartTime: selectionMessage && selectionMessage.startTimeString,
            exportEndTime: selectionMessage && selectionMessage.endTimeString,
        });
        this.getPermission();
        // this.getCheckClassPermission();
    }

    getGroupList = () => {
        this.props.dispatch({
            type: 'courseBaseDetail/selectGroupingByChoosePlan',
            payload: {
                choosePlanId: this.state.planId,
            },
        });
    };

    //获取场地列表
    initData() {
        const { dispatch } = this.props;
        let p1 = new Promise((resolve, reject) => {
            dispatch({
                type: 'timeTable/getAreaList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p2 = new Promise((resolve, reject) => {
            if (typeof courseIndex_subjectList !== 'undefined') {
                dispatch({
                    type: 'course/getCourseIndexSubjectList',
                    payload: courseIndex_subjectList,
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            } else {
                dispatch({
                    type: 'course/getSubjectList',
                    payload: {},
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            }
        });

        // 请求批次判断是否存在进行中的批次，已结束或未开始情况允许取消开课
        let p3 = new Promise((resolve, reject) => {
            dispatch({
                type: 'choose/chooseCoursePlanBatchList',
                payload: {
                    id: this.state.planId,
                },
                onSuccess: (data) => {
                    let time = new Date().getTime();
                    let isAllow = true;
                    for (let i = 0; i < (data && data.length); i++) {
                        let startTime = new Date(data[i].startTime).getTime();
                        let endTime = new Date(data[i].endTime).getTime();
                        if (time < endTime && time > startTime) {
                            isAllow = false; // false不允许取消开课
                            break;
                        }
                    }
                    this.setState({
                        isAllowCancel: isAllow,
                    });
                },
            });
        });

        // 全部加载完在去展示弹窗
        Promise.all([p1, p2, p3]).then(() => {});
    }

    // 课程列表
    getTableList = (value, flag) => {
        const { dispatch, groupingList } = this.props;
        let {
            keyWord,
            subjectId,
            gradeId,
            weekId,
            groupCountStatus,
            allClass,
            fullNumber,
            range,
            lower,
            courseRepeatApply,
            openSelection,
            courseType,
            pageSize,
            page,
            planId,
            groupType,
        } = this.state;

        let tempGroupObj =
            (groupingList &&
                groupingList.length > 0 &&
                groupingList.find((item) => item.groupingKey == groupType)) ||
            [];

        this.setState({
            loadStatus: false,
        });
        dispatch({
            type: 'courseBaseDetail/getSelectionList',
            payload: {
                chooseCoursePlanId: planId,
                subjectId,
                gradeIdList: gradeId,
                weekIdList: weekId,
                keyWord: flag === 'keyWordSearch' ? value : keyWord,
                allClass,
                fullNumber,
                range,
                lower,
                courseRepeatApply,
                openSelection,
                coursePlanType: courseType,
                pageNumber: flag === 'keyWordSearch' && value != '' ? 1 : page,
                pageSize: flag === 'keyWordSearch' && value != '' ? 20 : pageSize,
                groupGroupingNumJsonDTOList:
                    tempGroupObj && tempGroupObj.length == 0 ? [] : [tempGroupObj],
            },
        }).then(() => {
            const {
                totalCount,
                coursePlanOutputModels,
                allGroupCount,
                fullGroupCount,
                inRangeGroupCount,
                lessMinGroupCount,
            } = this.props.selectionList;
            this.setState({
                loadStatus: true,
                loading: true,
                firstLoad: true,
                total: totalCount || 0,
                selectionList: coursePlanOutputModels || [],
                allGroupCount,
                fullGroupCount,
                inRangeGroupCount,
                lessMinGroupCount,
            });
        });
    };

    resetData = () => {
        this.setState(
            {
                pageNumber: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    hideModal = (type) => {
        switch (type) {
            case 'visibleEditCourseInfor':
                this.setState({
                    visibleEditCourseInfor: false,
                });
                break;
            default:
                break;
        }
    };
    // 列表筛选change
    handleChange = (type, bol, value) => {
        this.setState(
            {
                [type]: bol ? value : value.target.value,
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    //groupType
    changeGroup = (value) => {
        console.log(value, 'value');
        this.setState(
            {
                groupType: value,
            },
            () => {
                this.getTableList();
            }
        );
    };

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState(
            {
                page,
                checkedIds: [],
                courseIdLists: [],
                checkAll: false,
                indeterminate: false,
            },
            () => {
                this.getTableList();
            }
        );
    };

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                page: 1,
                pageSize,
            },
            () => {
                this.getTableList();
            }
        );
    };

    // 删除二次确认
    removeCourse = (index, event) => {
        event.stopPropagation();
        let _this = this;
        // _this.handleDeleteCourse(index);
        Modal.confirm({
            content: trans(
                'global.deleteConfirmTitle',
                '您确认要将该课程从本次选课移除并且删除该课程在当前选课的所有班级的相关信息吗?'
            ),
            okText: trans('pay.confirm', '确认'),
            className: styles.deleteConfirm,
            onOk() {
                _this.handleDeleteCourse(index);
            },
        });
    };

    // 删除班课
    handleDeleteCourse = (index) => {
        let arr = [];
        const { dispatch } = this.props;
        const { planId, selectionList } = this.state;

        selectionList[index].courseGroupPlanOutputModels &&
            selectionList[index].courseGroupPlanOutputModels.length > 0 &&
            selectionList[index].courseGroupPlanOutputModels.map((el) => {
                arr.push(el.studentGroupModel.id);
            });

        dispatch({
            type: 'courseBaseDetail/deleteCourseChoose',
            payload: {
                chooseCoursePlanId: Number(planId),
                coursePlanningId: selectionList[index].coursePlanId,
                classIds: arr,
                type: 0,
            },
        }).then(() => {
            this.setState(
                {
                    pageNumber: 1,
                },
                () => {
                    this.getTableList();
                }
            );
        });
    };

    setRepet = () => {
        this.setState({
            showRepet: true,
        });
    };
    setSign = () => {
        const { checkedIds } = this.state;
        if (checkedIds.length == 0) {
            message.warn('请至少选择一个课程以操作!');
            return;
        }
        this.setState({
            showSign: true,
        });
    };

    lotDownload = () => {
        let { isAdmin } = this.props;
        let { checkedIds } = this.state;
        if (!isAdmin && checkedIds.length == 0) {
            message.warn('请至少选择一门课程以操作!');
            return;
        }
        window.open(
            `#/course/base/print?chooseCoursePlanId=${this.state.planId}&coursePlanningIds=${this.state.courseIdLists}&userSchoolId=${this.props.userSchoolId}`
        );
    };

    lotSetCourseInfo = () => {
        this.setState({
            batchUpdateVisible: true,
        });
    };

    onCheckAllChange = (e) => {
        if (e.target.checked) {
            this.setState({
                checkedIds: this.getListIds(),
                courseIdLists: this.getCourseIds(),
            });
        } else {
            this.setState({
                checkedIds: [],
                courseIdLists: [],
            });
        }
        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    //获取ids
    getListIds() {
        const { selectionList } = this.state;
        let ids = [];
        for (let i = 0; i < selectionList.length; i++) {
            if (selectionList[i]) {
                ids.push(selectionList[i]['courseId']);
            }
        }
        return ids;
    }

    getCourseIds() {
        const { selectionList } = this.state;
        let courseIds = [];
        for (let i = 0; i < selectionList.length; i++) {
            if (selectionList[i]) {
                courseIds.push(selectionList[i]['coursePlanId']);
            }
        }
        return courseIds;
    }
    // 去掉非选中状态的
    ridUnCheck = (id) => {
        const { checkedIds, selectionList } = this.state;
        let ids = checkedIds.filter((item, index) => {
            return item !== id;
        });
        this.setState({
            checkedIds: ids,
            indeterminate: ids.length != 0 && ids.length < selectionList.length ? true : false,
            checkAll: false,
        });
    };
    ridUnCourse = (id) => {
        const { courseIdLists, selectionList } = this.state;
        let ids = courseIdLists.filter((item, index) => {
            return item !== id;
        });
        this.setState({
            courseIdLists: ids,
        });
    };

    // 加入选中状态的
    addCheck = (id) => {
        const { selectionList } = this.state;
        let newCheckedIds = Object.assign([], this.state.checkedIds);
        newCheckedIds.push(id);
        this.setState({
            checkedIds: newCheckedIds,
            indeterminate:
                newCheckedIds.length != 0 && newCheckedIds.length < selectionList.length
                    ? true
                    : false,
            checkAll: newCheckedIds.length == selectionList.length ? true : false,
        });
    };
    addCourseId = (id) => {
        const { selectionList } = this.state;
        let newCourseIds = Object.assign([], this.state.courseIdLists);
        newCourseIds.push(id);
        this.setState({
            courseIdLists: newCourseIds,
        });
    };

    setChildChecked = () => {
        const { isChecked } = this.state;
        this.setState({
            isChecked: !isChecked,
        });
    };
    fomatGrade = (gradeList) => {
        let grade = [];
        gradeList &&
            gradeList.length > 0 &&
            gradeList.map((item, index) => {
                let obj = {};
                obj.title = locale() != 'en' ? item.orgName : item.orgEname;
                obj.key = item.id;
                obj.value = item.id;
                grade.push(obj);
            });
        return grade;
    };

    fomatWeek = (week) => {
        let grade = [];
        week &&
            week.length > 0 &&
            week.map((item, index) => {
                let obj = {};
                obj.title = locale() != 'en' ? item.orgName : item.orgEname;
                obj.key = item.id;
                obj.value = item.id;
                grade.push(obj);
            });
        return grade;
    };

    promiseRepeatHandle = (value) => {
        this.setState({
            courseRepeatApply: value,
        });
    };

    formClassHandle = (value) => {
        this.setState({
            groupCountStatus: value,
        });
    };

    getPermission = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'courseBaseDetail/checkCoursePlanAddPermission',
            payload: {
                chooseCoursePlanId: this.state.planId,
            },
        });
    };
    getCheckClassPermission = () => {
        const { dispatch, selectionList } = this.props;
        let singlecoursePlanId = undefined;
        /* singlecoursePlanId =
            selectionList &&
            selectionList.coursePlanOutputModels &&
            selectionList.coursePlanOutputModels[0].coursePlanId;
        console.log('111', selectionList.coursePlanOutputModels[0].coursePlanId); */

        dispatch({
            type: 'courseBaseDetail/checkClassPermission',
            payload: {
                chooseCoursePlanId: this.state.planId,
                coursePlanningId: singlecoursePlanId,
            },
        });
    };

    addCourse = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/modalSubject',
            payload: {},
        });
        this.getAllCourse();
        this.setState({
            addCourseVisible: true,
        });
    };

    getAllCourse = () => {
        const { dispatch } = this.props;
        const { keywords, subjectId } = this.state;
        dispatch({
            type: 'course/newListCourse',
            payload: {
                chooseCoursePlanId: this.state.planId,
                keyword: keywords,
                subjectId,
            },
        });
    };

    searchHTML() {
        let {
            gradeId,
            subjectId,
            weekId,
            keyWord,
            groupCountStatus,
            courseRepeatApply,
            openSelection,
            courseType,
            indeterminate,
            checkAll,
            planId,
            planStatus,
        } = this.state;
        let {
            gradeList,
            subjectList,
            isAdmin,
            nonAdminType,
            effecticveDisabled,
            checkCoursePlanAddPermission,
            getLotSubjects,
            newListCourse,
            groupingList,
        } = this.props;
        const gradeProps = {
            style: {
                width: 105,
                marginRight: 8,
                verticalAlign: 'top',
            },
            maxTagCount: 2,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeData: this.fomatGrade(gradeList),
            placeholder: trans('course.plan.allGrade', '全部年级'),
            onChange: this.handleChange.bind(this, 'gradeId', true),
        };

        const weekArray = [
            {
                orgName: '周一',
                orgEname: 'Monday',
                id: 1,
            },
            {
                orgName: '周二',
                orgEname: 'Tuesday',
                id: 2,
            },
            {
                orgName: '周三',
                orgEname: 'Wednesday',
                id: 3,
            },
            {
                orgName: '周四',
                orgEname: 'Thursday',
                id: 4,
            },
            {
                orgName: '周五',
                orgEname: 'Friday',
                id: 5,
            },
            {
                orgName: '周六',
                orgEname: 'Saturday',
                id: 6,
            },
            {
                orgName: '周日',
                orgEname: 'Sunday',
                id: 7,
            },
        ];

        const weekProps = {
            style: {
                width: 105,
                marginRight: 8,
                verticalAlign: 'top',
            },
            maxTagCount: 2,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeData: this.fomatWeek(weekArray),
            placeholder: trans('course.step1.selection.classTime', '上课时间'),
            onChange: this.handleChange.bind(this, 'weekId', true),
        };

        let menu = (
            <Menu>
                <Menu.Item onClick={this.setRepet}>
                    {trans('course.plan.repeat', '设置同课程重复报名规则')}
                </Menu.Item>
                <Menu.Item onClick={this.setSign}>
                    {trans('course.plan.signUp', '设置是否开放报名')}
                </Menu.Item>
                <Menu.Item onClick={this.chooseExportCourse}>
                    {trans('global.ExportMessage', '导出课程信息')}
                </Menu.Item>
                <Menu.Item onClick={this.lotDownload}>
                    {trans('course.selectionDownLoad', '打包下载课程介绍')}
                </Menu.Item>
                <Menu.Item onClick={this.lotSetCourseInfo}>批量修改选课信息</Menu.Item>
            </Menu>
        );

        let importMenu = (
            <Menu>
                <Menu.Item onClick={this.addCourse}>
                    {trans('global.courseList', '添加课程')}
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        this.setState({
                            visibleAddCourse: true,
                        });
                    }}
                >
                    {trans('course.planImport', '从课时计划导入')}
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        this.setState({
                            visibleFromExcel: true,
                        });
                    }}
                >
                    {trans('global.courseImportExcel', '从Excel导入')}
                </Menu.Item>
            </Menu>
        );
        if (!isAdmin && nonAdminType == 1) {
            menu = (
                <Menu>
                    <Menu.Item onClick={this.chooseExportCourse}>
                        {trans('global.ExportMessage', '导出课程信息')}
                    </Menu.Item>
                    <Menu.Item onClick={this.lotDownload}>
                        {trans('course.selectionDownLoad', '打包下载课程介绍')}
                    </Menu.Item>
                </Menu>
            );
        }

        return (
            <div className={`${styles.search} ${styles.formStyle}`}>
                <div style={{ width: '985px', marginLeft: '14px' }}>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                        {trans('global.choiceAll', '全选')}
                    </Checkbox>
                    <TreeSelect className={styles.treeSelectStyle} {...gradeProps}></TreeSelect>
                    <Select
                        placeholder="请选择科目"
                        defaultValue={subjectId}
                        style={{ width: 105, margin: '0 8px 0 0', height: '36px' }}
                        className={styles.selectStyle}
                        onChange={this.handleChange.bind(this, 'subjectId', true)}
                    >
                        <Option value="" key="all">
                            {trans('course.plan.allsubject', '全部科目')}
                        </Option>
                        {getLotSubjects &&
                            getLotSubjects.length > 0 &&
                            getLotSubjects.map((item, index) => {
                                return (
                                    <Option
                                        value={item.id}
                                        key={item.id}
                                        title={locale() != 'en' ? item.name : item.enName}
                                    >
                                        {locale() != 'en' ? item.name : item.enName}
                                    </Option>
                                );
                            })}
                    </Select>

                    <Select
                        // defaultValue={groupType}
                        className={styles.promiseRepeat}
                        style={{ width: 105, margin: '0 8px 0 0', height: '36px' }}
                        placeholder={trans('selCourse.allGroups', '全部分组')}
                        onChange={this.handleChange.bind(this, 'groupType', true)}
                        value={this.state.groupType}
                    >
                        <Option value="" key="all">
                            {trans('selCourse.allGroups', '全部分组')}
                        </Option>
                        {groupingList &&
                            groupingList.length > 0 &&
                            groupingList.map((item, index) => {
                                return (
                                    <Option value={item.groupingKey} key={item.groupingKey}>
                                        {item.groupingName}
                                    </Option>
                                );
                            })}
                    </Select>

                    <TreeSelect className={styles.treeSelectStyle} {...weekProps}></TreeSelect>

                    <Select
                        defaultValue={courseRepeatApply}
                        className={styles.promiseRepeat}
                        style={{ width: 100, height: '36px' }}
                        placeholder={trans('global.RepeatRegistration', '重复报名')}
                        onChange={this.handleChange.bind(this, 'courseRepeatApply', true)}
                    >
                        <Option value="">{trans('global.RepeatRegistration', '重复报名')}</Option>
                        <Option value="1">{trans('student.Allow', '是')}</Option>
                        <Option value="0">{trans('student.Forbid', '否')}</Option>
                        <Option value="2">{trans('global.Not set', '未设置')}</Option>
                    </Select>

                    <Select
                        defaultValue={openSelection}
                        className={styles.promiseRepeat}
                        style={{ width: 100, margin: '0 8px', height: '36px' }}
                        placeholder={trans('open.course.selection', '开放选课')}
                        onChange={this.handleChange.bind(this, 'openSelection', true)}
                    >
                        <Option value="">{trans('open.course.selection', '开放选课')}</Option>
                        <Option value="0">{trans('student.yesOpened', '是')}</Option>
                        <Option value="1">{trans('student.noClosed', '否')}</Option>
                    </Select>

                    <Select
                        defaultValue={courseType}
                        className={styles.promiseRepeat}
                        style={{ width: 100, margin: '0 8px 0 0', height: '36px' }}
                        placeholder={trans('open.course.courseType', '开课类型')}
                        onChange={this.handleChange.bind(this, 'courseType', true)}
                    >
                        <Option value="">{trans('open.course.courseType', '开课类型')}</Option>
                        <Option value="0">{trans('course.plan.newClass', '新课')}</Option>
                        <Option value="1">{trans('course.plan.advanced', '进阶')}</Option>
                        <Option value="2">{trans('course.plan.schoolTeam', '校队')}</Option>
                    </Select>

                    <Search
                        placeholder={trans('role.InputKeyword', '搜索关键字')}
                        onChange={(e) => {
                            this.changeKeyWord(e);
                        }}
                        onSearch={(value) => this.getTableList(value, 'keyWordSearch')}
                        style={{ width: locale() != 'en' ? 147 : 115 }}
                        className={styles.searchStyle}
                    />
                </div>
                <div className={styles.searchR}>
                    {/* 20240112拿掉非管理员权限 */}
                    {/* {isAdmin  ? ( 
                        <Button
                            type="primary"
                            style={{ width: 'auto' }}
                            onClick={() => this.addCourse()}
                        >
                            +&nbsp;{trans('global.courseList', '添加课程')}
                        </Button>
                    ) : null} */}
                    {isAdmin ? (
                        <Dropdown overlayClassName={styles.popoverStyle} overlay={importMenu}>
                            <Button
                                className={styles.btn}
                                style={{ margin: '0 9px' }}
                                type="primary"
                            >
                                {trans('global.courseList.importClassInfo', '导入课程班级信息')}
                                
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    ) : (
                        ''
                    )}

                    {checkCoursePlanAddPermission && (
                        <Dropdown overlay={menu} className={styles.btn}>
                            <Button type="primary" style={!isAdmin ? { marginLeft: '9px' } : null}>
                                {trans('global.courseList.batchSet', '批量操作')}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    )}
                </div>
            </div>
        );
    }

    noDataHTML() {
        return (
            <div className={styles.noData}>
                <div>
                    <img src={powerUrl} />
                    <div className={styles.title}>{trans('tc.base.no.data', '暂无数据')}</div>
                </div>
            </div>
        );
    }

    // 导入课程
    addCourseHTML() {
        let { visibleAddCourse, planId, exportCourseStatus } = this.state;
        const { selectionMessage } = this.props;
        return (
            <Modal
                title={trans('tc.base.important.course', '导入课程')}
                className={styles.exportCourse}
                width="85vw"
                maskClosable={false}
                closable={false}
                visible={visibleAddCourse}
                onOk={this.handleOkAddCourse}
                destroyOnClose={true}
                confirmLoading={exportCourseStatus}
                onCancel={() => {
                    this.setState({
                        visibleAddCourse: false,
                    });
                }}
            >
                <Step2
                    onRefStep={(self) => {
                        this.stepChild2 = self;
                    }}
                    {...this.props}
                    planId={planId}
                    isEdit={true}
                    exportTime={this.exportTime}
                    openOrigin="course"
                    selectionMessage={selectionMessage}
                    start={selectionMessage.startTimeString}
                    end={selectionMessage.endTimeString}
                    visibleAddCourse={this.state.visibleAddCourse}
                />
            </Modal>
        );
    }

    // 关闭Excel导入弹层
    excelModalClose = () => {
        let fileList = document.getElementById('uploadBtn');
        fileList.value = '';
        this.setState({
            visibleFromExcel: false,
        });
    };

    batchUpdateClose = () => {
        let fileList = document.getElementById('uploadBtn');
        fileList.value = '';
        this.setState({
            batchUpdateVisible: false,
        });
    };

    // 确定从Excel导入
    sureImport = () => {
        const { dispatch } = this.props;
        let data = new FormData();
        let fileList = document.getElementById('uploadBtn');
        let files = fileList && fileList.files[0];
        data.append('file', files);
        data.append('chooseCoursePlanId', this.state.planId);
        this.setState({
            isUploading: true,
        });
        dispatch({
            type: 'choose/excelImport',
            payload: data,
            /* onSuccess: () => {
                this.setState({
                    isShowError: true,
                });
            }, */
        }).then(() => {
            let { excelImportInfo } = this.props;
            if (!isEmpty(excelImportInfo)) {
                this.setState({
                    importErrorList: excelImportInfo.checkErrorMessageList,
                    errorVisible: true,
                });
            } else {
                this.setState(
                    {
                        visibleFromExcel: false,
                    },
                    () => {
                        this.getTableList();
                    }
                );
            }
        });
    };

    //批量修改课程信息导入
    sureImportCourse = () => {
        const { dispatch } = this.props;
        let data = new FormData();
        let fileList = document.getElementById('uploadBtn');
        let files = fileList && fileList.files[0];
        data.append('file', files);
        data.append('chooseCoursePlanId', this.state.planId);
        this.setState({
            isUploading: true,
        });
        dispatch({
            type: 'choose/excelLotImport',
            payload: data,
        }).then(() => {
            let { excelLotImportInfo } = this.props;
            if (!isEmpty(excelLotImportInfo)) {
                this.setState({
                    importErrorList: excelLotImportInfo.checkErrorMessageList,
                    errorVisible: true,
                });
            } else {
                this.setState(
                    {
                        batchUpdateVisible: false,
                    },
                    () => {
                        this.getTableList();
                    }
                );
            }
        });
    };

    importExcelHTML = () => {
        let { visibleFromExcel } = this.state;
        return (
            <Modal
                title={trans('', '从Excel导入')}
                className={styles.exportByExcel}
                visible={visibleFromExcel}
                onCancel={this.excelModalClose}
                onOk={this.sureImport}
            >
                <div>
                    ①下载导入模板，填写开班信息。填写时注意：若导入表格中的班级
                    在本次选课中不存在，系统会创建新班；
                    <span style={{ color: 'red' }}>
                        若已存在同名班级，系统会 根据表格更新已有的开班信息{' '}
                    </span>
                    <br />
                    <a
                        style={{ display: 'inline-block', margin: '15px 0' }}
                        href="/api/choose/choosePlan/template"
                        target="_blank"
                    >
                        {trans('global.downloadImportTemp', '下载模板')}
                    </a>
                    <br />② 上传填写好的导入信息表
                </div>
                <div className={styles.upLoad}>
                    <span className={styles.desc}>
                        <span className={styles.fileBtn}>
                            <Form
                                id="uploadForm"
                                layout="inline"
                                method="post"
                                className={styles.form}
                                encType="multipart/form-data"
                            >
                                <input type="file" name="file" id="uploadBtn" accept=".xls,.xlsx" />
                            </Form>
                        </span>
                    </span>
                </div>
            </Modal>
        );
    };

    exportCourseList = () => {
        const { dispatch, isAdmin } = this.props;
        const { planId, checkedIds } = this.state;
        window.open(
            `/api/course/selection/newChooseExportCourse?chooseCoursePlanId=${planId}&courseIdList=${checkedIds}`
        );
    };

    //批量修改课程信息
    batchUpdateHTML = () => {
        let { batchUpdateVisible } = this.state;
        return (
            <Modal
                title="批量修改课程信息"
                className={styles.exportByExcel}
                visible={batchUpdateVisible}
                onCancel={this.batchUpdateClose}
                onOk={this.sureImportCourse}
            >
                <div>
                    ①
                    导出数据，在excel中修改信息。注意：请勿修改课程名和班级名，系统会根据课程和班级名称更新已有信息
                    <div className={styles.exportOperate} style={{ marginLeft: 5 }}>
                        <Button
                            className={styles.exportCourseStyle}
                            type="primary"
                            // href="/api/choose/choosePlan/template"
                            // target="_blank"
                            onClick={this.exportCourseList}
                        >
                            导出数据
                        </Button>
                    </div>
                    <br />② 上传填写好的导入信息表
                </div>
                <div className={styles.upLoad}>
                    <span className={styles.desc}>
                        <span className={styles.fileBtn}>
                            <Form
                                id="uploadForm"
                                layout="inline"
                                method="post"
                                className={styles.form}
                                encType="multipart/form-data"
                            >
                                <input
                                    style={{ marginLeft: 5 }}
                                    type="file"
                                    name="file"
                                    id="uploadBtn"
                                    accept=".xls,.xlsx"
                                />
                            </Form>
                        </span>
                    </span>
                </div>
            </Modal>
        );
    };

    downloadUrl = () => {
        let redisKey = this.props.excelImportInfo.redisKey;
        let downloadUrl = `${location.protocol}//${location.host}/api/choose/choosePlan/downloadDefaultCoursePlanning?redisKey=${redisKey}`;
        location.href = downloadUrl;
        this.setState(
            {
                isShowError: false,
                visibleFromExcel: false,
            },
            () => {
                this.getTableList();
            }
        );
    };

    // 保存导入课程开课周期传入的时间
    exportTime = (exportStartTime, exportEndTime) => {
        this.setState({
            exportStartTime,
            exportEndTime,
        });
    };

    handleOkAddCourse = () => {
        let { dispatch } = this.props;
        let sc = this.stepChild2.state;
        let { planId, exportCourseStatus, exportStartTime, exportEndTime } = this.state;
        if (exportCourseStatus) {
            return;
        }
        this.setState(
            {
                exportCourseStatus: true,
            },
            () => {
                dispatch({
                    type: 'choose/coursePlanning',
                    payload: {
                        chooseCoursePlanId: planId,
                        coursePlanningIdList: sc.notActiveArr,
                        startTime: exportStartTime,
                        endTime: exportEndTime,
                    },
                    onSuccess: () => {
                        this.setState(
                            {
                                page: 1,
                                visibleAddCourse: false,
                                exportCourseStatus: false,
                                exportEndTime: '',
                                exportStartTime: '',
                            },
                            () => {
                                this.getTableList();
                            }
                        );
                    },
                }).then(() => {
                    this.setState({
                        exportCourseStatus: false,
                    });
                });
            }
        );
    };

    contentHTML() {
        const { selectionMessage, areaList, dispatch, isAdmin, effecticveDisabled, nonAdminType } =
            this.props;
        const {
            selectionList,
            total,
            page,
            pageSize,
            planId,
            isAllowCancel,
            listIndex,
            visibleEditCourseInfor,
            loading,
            planStatus,
        } = this.state;
        return (
            // <Spin spinning={loading} tip="加载中。。。">
            <div>
                {selectionList.map((item, index) => {
                    return (
                        <CourseListHeader
                            key={item.courseId}
                            courseIndex={index}
                            coursePlanId={item.coursePlanId}
                            layoutStyle={item.layoutStyle}
                            courseEnglishName={item.courseEnglishName}
                            serial={item.courseGroupPlanOutputModels.length}
                            courseName={item.courseName}
                            courseSuitGradeList={item.courseSuitGradeList}
                            dispatch={dispatch}
                            self={this}
                            semesterId={selectionMessage.semesterModel.id}
                            resetData={this.resetData}
                            {...item}
                            chooseCoursePlanId={planId}
                            areaList={areaList}
                            isAdmin={isAdmin}
                            nonAdminType={nonAdminType}
                            planStatus={planStatus}
                            chooseCourseName={selectionMessage && selectionMessage.name}
                            chooseCourseEname={selectionMessage && selectionMessage.englishName}
                            effecticveDisabled={effecticveDisabled}
                            isAllowCancel={isAllowCancel}
                            setChildChecked={this.setChildChecked}
                            isChecked={this.state.isChecked}
                            checkedIds={this.state.checkedIds}
                            courseIdLists={this.state.courseIdLists}
                            addCheck={this.addCheck}
                            addCourseId={this.addCourseId}
                            ridUnCheck={this.ridUnCheck}
                            ridUnCourse={this.ridUnCourse}
                            getTableList={this.getTableList}
                            visibleEditCourseInfor={visibleEditCourseInfor}
                            materialFeeType={item.materialFeeType}
                            courseGroupPlanOutputModels={item.courseGroupPlanOutputModels}
                            groupingList={this.props.groupingList}
                        >
                            <>
                                <Menu>
                                    <Menu.Item>
                                        <span onClick={this.removeCourse.bind(this, index)}>
                                            {trans('tc.base.remove.course', '移除课程')}
                                        </span>
                                    </Menu.Item>
                                </Menu>
                            </>
                        </CourseListHeader>
                    );
                })}
                <div className={styles.page}>
                    <span className={styles.total}>
                        {trans('course.basedetail.total.course', '共 {$num} 个课程 ', {
                            num: total,
                        })}
                    </span>
                    <Pagination
                        total={total}
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={[10, 20, 50, 100]}
                        style={{ float: 'right' }}
                        onChange={this.changePage}
                        onShowSizeChange={this.onShowSizeChange}
                        current={page}
                        pageSize={pageSize}
                    />
                </div>
            </div>
            // </Spin>
        );
    }

    radioChange = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    radioChangeSign = (e) => {
        this.setState({
            radioValueSign: e.target.value,
        });
    };

    handleCancel = () => {
        this.setState({
            showRepet: false,
        });
    };
    handleCancelSign = () => {
        this.setState({
            showSign: false,
        });
    };

    handleOnOK = () => {
        const { dispatch } = this.props;
        const { checkedIds, courseIdLists, radioValue, planId } = this.state;
        dispatch({
            type: 'courseBaseDetail/setCourseRepeat',
            payload: {
                courseIdList: checkedIds,
                courseRepeatApply: radioValue,
                coursePlanningIds: courseIdLists,
                chooseCoursePlanId: planId,
            },
            onSuccess: () => {
                this.setState({
                    showRepet: false,
                    checkedIds: [],
                    courseIdLists: [],
                    indeterminate: false,
                });
                this.getTableList();
            },
        });
    };
    handleOnOKSign = () => {
        const { dispatch, selectionMessage } = this.props;
        const { checkedIds, radioValueSign, planId, radioValue } = this.state;
        dispatch({
            type: 'courseBaseDetail/batchUpdateCourseSignUp',
            payload: {
                courseIdList: checkedIds,
                chooseCoursePlanId: planId,
                semesterId: selectionMessage.semesterModel.id,
                openSelection: radioValueSign,
                courseRepeatApply: radioValue,
            },
            onSuccess: () => {
                this.setState({
                    checkedIds: [],
                    indeterminate: false,
                    showSign: false,
                });
                this.getTableList();
            },
        });
    };

    showHandleCancel = () => {
        this.setState(
            {
                isShowError: false,
                visibleFromExcel: false,
            },
            () => {
                this.getTableList();
            }
        );
    };

    showHandleOnOK = () => {
        this.setState(
            {
                isShowError: false,
                visibleFromExcel: false,
            },
            () => {
                this.getTableList();
            }
        );
    };

    chooseExportCourse = () => {
        const { dispatch, isAdmin } = this.props;
        const { planId, checkedIds } = this.state;
        if (!isAdmin && checkedIds.length == 0) {
            message.warn('请勾选需导出的课程！');
            return;
        }
        window.open(
            `/api/course/selection/chooseExportCourse?chooseCoursePlanId=${planId}&courseIdList=${checkedIds}`
        );
    };

    change = (handle) => {
        if (handle == 'allClass') {
            this.state.allClass == true
                ? this.setState({ allClass: false }, () => {
                      this.getTableList();
                  })
                : this.setState({ allClass: true }, () => {
                      this.getTableList();
                  });
        } else if (handle == 'fullNumber') {
            this.state.fullNumber == true
                ? this.setState({ fullNumber: false }, () => {
                      this.getTableList();
                  })
                : this.setState({ fullNumber: true }, () => {
                      this.getTableList();
                  });
        } else if (handle == 'range') {
            this.state.range == true
                ? this.setState({ range: false }, () => {
                      this.getTableList();
                  })
                : this.setState({ range: true }, () => {
                      this.getTableList();
                  });
        } else {
            this.state.lower == true
                ? this.setState({ lower: false }, () => {
                      this.getTableList();
                  })
                : this.setState({ lower: true }, () => {
                      this.getTableList();
                  });
        }
    };

    addCourseOk = () => {
        const { dispatch } = this.props;
        let { checkedValues, planId } = this.state;
        let newValues = checkedValues.join(',');
        dispatch({
            type: 'choose/addCoursePlan',
            payload: {
                chooseCoursePlanId: planId,
                courseIds: newValues,
            },
            onSuccess: () => {},
        }).then(() => {
            this.setState(
                {
                    addCourseVisible: false,
                    checkedValues: [],
                    keywords: undefined,
                    subjectId: '',
                },
                () => {
                    this.getTableList();
                }
            );
        });
    };

    addCourseCannel = () => {
        this.setState({
            addCourseVisible: false,
            subjectId: '',
            keywords: undefined,
            checkedValues: [],
        });
    };

    changeCate = (value) => {
        this.setState(
            {
                subjectId: value,
            },
            () => this.getAllCourse()
        );
    };

    changeCourse = (checkedValues) => {
        this.setState({
            checkedValues,
        });
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

    changeKeyWord = (e) => {
        this.delayedChangeKeyWord(e.target.value);
    };

    delayedChangeKeyWord = debounce((value) => {
        this.setState({
            keyWord: value,
        });
    }, 500);

    render() {
        const {
            selectionList,
            importErrorList,
            visibleEditCourseInfor,
            coursePlanId,
            loadStatus,
            showRepet,
            showSign,
            radioValue,
            radioValueSign,
            checkedIds,
            isShowError,
            keywords,
            checkedValues,
            subjectId,
            addCourseVisible,
            printVisible,
            errorVisible,
            visibleAddCourse,
            visibleFromExcel,
            batchUpdateVisible,
        } = this.state;

        const { newListCourse, modalSubject, getLotsDetail } = this.props;
        let courseList = [];
        newListCourse &&
            newListCourse.map((item, index) => {
                courseList.push({
                    ...item,
                    disabled: false,
                });
            });
        courseList &&
            courseList.map((item, index) => {
                selectionList &&
                    selectionList.map((el, ind) => {
                        if (el.courseId == item.id) {
                            courseList[index].disabled = true;
                        }
                    });
            });
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        let errorColumns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                width: 100,
                key: 'lineNumber',
                align: 'center',
            },
            {
                title: '错误信息',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                align: 'center',
            },
        ];

        // 首次加载骨架屏
        if (!this.state.firstLoad) {
            return (
                <div className={styles.Course}>
                    {this.searchHTML()}
                    <div className={styles.Skeleton}>
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.Course}>
                {this.searchHTML()}

                <div className={styles.groupResult}>
                    <span
                        onClick={() => this.change('allClass')}
                        style={{
                            cursor: 'pointer',
                            color: this.state.allClass == true ? 'blue' : 'black',
                        }}
                    >
                        <span style={{ fontSize: 26 }}>{this.state.allGroupCount}</span>
                        {trans('course.plan.class', '全部班级')}
                    </span>
                    <span
                        onClick={() => this.change('fullNumber')}
                        style={{
                            cursor: 'pointer',
                            color: this.state.fullNumber == true ? 'blue' : 'black',
                        }}
                    >
                        <span style={{ fontSize: 26 }}>{this.state.fullGroupCount}</span>
                        {trans('course.plan.full', '人数已满')}
                    </span>
                    <span
                        onClick={() => this.change('range')}
                        style={{
                            cursor: 'pointer',
                            color: this.state.range == true ? 'blue' : 'black',
                        }}
                    >
                        <span style={{ fontSize: 26 }}>{this.state.inRangeGroupCount}</span>
                        {trans('course.plan.fullBetween', '人数介于上下限之间')}
                    </span>
                    <span
                        onClick={() => this.change('lower')}
                        style={{
                            cursor: 'pointer',
                            color: this.state.lower == true ? 'blue' : 'black',
                        }}
                    >
                        <span style={{ fontSize: 26 }}>{this.state.lessMinGroupCount}</span>
                        {trans('course.plan.fullBetweenLow', '人数低于下限')}
                    </span>
                </div>

                {selectionList.length > 0 ? (
                    loadStatus ? (
                        this.contentHTML()
                    ) : (
                        <Spin tip="Try to loading...">{this.contentHTML()}</Spin>
                    )
                ) : (
                    this.noDataHTML()
                )}

                {visibleAddCourse && this.addCourseHTML()}

                {visibleFromExcel && this.importExcelHTML()}

                {batchUpdateVisible && this.batchUpdateHTML()}

                {visibleEditCourseInfor && (
                    <EditCourseInfor
                        visibleEditCourseInfor={visibleEditCourseInfor}
                        self={this}
                        getTableList={this.getTableList}
                        coursePlanId={coursePlanId}
                        hideModal={this.hideModal}
                        chooseCourseDetails={this.props.chooseCourseDetails}
                        groupingList={this.props.groupingList}
                    />
                )}

                {errorVisible && (
                    <Modal
                        visible={errorVisible}
                        footer={[
                            <Button
                                type="primary"
                                className={styles.reUpload}
                                onClick={() => {
                                    let data = new FormData();
                                    let fileList = document.getElementById('uploadBtn');
                                    fileList.value = '';
                                    this.setState({
                                        fileList: [],
                                        errorVisible: false,
                                    });
                                }}
                            >
                                {trans('global.uploadAgain', '重新上传')}
                            </Button>,
                        ]}
                        onCancel={() =>
                            this.setState({
                                errorVisible: false,
                                fileList: [],
                            })
                        }
                        title="导入课程失败信息"
                        width={720}
                    >
                        <p style={{ textAlign: 'center' }}>
                            {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                            <span style={{ color: 'red' }}>
                                {importErrorList && importErrorList.length > 0
                                    ? importErrorList.length
                                    : null}{' '}
                            </span>
                            &nbsp;
                            {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                        </p>
                        <Table
                            columns={errorColumns}
                            dataSource={importErrorList}
                            rowKey="lineNumber"
                            pagination={false}
                        ></Table>
                    </Modal>
                )}

                {showRepet && (
                    <Modal
                        title={trans('course.plan.repeat', '设置同课程重复报名规则')}
                        visible={showRepet}
                        onOk={this.handleOnOK}
                        onCancel={this.handleCancel}
                        className={styles.repeatModal}
                    >
                        <div className={styles.courseNum}>
                            {trans('course.basedetail.select.course', '已选择{$num}个课程', {
                                num: checkedIds.length,
                            })}
                        </div>
                        <Radio.Group
                            onChange={this.radioChange}
                            value={radioValue}
                            className={styles.radio}
                        >
                            <Radio style={radioStyle} value={false}>
                                {trans('course.forbid.repeat.apply', '禁止已上/已报名学生再次报名')}
                            </Radio>
                            <Radio style={radioStyle} value={true}>
                                {trans('course.allow.repeat.apply', '允许已上/已报名学生再次报名')}
                            </Radio>
                        </Radio.Group>
                    </Modal>
                )}

                {showSign && (
                    <Modal
                        title={trans('course.plan.signUp', '设置是否开放报名')}
                        visible={showSign}
                        onOk={this.handleOnOKSign}
                        onCancel={this.handleCancelSign}
                        className={styles.repeatModal}
                    >
                        <div className={styles.courseNum}>
                            {trans('course.basedetail.select.course', '已选择{$num}个课程', {
                                num: checkedIds.length,
                            })}
                        </div>
                        <Radio.Group
                            onChange={this.radioChangeSign}
                            value={radioValueSign}
                            className={styles.radio}
                        >
                            <Radio style={radioStyle} value={true}>
                                {trans('course.forbid.signUp', '设置为不开放报名')}
                            </Radio>
                            <p style={{ textIndent: '2em' }}>
                                不开放报名的课程，学生在选课列表不可见
                            </p>
                            <Radio style={radioStyle} value={false}>
                                {trans('course.allow.signUp', '设置为开放报名')}
                                <p style={{ textIndent: '2em' }}>默认所有课程开放报名，无需设置</p>
                            </Radio>
                        </Radio.Group>
                    </Modal>
                )}

                {addCourseVisible && (
                    <Modal
                        visible={addCourseVisible}
                        title={trans('global.courseList', '添加课程')}
                        onOk={this.addCourseOk}
                        onCancel={this.addCourseCannel}
                        className={styles.addCourse}
                        style={{ top: window.self != window.top ? '55px' : '60px' }}
                    >
                        <Select
                            value={subjectId}
                            placeholder="所有分类"
                            style={{ width: 140 }}
                            onChange={this.changeCate}
                        >
                            <Option value="" key="all">
                                {trans('course.plan.allsubject', '全部科目')}
                            </Option>
                            {modalSubject &&
                                modalSubject.map((item, index) => {
                                    return (
                                        <Option value={item.id}>
                                            {locale() !== 'en' ? item.name : item.enName}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Search
                            value={keywords}
                            // placeholder="搜索课程名称"
                            placeholder={trans('role.InputKeyword', '搜索关键字')}
                            onChange={(e) =>
                                this.setState({
                                    keywords: e.target.value,
                                })
                            }
                            onSearch={() => this.getAllCourse()}
                            style={{ width: 300, marginLeft: '10px' }}
                        />
                        <Checkbox.Group
                            value={checkedValues}
                            className={styles.courseLists}
                            onChange={this.changeCourse}
                        >
                            <Row>
                                {courseList &&
                                    courseList.map((item, index) => {
                                        return (
                                            <Col span={24} style={{ height: '40px' }}>
                                                <Checkbox
                                                    value={item.id}
                                                    key={item.id}
                                                    disabled={item.disabled}
                                                >
                                                    {locale() !== 'en' ? item.name : item.enName}
                                                </Checkbox>
                                            </Col>
                                        );
                                    })}
                            </Row>
                        </Checkbox.Group>
                    </Modal>
                )}

                {printVisible && (
                    <Modal
                        visible={printVisible}
                        footer={null}
                        onCancel={() => this.setState({ printVisible: false })}
                        closable={false}
                        className={styles.printCon}
                        id="printCon"
                        // maskClosable={false}
                    >
                        <>
                            <div>
                                {getLotsDetail &&
                                    getLotsDetail.length > 0 &&
                                    getLotsDetail.map((item, index) => (
                                        <PrintBaseInfor
                                            className="printPage"
                                            noToChinese={this.noToChinese}
                                            hexToRgba={this.hexToRgba}
                                            {...item}
                                            courseIntroductionType={
                                                this.props.chooseCourseDetails
                                                    .courseIntroductionType
                                            }
                                        ></PrintBaseInfor>
                                    ))}
                            </div>
                        </>
                    </Modal>
                )}
            </div>
        );
    }
}

module.exports = Course;
