import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import {
    Tabs,
    Input,
    TreeSelect,
    Radio,
    Select,
    Spin,
    Switch,
    Modal,
    Popover,
    Checkbox,
    Row,
    Col,
    message,
    Icon,
} from 'antd';
import icon from '../../../../../icon.less';
import { trans, locale } from '../../../../../utils/i18n';
import {
    differenceWith,
    isEqual,
    flatten,
    flattenDeep,
    forEach,
    isEmpty,
    uniq,
    uniqWith,
    orderBy,
} from 'lodash';
import { intoChineseLang } from '../../../../../utils/utils';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    courseAllList: state.rules.courseAllList, //版本下的课程
    coursePackageEditItem: state.rules.coursePackageEditItem,
    coursePackageList: state.rules.coursePackageList,
    editRuleInformation: state.rules.oneRuleInformation, //编辑列表详情
    coursePackageMergeGroupList: state.rules.coursePackageMergeGroupList,
    listCourseGroup: state.rules.listCourseGroup,
    gradeList: state.time.gradeList,
    newClassGroupList: state.rules.newClassGroupList[0]
        ? state.rules.newClassGroupList[0].gradeStudentGroupModels
        : [], //版本内-学生组
    courseAcList: state.rules.courseAcList,
    scheduleDetail: state.rules.scheduleDetail,
}))
export default class CoursePackage extends PureComponent {
    state = {
        saveLoading: false,
        activeKey: '', //8:单双周 9:常规课包 10:自定义
        showOrEdit: 'show', //show：展示状态 firstEdit：第一个编辑页面 confirmEdit: 确认编辑页面
        editId: undefined,
        chooseIndexList: [],
        hasMergedList: [],
        dropdownVisible: false,
        getListCourseGroupPayload: {
            groupKeywords: '',
            courseKeywords: '',
            gradeIdString: '',
        },
        selectCourseDropdownVisible: false,
        getCourseAcListPayload: {
            courseIdList: [],
            studentGroupIdList: [],
        },
        dropdownCourseList: [],
        dropdownStudentGroupList: [],
        selectedAcList: [],
        customCoursePackageList: [],
        customCoursePackageAcIdList: [],
        sessionMsg: undefined,
        editCoursePackageItemIndex: '',
    };

    componentDidMount() {
        const { tabs } = this.props;
        this.setState(
            {
                activeKey: tabs && tabs[0].id,
            },
            () => {
                this.getCoursePackageList();
                this.getCourseAllList();
                this.hideDropdown();
                this.getNewClassGroupList();
                this.getScheduleDetail();
            }
        );
    }

    //获得周节信息
    getScheduleDetail = () => {
        const { dispatch, getScheduleId } = this.props;
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: getScheduleId(),
            },
        });
    };

    //获取课程列表
    getCourseAllList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/courseAllList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //获取行政班
    getNewClassGroupList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/newClassGroupList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //获取课程打包规则列表
    getCoursePackageList = () => {
        const { dispatch, currentVersion, selfId } = this.props;
        const { activeKey } = this.state;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                baseRuleId: selfId,
                ruleObjectRelationType: activeKey,
            },
        });
    };

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

    //格式化行政班
    formatStudentGroup = (groupList) => {
        if (!groupList || groupList.length < 0) return;
        let studentGroup = [];
        groupList.map((item, index) => {
            let obj = {
                title: item.name,
                key: item.gradeId + item.name,
                value: item.gradeId + item.name,
                children: this.formatClassData(item.studentGroupList),
            };
            studentGroup.push(obj);
        });
        return studentGroup;
    };

    //处理班级
    formatClassData = (classList) => {
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        classList.map((item) => {
            let obj = {
                title: item.name,
                key: item.id,
                value: item.id,
            };
            classGroup.push(obj);
        });
        return classGroup;
    };

    addRules = () => {
        this.setState({
            showOrEdit: 'firstEdit',
        });
        this.initialData();
    };

    changeCourse = async (selectCourse, label) => {
        const { dispatch, coursePackageEditItem } = this.props;
        await dispatch({
            type: 'rules/setCoursePackageEditItem',
            payload: {
                ...coursePackageEditItem,
                selectCourse,
                remark: `【单双周】${label.join('、')}`,
            },
        });
    };

    changeCoursePackageEditItem = (type, value) => {
        const { dispatch, coursePackageEditItem } = this.props;
        dispatch({
            type: 'rules/setCoursePackageEditItem',
            payload: {
                ...coursePackageEditItem,
                [type]: value,
            },
        });
    };

    getCoursePackageEditHtml = () => {
        const {
            coursePackageEditItem,
            coursePackageList,
            newClassGroupList,
            courseAcList,
            scheduleDetail,
        } = this.props;
        const {
            showOrEdit,
            activeKey,
            selectCourseDropdownVisible,
            dropdownCourseList,
            dropdownStudentGroupList,
            selectedAcList,
            customCoursePackageList,
            customCoursePackageAcIdList,
            sessionMsg,
            editCoursePackageItemIndex,
        } = this.state;

        console.log('editCoursePackageItemIndex :>> ', editCoursePackageItemIndex);

        // 选择课班与关联行政班出现条件
        // 1. 单双周-分层选修班 2.常规走班 3.自定义课节
        const showSelectCourseGroup =
            (activeKey == 8 && coursePackageEditItem.coursePackageType === 2) ||
            activeKey === 9 ||
            activeKey === 10;
        const courseTreeProps = {
            treeData: this.formatCourseData(),
            value: coursePackageEditItem.selectCourse,
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
        const studentGroupTreeProps = {
            treeData: this.formatStudentGroup(newClassGroupList),
            value: coursePackageEditItem.courseGroupAdminGroupIdList,
            placeholder: '请选择关联行政班',
            onChange: (value) =>
                this.changeCoursePackageEditItem('courseGroupAdminGroupIdList', value),
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
        return (
            <div className={styles.coursePackageEdit}>
                <div className={styles.item}>
                    <span className={styles.name}>课包名称</span>
                    <Input
                        placeholder="请输入"
                        onChange={(e) => this.changeCoursePackageEditItem('title', e.target.value)}
                        value={coursePackageEditItem.title}
                    />
                </div>
                {activeKey === 8 && (
                    <div className={styles.item}>
                        <span className={styles.name}>打包方式</span>
                        <Radio.Group
                            onChange={(e) =>
                                this.changeCoursePackageEditItem(
                                    'coursePackageType',
                                    e.target.value
                                )
                            }
                            value={coursePackageEditItem.coursePackageType}
                        >
                            <Radio value={1}>行政班/平行班</Radio>
                            <Radio value={2}>分层班/选修班</Radio>
                        </Radio.Group>
                    </div>
                )}

                {activeKey === 8 && coursePackageEditItem.coursePackageType === 1 && (
                    <div className={styles.item}>
                        <span className={styles.name}>选择课程</span>
                        <TreeSelect {...courseTreeProps} />
                    </div>
                )}

                {showSelectCourseGroup && (
                    <div className={styles.item}>
                        <span
                            className={styles.name}
                            style={{ alignSelf: 'flex-start', marginTop: 8 }}
                        >
                            选择课班
                        </span>
                        {this.getListCourseGroupHtml()}
                    </div>
                )}

                {showSelectCourseGroup && (
                    <div className={styles.item}>
                        <span
                            className={styles.name}
                            style={{
                                whiteSpace: 'normal',
                                marginRight: -4,
                                alignSelf: 'flex-start',
                            }}
                        >
                            关联行政班
                        </span>
                        <TreeSelect {...studentGroupTreeProps} />
                    </div>
                )}

                {activeKey === 8 && coursePackageEditItem.coursePackageType === 2 && (
                    <div className={styles.item}>
                        <span className={styles.name}>指定节次</span>
                        <Select
                            style={{ width: 110 }}
                            placeholder="请选择"
                            onChange={this.changeSelectSession}
                            value={sessionMsg}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                            }
                        >
                            {scheduleDetail.map((item, index) => {
                                return (
                                    item &&
                                    item.length &&
                                    item.map((el, ind) => {
                                        return (
                                            <Option
                                                key={`${el.weekDay}-${el.sort}`}
                                                value={`${el.weekDay}-${el.sort}`}
                                            >
                                                {`周${intoChineseLang(el.weekDay)}第${el.sort}节`}
                                            </Option>
                                        );
                                    })
                                );
                            })}
                        </Select>
                    </div>
                )}

                {showOrEdit === 'confirmEdit' && (
                    <span className={styles.coursePackageList}>
                        {activeKey === 10 ? (
                            <Fragment>
                                <span className={styles.title}>
                                    <span className={styles.leftPart}>
                                        <span className={styles.text}>
                                            设置课包并选择包含的课节
                                        </span>
                                    </span>
                                    <span className={styles.rightPart}>
                                        <span
                                            className={styles.generate}
                                            onClick={this.addCustomCoursePackage}
                                        >
                                            添加课包
                                        </span>
                                    </span>
                                </span>
                                {selectCourseDropdownVisible && (
                                    <div
                                        onClick={this.selectCourseMaskClick}
                                        className={styles.maskContainer}
                                    ></div>
                                )}
                                {selectCourseDropdownVisible && (
                                    <div className={styles.selectCourseDropdown}>
                                        <div
                                            className={styles.dropdownWrapper}
                                            style={{ width: 414 }}
                                        >
                                            <div
                                                className={styles.dropdownHeader}
                                                style={{ justifyContent: 'normal' }}
                                            >
                                                <Select
                                                    placeholder="选择课程"
                                                    className={styles.flexItem}
                                                    mode="multiple"
                                                    maxTagCount={0}
                                                    showArrow
                                                    allowClear
                                                    onChange={(value) =>
                                                        this.getCourseAcListPayloadChange(
                                                            'courseIdList',
                                                            value
                                                        )
                                                    }
                                                >
                                                    {dropdownCourseList &&
                                                        dropdownCourseList.map((item) => {
                                                            return (
                                                                <Option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.name}
                                                                </Option>
                                                            );
                                                        })}
                                                </Select>
                                                <Select
                                                    placeholder="选择班级"
                                                    className={styles.flexItem}
                                                    mode="multiple"
                                                    maxTagCount={0}
                                                    showArrow
                                                    allowClear
                                                    onChange={(value) =>
                                                        this.getCourseAcListPayloadChange(
                                                            'studentGroupIdList',
                                                            value
                                                        )
                                                    }
                                                >
                                                    {dropdownStudentGroupList &&
                                                        dropdownStudentGroupList.map((item) => {
                                                            return (
                                                                <Option
                                                                    key={item.studentGroupId}
                                                                    value={item.studentGroupId}
                                                                >
                                                                    {item.name}
                                                                </Option>
                                                            );
                                                        })}
                                                </Select>
                                            </div>
                                            <div className={styles.dropdownContent}>
                                                {courseAcList.map((groupItem) =>
                                                    groupItem.activityModelList.map(
                                                        (courseItem) => (
                                                            <div
                                                                key={courseItem.activityId}
                                                                className={styles.listItem}
                                                            >
                                                                <Checkbox
                                                                    checked={selectedAcList
                                                                        .map(
                                                                            (courseItem) =>
                                                                                courseItem.activityId
                                                                        )
                                                                        .includes(
                                                                            courseItem.activityId
                                                                        )}
                                                                    onChange={(e) =>
                                                                        this.customCourseCheckChange(
                                                                            e,
                                                                            courseItem
                                                                        )
                                                                    }
                                                                    disabled={this.getDisabledStatus(
                                                                        courseItem
                                                                    )}
                                                                >
                                                                    {courseItem.activityName}
                                                                </Checkbox>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </div>
                                            <div className={styles.dropdownBottom}>
                                                <div></div>
                                                <div
                                                    className={styles.confirmBtn}
                                                    onClick={this.confirmSelectCustomCoursePackage}
                                                >
                                                    确定
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {customCoursePackageList.map((item, coursePackageIndex) => (
                                    <div
                                        className={styles.coursePackageItem}
                                        onClick={() =>
                                            this.editCoursePackageItem(item, coursePackageIndex)
                                        }
                                    >
                                        <div className={styles.header}>
                                            <div className={styles.topTriangle}></div>
                                            <div
                                                className={styles.middleRectangle}
                                                style={{
                                                    height: `${28 * item.length}px`,
                                                }}
                                            >
                                                <span>课包{coursePackageIndex + 1}</span>
                                            </div>
                                            <div className={styles.bottomTriangle}></div>
                                        </div>
                                        <div className={styles.contentWrapper}>
                                            <div className={styles.content}>
                                                {item.map((courseItem, courseIndex) => (
                                                    <span className={styles.courseItem}>
                                                        <span>{courseItem.activityName}</span>
                                                        <Icon
                                                            type="close"
                                                            className={styles.courseCloseIcon}
                                                            onClick={(e) =>
                                                                this.deleteCustom(
                                                                    e,
                                                                    'course',
                                                                    coursePackageIndex,
                                                                    courseIndex
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Icon
                                            type="close-circle"
                                            theme="filled"
                                            className={styles.coursePackageItemCloseIcon}
                                            onClick={(e) =>
                                                this.deleteCustom(
                                                    e,
                                                    'coursePackage',
                                                    coursePackageIndex
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <span className={styles.title}>
                                    <span className={styles.leftPart}>
                                        <span className={styles.text}>
                                            根据所选课程，共生成 {coursePackageList.length} 个课包
                                        </span>
                                        {activeKey === 8 &&
                                            coursePackageEditItem.coursePackageType === 1 && (
                                                <span
                                                    className={styles.generate}
                                                    onClick={this.uploadCoursePackageDetail}
                                                >
                                                    刷新课包详情
                                                </span>
                                            )}
                                    </span>
                                    <span className={styles.rightPart}>
                                        {activeKey === 8 &&
                                            coursePackageEditItem.coursePackageType === 1 && (
                                                <Popover
                                                    placement="bottomRight"
                                                    content={this.getMergeGroupContent()}
                                                    overlayClassName={
                                                        styles.mergeGroupContentWrapper
                                                    }
                                                    onVisibleChange={this.popoverVisibleChange}
                                                >
                                                    <span className={styles.rightPart}>
                                                        合并课包
                                                    </span>
                                                </Popover>
                                            )}
                                        {((activeKey === 8 &&
                                            coursePackageEditItem.coursePackageType === 2) ||
                                            activeKey === 9) && (
                                            <span
                                                className={styles.generate}
                                                onClick={this.uploadCoursePackageDetail}
                                            >
                                                重新生成课包
                                            </span>
                                        )}
                                    </span>
                                </span>
                                {coursePackageList.map((item, index) => (
                                    <div className={styles.coursePackageItem}>
                                        <div className={styles.header}>
                                            <div className={styles.topTriangle}></div>
                                            <div
                                                className={styles.middleRectangle}
                                                style={{
                                                    height: `${
                                                        25 *
                                                        (item.singleCourseMessageList.length +
                                                            item.doubleCourseMessageList.length)
                                                    }px`,
                                                }}
                                            >
                                                <span>课包{index + 1}</span>
                                            </div>
                                            <div className={styles.bottomTriangle}></div>
                                        </div>
                                        <div className={styles.contentWrapper}>
                                            <div className={styles.content}>
                                                {item.singleCourseMessageList.map((text) => (
                                                    <span>{text}</span>
                                                ))}
                                                {item.doubleCourseMessageList.map((text) => (
                                                    <span>{text}</span>
                                                ))}
                                            </div>
                                            {item.mergeGroupList?.length > 1 && (
                                                <div
                                                    className={styles.cancelMerge}
                                                    onClick={() =>
                                                        this.cancelMergeItem(item.mergeGroupList)
                                                    }
                                                >
                                                    取消合并
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </Fragment>
                        )}
                    </span>
                )}
                <div className={styles.btnList}>
                    {showOrEdit === 'firstEdit' && (
                        <span className={styles.confirm} onClick={this.nextClick}>
                            下一步
                        </span>
                    )}
                    {showOrEdit === 'confirmEdit' && (
                        <span className={styles.confirm} onClick={this.confirmClick}>
                            确认保存
                        </span>
                    )}
                    <span className={styles.cancel} onClick={this.cancelClick}>
                        取消
                    </span>
                </div>
            </div>
        );
    };

    nextClick = () => {
        const { coursePackageEditItem } = this.props;
        const { activeKey } = this.state;
        this.setState({
            showOrEdit: 'confirmEdit',
            selectedAcList: [],
            customCoursePackageList: [],
            customCoursePackageAcIdList: [],
        });

        //只有单双周行政班才请求合班接口
        if (activeKey === 8 && coursePackageEditItem.coursePackageType === 1) {
            this.getCoursePackageMergeGroupList();
        }
        if (activeKey === 8 || activeKey === 9) {
            this.getCoursePackageMessage();
        }
    };

    //新建与编辑确认
    confirmClick = () => {
        const {
            dispatch,
            currentVersion,
            coursePackageEditItem,
            selfId,
            getRuleCount,
            getAddRules,
            showTable,
        } = this.props;
        const { editId, activeKey, customCoursePackageList, sessionMsg } = this.state;
        if (!this.validator()) {
            return;
        }
        let dispatchType = editId ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        this.setState({
            saveLoading: true,
        });
        let acRuleFilterParamInputMode = {};
        if (activeKey == 8) {
            if (coursePackageEditItem.coursePackageType === 1) {
                acRuleFilterParamInputMode = {
                    ruleObjectType: 8,
                    coursePackageType: 1,
                    coursePackageCourseIdList: coursePackageEditItem.selectCourse,
                    coursePackageMergeGroupIdList: this.getHasMergedIdList(),
                };
            }
            if (coursePackageEditItem.coursePackageType === 2) {
                acRuleFilterParamInputMode = {
                    coursePackageType: 2,
                    ruleObjectType: 8,
                    courseGroupDTOList: coursePackageEditItem.courseGroupDTOList,
                    courseGroupAdminGroupIdList: coursePackageEditItem.courseGroupAdminGroupIdList,
                    electiveClassCoursePackageRuleWeekDay: Number(sessionMsg.split('-')[0]),
                    electiveClassCoursePackageRuleCourseSort: Number(sessionMsg.split('-')[1]),
                };
            }
        }
        if (activeKey == 9) {
            acRuleFilterParamInputMode = {
                ruleObjectType: 9,
                courseGroupDTOList: coursePackageEditItem.courseGroupDTOList,
                courseGroupAdminGroupIdList: coursePackageEditItem.courseGroupAdminGroupIdList,
            };
        }
        if (activeKey == 10) {
            acRuleFilterParamInputMode = {
                ruleObjectType: 10,
                courseGroupDTOList: coursePackageEditItem.courseGroupDTOList,
                courseGroupAdminGroupIdList: coursePackageEditItem.courseGroupAdminGroupIdList,
                coursePackageAcIdList: customCoursePackageList.map((coursePackageItem) =>
                    coursePackageItem.map((courseItem) => courseItem.activityId)
                ),
                coursePackageAcList: [...customCoursePackageList],
            };
        }
        dispatch({
            type: dispatchType,
            payload: {
                id: editId,
                acRuleFilterParamInputModelList: [{ ...acRuleFilterParamInputMode }],
                baseRuleId: selfId,
                title: coursePackageEditItem.title,
                versionId: currentVersion,
                weightPercentage: 100,
                remark: coursePackageEditItem.remark,
            },
        }).then(() => {
            this.setState({
                saveLoading: false,
                hasMergedList: [],
            });
            this.cancelClick();
            this.getCoursePackageList();
            //规则统计
            if (!editId) {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //统计数量
                typeof getRuleCount == 'function' && getRuleCount.call(this);
            }
            //如果是单双周-分层班/选修班，刷新课表
            if (activeKey == 8 && coursePackageEditItem.coursePackageType === 2) {
                typeof showTable == 'function' && showTable.call(this);
            }
        });
    };

    cancelClick = () => {
        const { dispatch } = this.props;
        this.setState({
            showOrEdit: 'show',
            editId: undefined,
        });
        dispatch({
            type: 'rules/setCoursePackageEditItem',
            payload: {
                title: '',
                selectCourse: [],
                remark: '',
                courseGroupDTOList: [],
                courseGroupAdminGroupIdList: [],
                sessionMsg: undefined,
            },
        });
        dispatch({
            type: 'rules/setCoursePackageList',
            payload: [],
        });
    };

    //课包列表
    getCoursePackageMessage = (coursePackageMergeGroupIdList) => {
        const { dispatch, currentVersion, coursePackageEditItem, coursePackageList } = this.props;
        const { activeKey } = this.state;
        let getCoursePackageListPayload = {};
        if (activeKey == 8) {
            if (coursePackageEditItem.coursePackageType === 1) {
                getCoursePackageListPayload = {
                    ruleObjectType: 8,
                    coursePackageType: 1,
                    courseIdList: coursePackageEditItem.selectCourse,
                    coursePackageMergeGroupList: this.getHasMergedIdList(
                        coursePackageMergeGroupIdList
                    ),
                };
            }
            if (coursePackageEditItem.coursePackageType === 2) {
                getCoursePackageListPayload = {
                    ruleObjectType: 8,
                    coursePackageType: 2,
                    courseGroupDTOList: coursePackageEditItem.courseGroupDTOList,
                };
            }
        }
        if (activeKey == 9) {
            getCoursePackageListPayload = {
                ruleObjectType: 9,
                courseGroupDTOList: coursePackageEditItem.courseGroupDTOList,
            };
        }

        return dispatch({
            type: 'rules/getCoursePackageMessage',
            payload: {
                versionId: currentVersion,
                ...getCoursePackageListPayload,
            },
        }).then(() => {
            const { coursePackageList } = this.props;
            let hasMergedListCopy = [];
            coursePackageList.forEach((item) => {
                if (!isEmpty(item.mergeGroupList)) {
                    hasMergedListCopy.push(item.mergeGroupList);
                }
            });
            this.setState({
                hasMergedList: hasMergedListCopy,
            });
        });
    };

    uploadCoursePackageDetail = async () => {
        this.setState({
            saveLoading: true,
        });
        await this.getCoursePackageMessage();
        this.setState({
            saveLoading: false,
        });
    };

    validator = () => {
        const { coursePackageList } = this.props;
        const { activeKey, customCoursePackageList } = this.state;
        if (activeKey === 8 || activeKey === 9) {
            if (isEmpty(coursePackageList)) {
                message.error('未生成课包');
                return false;
            }
        }
        if (activeKey === 10) {
            if (isEmpty(customCoursePackageList)) {
                message.error('未生成课包');
                return false;
            }
        }
        return true;
    };

    editCoursePackageRules = (id) => {
        const { dispatch } = this.props;
        this.setState({
            editId: id,
            saveLoading: true,
        });
        this.initialData();
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id,
            },
        }).then(async () => {
            const { editRuleInformation, currentVersion } = this.props;
            const { activeKey } = this.state;
            let acRuleFilterParamInputModel = editRuleInformation.acRuleFilterParamInputModelList[0]
                ? editRuleInformation.acRuleFilterParamInputModelList[0]
                : {};
            this.setState({
                showOrEdit: 'confirmEdit',
                sessionMsg: `${acRuleFilterParamInputModel.electiveClassCoursePackageRuleWeekDay}-${acRuleFilterParamInputModel.electiveClassCoursePackageRuleCourseSort}`,
            });
            await dispatch({
                type: 'rules/setCoursePackageEditItem',
                payload: {
                    title: editRuleInformation.title,
                    selectCourse: acRuleFilterParamInputModel.coursePackageCourseIdList,
                    remark: editRuleInformation.remark,
                    coursePackageType: acRuleFilterParamInputModel.coursePackageType,
                    courseGroupDTOList: acRuleFilterParamInputModel.courseGroupDTOList,
                    courseGroupAdminGroupIdList:
                        acRuleFilterParamInputModel.courseGroupAdminGroupIdList,
                },
            });
            //只有单双周行政班才请求合班接口
            if (activeKey === 8 && acRuleFilterParamInputModel.coursePackageType === 1) {
                this.getCoursePackageMergeGroupList();
            }
            if (activeKey === 8 || activeKey === 9) {
                this.getCoursePackageMessage(
                    acRuleFilterParamInputModel.coursePackageMergeGroupIdList
                );
            }
            if (activeKey === 10) {
                this.setState({
                    customCoursePackageList: acRuleFilterParamInputModel.coursePackageAcList,
                    customCoursePackageAcIdList: flatten(
                        acRuleFilterParamInputModel.coursePackageAcIdList
                    ),
                });
            }

            this.setState({
                saveLoading: false,
            });
        });
    };

    deleteCoursePackageRules = (id) => {
        let self = this;
        Modal.confirm({
            title: '您确定要删除该规则吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                self.confirmDelete(id);
            },
        });
    };

    //确认删除
    confirmDelete = (id) => {
        const { dispatch, getAddRules, getRuleCount } = this.props;
        dispatch({
            type: 'rules/ruleToDelete',
            payload: {
                id: id,
            },
            onSuccess: () => {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //统计数量
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                this.getCoursePackageList();
            },
        });
    };

    //设置按钮状态
    switchButtonOpen = (checked, id) => {
        const { dispatch, getAddRules, currentKey } = this.props;
        let type = checked ? 'rules/rulesEnable' : 'rules/rulesDisables';
        //规则启用与禁用
        dispatch({
            type: type,
            payload: {
                weekRuleId: id,
            },
            onSuccess: () => {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                this.getCoursePackageList();
            },
        });
    };

    getCoursePackageMergeGroupList = () => {
        const { dispatch, currentVersion, coursePackageEditItem } = this.props;
        this.setState({
            chooseIndexList: [],
            hasMergedList: [],
        });
        return dispatch({
            type: 'rules/getCoursePackageMergeGroupList',
            payload: {
                versionId: currentVersion,
                courseIdString: coursePackageEditItem.selectCourse.join(','),
            },
        });
    };

    getNotMergedList = () => {
        const { coursePackageMergeGroupList } = this.props;
        const { hasMergedList } = this.state;

        //先压缩hasMergedList数组，
        //不重复的数组为coursePackageMergeGroupList与flattenHasMergedList不重叠的部分
        let flattenHasMergedList = flatten(hasMergedList);
        return differenceWith(coursePackageMergeGroupList, flattenHasMergedList, isEqual);
    };

    getMergeGroupContent = () => {
        const { coursePackageMergeGroupList } = this.props;
        const { hasMergedList, chooseIndexList } = this.state;
        let notMergedList = this.getNotMergedList();
        return (
            <div className={styles.mergeGroupContent}>
                <Checkbox.Group onChange={this.mergeGroupCheckBoxChange} value={chooseIndexList}>
                    <Row type="flex" justify="start">
                        {notMergedList.map((item, index) => (
                            <Col span={item.length > 1 ? 12 : 8}>
                                <Checkbox value={index}>
                                    {item
                                        .map((studentGroupItem) => studentGroupItem.name)
                                        .join(' ')}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
                {!isEmpty(notMergedList) && (
                    <div
                        onClick={() => this.clickToMerge(notMergedList)}
                        className={styles.mergeBtn}
                    >
                        合并
                    </div>
                )}

                <div className={styles.hasMergedContent}>
                    <span className={styles.contentTitle}>已合并</span>
                    {hasMergedList.length > 0
                        ? hasMergedList.map((mergeItem, index) => (
                              <div className={styles.hasMergedItem}>
                                  <span className={styles.text}>
                                      {flattenDeep(mergeItem)
                                          .map((item) => item.name)
                                          .join(' ')}
                                  </span>
                                  <span
                                      className={styles.cancelMerge}
                                      onClick={() => this.cancelMergeList(index)}
                                  >
                                      取消合并
                                  </span>
                              </div>
                          ))
                        : '无'}
                </div>
            </div>
        );
    };

    mergeGroupCheckBoxChange = (value) => {
        this.setState({
            chooseIndexList: value,
        });
    };

    clickToMerge = (notMergedList) => {
        const { hasMergedList, chooseIndexList } = this.state;
        let getChooseList = () => {
            let res = [];
            chooseIndexList.forEach((indexItem) => {
                res.push(notMergedList[indexItem]);
            });
            return res;
        };

        this.setState(
            {
                hasMergedList: [...hasMergedList, getChooseList()],
            },
            () => {
                this.setState({
                    chooseIndexList: [],
                });
                this.getCoursePackageMessage();
            }
        );
    };

    cancelMergeList = (deleteIndex) => {
        const { hasMergedList } = this.state;
        this.setState(
            {
                hasMergedList: hasMergedList.toSpliced(deleteIndex, 1),
            },
            () => {
                this.getCoursePackageMessage();
            }
        );
    };

    cancelMergeItem = (mergeGroupList) => {
        const { hasMergedList } = this.state;
        this.setState(
            {
                hasMergedList: hasMergedList.filter((item) => !isEqual(item, mergeGroupList)),
            },
            () => {
                this.getCoursePackageMessage();
            }
        );
    };

    popoverVisibleChange = () => {
        this.setState({
            chooseIndexList: [],
        });
    };

    getHasMergedIdList = (coursePackageMergeGroupIdList) => {
        if (isEmpty(coursePackageMergeGroupIdList)) {
            const { hasMergedList } = this.state;
            return hasMergedList.map((mergeItem) => {
                return mergeItem.map((groupList) => {
                    return groupList.map((item) => item.studentGroupId).join(',');
                });
            });
        } else {
            return coursePackageMergeGroupIdList;
        }
    };

    changeTabs = (activeKey) => {
        this.setState(
            {
                activeKey: Number(activeKey),
            },
            () => {
                this.getCoursePackageList();
                this.cancelClick();
            }
        );
    };

    getRuleTipsHtml = () => {
        const { activeKey } = this.state;
        return (
            <div className={styles.ruleTips}>
                <p>
                    规则说明：每个课程包在排课时视为一个课，不再考虑课包里面冲突问题，包括教师、场地、班级；
                    设置在原课程上的排课规则仍然有效； 关闭课包，不影响已经排好的课表
                </p>
            </div>
        );
    };

    getCoursePackageRuleList = () => {
        const { ruleListOfTypes } = this.props;
        return ruleListOfTypes.map((item) => (
            <div className={styles.coursePackageRuleItem}>
                <div className={styles.topPart}>
                    <Switch
                        size="small"
                        checked={item.status === 1}
                        onChange={(checked) => this.switchButtonOpen(checked, item.id)}
                    />
                    <span className={styles.topText}>{item.title}</span>
                </div>
                <div className={styles.bottomPart}>
                    <span className={styles.bottomText}>{item.remark}</span>
                    <span className={styles.iconList}>
                        <i
                            className={icon.iconfont}
                            onClick={() => this.editCoursePackageRules(item.id)}
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            &#xe63b;
                        </i>
                        <i
                            className={icon.iconfont}
                            onClick={() => this.deleteCoursePackageRules(item.id)}
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            &#xe739;
                        </i>
                    </span>
                </div>
            </div>
        ));
    };

    getListCourseGroupHtml = () => {
        const {
            listCourseGroup,
            gradeList,
            coursePackageEditItem: { courseGroupDTOList },
        } = this.props;
        const { dropdownVisible } = this.state;
        let courseGroupDTOIdList = !isEmpty(courseGroupDTOList)
            ? courseGroupDTOList.map((item) => item.showkey)
            : [];
        return (
            <div className={styles.selectCourseGroupWrapper}>
                <Select
                    mode="multiple"
                    placeholder="选择课班"
                    style={{ width: 346 }}
                    dropdownMenuStyle={{ display: 'none' }}
                    onFocus={() => this.changeDropdownVisible(true)}
                    value={courseGroupDTOIdList}
                    onChange={this.courseGroupSelectChange}
                >
                    {listCourseGroup.map((item) => (
                        <Option key={item.showkey} value={item.showkey}>
                            {`${item.courseOutputModel.name}-${item.studentGroupModel
                                .map((item) => item.name)
                                .join('-')}`}
                        </Option>
                    ))}
                </Select>
                {dropdownVisible && (
                    <div
                        onClick={this.selectCourseGroupMaskClick}
                        className={styles.maskContainer}
                    ></div>
                )}
                {dropdownVisible && (
                    <div className={styles.dropdownWrapper}>
                        <div className={styles.dropdownHeader}>
                            <Select
                                placeholder="选择年级"
                                className={styles.flexItem}
                                mode="multiple"
                                maxTagCount={0}
                                showArrow
                                allowClear
                                onChange={(value) =>
                                    this.getListCourseGroupPayloadChange(
                                        'gradeIdString',
                                        value.join(',')
                                    )
                                }
                            >
                                {gradeList &&
                                    gradeList.map((item) => {
                                        return (
                                            <Option key={item.id} value={item.id}>
                                                {locale() !== 'en' ? item.orgName : item.orgEname}
                                            </Option>
                                        );
                                    })}
                            </Select>
                            <Search
                                placeholder="搜索课程"
                                className={styles.flexItem}
                                onSearch={(value) =>
                                    this.getListCourseGroupPayloadChange('courseKeywords', value)
                                }
                            />
                            <Search
                                placeholder="搜索班级"
                                className={styles.flexItem}
                                onSearch={(value) =>
                                    this.getListCourseGroupPayloadChange('groupKeywords', value)
                                }
                            />
                        </div>
                        <div className={styles.dropdownContent}>
                            {listCourseGroup.map((item) => (
                                <div key={item.showkey} className={styles.listItem}>
                                    <Checkbox
                                        checked={courseGroupDTOIdList.includes(item.showkey)}
                                        onChange={(e) => this.courseGroupCheckChange(e, item)}
                                    >{`${item.courseOutputModel.name}-${item.studentGroupModel
                                        .map((item) => item.name)
                                        .join('-')}`}</Checkbox>
                                </div>
                            ))}
                        </div>
                        <div className={styles.dropdownBottom}>
                            <div className={styles.listItem}>
                                <Checkbox onChange={this.selectAllCourseGroup} />
                                <span>全选</span>
                            </div>
                            <div
                                className={styles.confirmBtn}
                                onClick={this.confirmSelectCourseGroup}
                            >
                                确定
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    getListCourseGroup = () => {
        const { dispatch, currentVersion } = this.props;
        const { getListCourseGroupPayload } = this.state;
        dispatch({
            type: 'rules/getListCourseGroup',
            payload: {
                versionId: currentVersion,
                ...getListCourseGroupPayload,
            },
        });
    };

    getListCourseGroupPayloadChange = (type, value) => {
        const { getListCourseGroupPayload } = this.state;
        this.setState(
            {
                getListCourseGroupPayload: {
                    ...getListCourseGroupPayload,
                    [type]: value,
                },
            },
            () => {
                this.getListCourseGroup();
            }
        );
    };

    changeDropdownVisible = (dropdownVisible) => {
        this.setState({
            dropdownVisible,
        });
    };

    confirmSelectCustomCoursePackage = () => {
        const { selectedAcList, customCoursePackageList, editCoursePackageItemIndex } = this.state;
        this.toggleSelectCourseDropdownVisible();
        if (editCoursePackageItemIndex === '') {
            this.setState({
                customCoursePackageList: [...customCoursePackageList, selectedAcList],
            });
        } else {
            let customCoursePackageListCopy = [...customCoursePackageList];
            customCoursePackageListCopy[editCoursePackageItemIndex] = [...selectedAcList];
            this.setState({
                customCoursePackageList: [...customCoursePackageListCopy],
            });
        }
        this.setState({
            selectedAcList: [],
            editCoursePackageItemIndex: '',
        });
    };

    confirmSelectCourseGroup = () => {
        this.hideDropdown();
    };

    courseGroupCheckChange = async (e, courseGroupItem) => {
        const { dispatch, coursePackageEditItem } = this.props;
        let checked = e.target.checked;
        if (checked) {
            await dispatch({
                type: 'rules/setCoursePackageEditItem',
                payload: {
                    ...coursePackageEditItem,
                    courseGroupDTOList: [
                        ...coursePackageEditItem.courseGroupDTOList,
                        courseGroupItem,
                    ],
                },
            });
        } else {
            await dispatch({
                type: 'rules/setCoursePackageEditItem',
                payload: {
                    ...coursePackageEditItem,
                    courseGroupDTOList: coursePackageEditItem.courseGroupDTOList.filter(
                        (item) => item.showkey !== courseGroupItem.showkey
                    ),
                },
            });
        }
        await this.setCourseGroupRemark();
    };

    courseGroupSelectChange = async (value) => {
        const { dispatch, coursePackageEditItem, listCourseGroup } = this.props;
        await dispatch({
            type: 'rules/setCoursePackageEditItem',
            payload: {
                ...coursePackageEditItem,
                courseGroupDTOList: value.map((id) =>
                    listCourseGroup.find((item) => item.showkey === id)
                ),
            },
        });
        await this.setCourseGroupRemark();
    };

    selectAllCourseGroup = (e) => {
        const { dispatch, coursePackageEditItem, listCourseGroup } = this.props;
        let checked = e.target.checked;
        if (checked) {
            dispatch({
                type: 'rules/setCoursePackageEditItem',
                payload: {
                    ...coursePackageEditItem,
                    courseGroupDTOList: [...listCourseGroup],
                },
            });
        } else {
            dispatch({
                type: 'rules/setCoursePackageEditItem',
                payload: {
                    ...coursePackageEditItem,
                    courseGroupDTOList: [],
                },
            });
        }
    };

    hideDropdown = () => {
        this.setState({
            dropdownVisible: false,
        });
    };

    initialData = () => {
        const { dispatch } = this.props;

        //重置课班列表
        this.setState(
            {
                groupKeywords: '',
                courseKeywords: '',
                gradeIdString: '',
                sessionMsg: undefined,
            },
            () => {
                this.getListCourseGroup();
            }
        );
    };

    setCourseGroupRemark = () => {
        const { dispatch, coursePackageEditItem } = this.props;
        const { activeKey } = this.state;
        return dispatch({
            type: 'rules/setCoursePackageEditItem',
            payload: {
                ...coursePackageEditItem,
                remark: `【${
                    activeKey === 8 ? '单双周' : activeKey === 9 ? '常规课班' : '自定义'
                }】${uniq(
                    coursePackageEditItem.courseGroupDTOList.map(
                        (item) => item.courseOutputModel.name
                    )
                ).join('、')}`,
            },
        });
    };

    toggleSelectCourseDropdownVisible = () => {
        const { selectCourseDropdownVisible } = this.state;
        this.setState({
            selectCourseDropdownVisible: !selectCourseDropdownVisible,
            getCourseAcListPayload: {
                courseIdList: [],
                studentGroupIdList: [],
            },
        });
    };

    getCourseAcListPayloadChange = (type, value) => {
        const { getCourseAcListPayload } = this.state;
        this.setState(
            {
                getCourseAcListPayload: {
                    ...getCourseAcListPayload,
                    [type]: value,
                },
            },
            () => {
                this.getCourseAcList();
            }
        );
    };

    getCourseAcList = () => {
        const { dispatch, currentVersion } = this.props;
        const { getCourseAcListPayload } = this.state;
        return dispatch({
            type: 'rules/courseAcList',
            payload: {
                versionId: currentVersion,
                ...getCourseAcListPayload,
            },
        });
    };

    addCustomCoursePackage = () => {
        const {
            dispatch,
            currentVersion,
            coursePackageEditItem: { courseGroupDTOList },
        } = this.props;

        const { customCoursePackageList } = this.state;

        //uniqWith 去重
        //flatten 降维
        //orderBy 排序
        //isEqual 对比
        this.setState(
            {
                dropdownCourseList: uniqWith(
                    courseGroupDTOList.map((item) => item.courseOutputModel),
                    isEqual
                ),
                dropdownStudentGroupList: orderBy(
                    uniqWith(
                        flatten(courseGroupDTOList.map((item) => item.studentGroupModel)),
                        isEqual
                    ),
                    'studentGroupId'
                ),
                customCoursePackageAcIdList: flatten(
                    customCoursePackageList.map((coursePackageItem) =>
                        coursePackageItem.map((courseItem) => courseItem.activityId)
                    )
                ),
            },
            () => {
                const { dropdownStudentGroupList, dropdownCourseList } = this.state;
                dispatch({
                    type: 'rules/courseAcList',
                    payload: {
                        versionId: currentVersion,
                        studentGroupIdList: dropdownStudentGroupList.map(
                            (item) => item.studentGroupId
                        ),
                        courseIdList: dropdownCourseList.map((item) => item.id),
                    },
                });
            }
        );
        this.toggleSelectCourseDropdownVisible();
    };

    customCourseCheckChange = (e, courseItem) => {
        const { selectedAcList } = this.state;
        let checked = e.target.checked;
        if (checked) {
            this.setState({
                selectedAcList: [...selectedAcList, courseItem],
            });
        } else {
            this.setState({
                selectedAcList: selectedAcList.filter(
                    (item) => item.activityId !== courseItem.activityId
                ),
            });
        }
    };

    deleteCustom = (e, deleteType, coursePackageIndex, courseIndex) => {
        e.stopPropagation();
        const { customCoursePackageList } = this.state;
        if (deleteType === 'coursePackage') {
            this.setState({
                customCoursePackageList: customCoursePackageList.filter(
                    (item, index) => index !== coursePackageIndex
                ),
            });
        }
        if (deleteType === 'course') {
            this.setState({
                customCoursePackageList: customCoursePackageList.map(
                    (customCoursePackageItem, index) => {
                        if (index === coursePackageIndex) {
                            return customCoursePackageItem.filter(
                                (item, itemIndex) => itemIndex !== courseIndex
                            );
                        } else {
                            return [...customCoursePackageItem];
                        }
                    }
                ),
            });
        }
    };

    selectCourseGroupMaskClick = () => {
        this.hideDropdown();
    };

    selectCourseMaskClick = () => {
        this.toggleSelectCourseDropdownVisible();
        this.setState({
            selectedAcList: [],
            editCoursePackageItemIndex: '',
        });
    };

    changeSelectSession = (value) => {
        this.setState({
            sessionMsg: value,
        });
    };

    editCoursePackageItem = (item, coursePackageIndex) => {
        console.log('editCoursePackageItem');
        console.log('item :>> ', item);
        this.setState(
            {
                selectedAcList: [...item],
                editCoursePackageItemIndex: coursePackageIndex,
            },
            () => {
                this.addCustomCoursePackage();
            }
        );
    };

    getDisabledStatus = (courseItem) => {
        const {
            editCoursePackageItemIndex,
            customCoursePackageAcIdList,
            selectedAcList,
            customCoursePackageList,
        } = this.state;

        //editCoursePackageItemIndex 为空，代表是添加课包状态，否则是编辑单个课节状态
        if (editCoursePackageItemIndex === '') {
            return customCoursePackageAcIdList.includes(courseItem.activityId);
        } else {
            let editIdList = customCoursePackageList[editCoursePackageItemIndex].map(
                (item) => item.activityId
            );
            return (
                !editIdList.includes(courseItem.activityId) &&
                customCoursePackageAcIdList.includes(courseItem.activityId)
            );
        }
    };

    render() {
        const { tabs } = this.props;
        const { activeKey, saveLoading, selectCourse, showOrEdit } = this.state;

        return (
            <Spin spinning={saveLoading} tip="loading...">
                <div className={styles.coursePackage}>
                    <Tabs
                        tabPosition="top"
                        activeKey={String(activeKey)}
                        onChange={this.changeTabs}
                    >
                        {tabs &&
                            tabs.length > 0 &&
                            tabs.map((item, index) => {
                                return (
                                    <TabPane
                                        tab={`${item.name}（${item.amount}）`}
                                        key={`${item.id}`}
                                    >
                                        <div className={styles.ruleContainer}>
                                            {this.getRuleTipsHtml()}
                                            {showOrEdit === 'show' ? (
                                                <div
                                                    className={styles.addPlus}
                                                    onClick={this.addRules}
                                                    style={{ marginTop: 30 }}
                                                >
                                                    <i className={icon.iconfont}>&#xe75a;</i>
                                                </div>
                                            ) : (
                                                this.getCoursePackageEditHtml()
                                            )}

                                            <div className={styles.showAddedRules}>
                                                <div className={styles.searchCondition}>
                                                    <p className={styles.addRulesTitle}>
                                                        {trans('global.Rules Added', '已添加规则')}
                                                    </p>
                                                </div>
                                                <div className={styles.coursePackageRuleList}>
                                                    {this.getCoursePackageRuleList()}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                );
                            })}
                    </Tabs>
                </div>
            </Spin>
        );
    }
}
