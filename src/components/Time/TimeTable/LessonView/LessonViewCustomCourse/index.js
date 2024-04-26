import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { locale, trans } from '../../../../../utils/i18n';
import { Dropdown, Menu, TreeSelect, Icon, message, Select } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import icon from '../../../../../icon.less';
import { flattenDeep, isEmpty } from 'lodash';
import SelectTeacherAndOrg from '../../FreedomCourse/common/selectTeacherAndOrg';

const { Option } = Select;

@connect((state) => ({
    newClassGroupList: state.rules.newClassGroupList[0]
        ? state.rules.newClassGroupList[0].gradeStudentGroupModels
        : [], //版本内-学生组
    lessonViewCustomValue: state.lessonView.lessonViewCustomValue,
    lessonViewCustomLabel: state.lessonView.lessonViewCustomLabel,
    customCourseSearchIndex: state.lessonView.customCourseSearchIndex,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    gradeList: state.time.gradeList,
    customStudentList: state.timeTable.customStudentList,
    areaList: state.timeTable.areaList,

    studentViewGroupList: state.lessonView.studentViewGroupList,
    studentViewStudentList: state.lessonView.studentViewStudentList,
    searchParameters: state.lessonView.searchParameters,

    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化
}))
export default class LessonViewCustomCourse extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            labelDownVisible: false,
            valueDownVisible: false,
            searchList:
                locale() === 'en'
                    ? ['Class', 'Grade', 'Student', 'Teacher', 'Address']
                    : ['班级', '年级', '学生', '教师', '场地'],
            studentViewSelectGrade: [],
        };
    }

    handleLabelVisibleChange = (labelDownVisible) => {
        this.setState({
            labelDownVisible,
        });
    };

    handleValueVisibleChange = (valueDownVisible) => {
        this.setState({
            valueDownVisible,
        });
    };

    switchType = async (e) => {
        const { dispatch } = this.props;
        const { searchList } = this.state;
        this.setState({
            labelDownVisible: false,
        });
        this.changeLessonViewTimeTableWrapperWidth();

        await dispatch({
            type: 'lessonView/clearMainSchedule',
        });

        if (e.key == 3) {
            this.changeTeacher([]);
        }

        if (e.key == 4) {
            this.changeAddress([]);
        }

        if (e.key != 0) {
            dispatch({
                type: 'lessonView/setSideBarVisible',
                payload: 'addSideBar',
            });
        }

        dispatch({
            type: 'lessonView/setCustomCourseSearchIndex',
            payload: e.key,
        });
    };

    getCustomValueMenu = () => {
        const {
            newClassGroupList,
            lessonViewCustomValue,
            lessonViewCustomLabel,
            gradeList,
            areaList,
            fetchTeacherAndOrg,
            customStudentList,
            customCourseSearchIndex,
            studentViewGradeList,
            studentViewGroupList,
            studentViewStudentList,
            searchParameters: {
                gradeValue,
                studentValue: { studentViewStudentValue, studentViewGroupValue },
                addressValue,
                teacherValue,
            },
        } = this.props;
        const {} = this.state;
        if (customCourseSearchIndex == 0) {
            const studentGroupProps = {
                style: {
                    width: '150px',
                },
                treeData: this.formatStudentGroup(newClassGroupList),
                onChange: this.changeGroup,
                dropdownStyle: {
                    maxHeight: 400,
                    overflow: 'auto',
                },
                treeNodeFilterProp: 'title',
                treeCheckable: true,
                maxTagCount: 0,
                value: lessonViewCustomValue,
                showSearch: true,
            };

            return <TreeSelect {...studentGroupProps} />;
        }
        if (customCourseSearchIndex == 1) {
            return (
                <Select
                    // value={gradeValue}
                    placeholder="搜索年级"
                    className={styles.searchTeacher}
                    onChange={this.changeGrade}
                    optionFilterProp="children"
                    showSearch={true}
                    value={gradeValue}
                >
                    {gradeList &&
                        gradeList.length > 0 &&
                        gradeList.map((item) => {
                            return (
                                <Option value={item.id} key={item.id} title={item.orgName}>
                                    {item.orgName}
                                </Option>
                            );
                        })}
                </Select>
            );
        }
        if (customCourseSearchIndex == 2) {
            const { gradeByTypeArr } = this.props;
            const treeProps = {
                treeNodeFilterProp: 'title',
                treeCheckable: true,
                treeNodeFilterProp: 'title',
            };
            let renderTagPlaceholder = (omittedValues) => {
                let len = omittedValues && omittedValues.length;
                return <em className={styles.omittedStyle}>+ {len}</em>;
            };
            const studentGroupProps = {
                treeData: gradeByTypeArr,
                value: studentViewGroupValue,
                placeholder: trans('course.plan.class', '全部班级'),
                onChange: this.searchStudentChangeGroup,
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
                maxTagPlaceholder: (omittedValues) => renderTagPlaceholder(omittedValues),
                ...treeProps,
            };
            return (
                <div className={styles.studentViewSelect}>
                    <TreeSelect {...studentGroupProps} style={{ width: '180px' }} />
                    <Select
                        mode="multiple"
                        placeholder={trans('global.searchStudents', '搜索选择学生')}
                        onChange={this.changeStudent}
                        optionFilterProp="children"
                        style={{ width: 100 }}
                        value={studentViewStudentValue}
                    >
                        {studentViewStudentList &&
                            studentViewStudentList.length > 0 &&
                            studentViewStudentList.map((item) => {
                                return (
                                    <Option value={item.id} key={item.id} title={item.name}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                </div>
            );
        }
        if (customCourseSearchIndex == 3) {
            return (
                <div className={styles.teacherViewSelect}>
                    <SelectTeacherAndOrg
                        placeholder="请选择老师"
                        treeData={fetchTeacherAndOrg}
                        onRef={(ref) => {
                            this.necessary = ref;
                        }}
                        selectType="1"
                        changeTeacher={this.changeTeacher}
                        source="lessonView"
                    />
                </div>
            );
        }
        if (customCourseSearchIndex == 4) {
            return (
                <Select
                    placeholder="搜索场地"
                    className={styles.searchTeacher}
                    onChange={this.changeAddress}
                    optionFilterProp="children"
                    // showArrow={false}
                    showSearch={true}
                    mode="multiple"
                    value={addressValue}
                    style={{ width: 150 }}
                >
                    {areaList &&
                        areaList.length > 0 &&
                        areaList.map((item) => {
                            return (
                                <Option value={item.id} key={item.id} title={item.name}>
                                    {item.name}
                                </Option>
                            );
                        })}
                </Select>
            );
        }
    };

    changeGroup = async (value, label) => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'lessonView/changeLessonViewCustomValue',
            payload: value,
        });
        dispatch({
            type: 'lessonView/changeLessonViewCustomLabel',
            payload: label ? label : [],
        });

        await dispatch({
            type: 'lessonView/changeLessonViewTableLoading',
            payload: true,
        });
        await this.setCustomTableRowCountBySelectValue(value);

        if (!isEmpty(value)) {
            await dispatch({
                type: 'lessonView/getScheduleDataByStudentGroup',
                payload: {
                    id: currentVersion,
                    groupIds: value,
                    isFirstScreenLoading: false,
                },
            });
            await Promise.all(
                value.map((item) =>
                    dispatch({
                        type: 'lessonView/getClassScheduleACList',
                        payload: {
                            versionId: currentVersion,
                            adminGroupIdString: item,
                            type: 'table',
                        },
                    })
                )
            );
        }

        await dispatch({
            type: 'lessonView/changeLessonViewTableLoading',
            payload: false,
        });

        dispatch({
            type: 'lessonView/changeLessonViewExchangeCourseStatus',
            payload: false,
        });
    };

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

    selectPreviousOrNextClass = (type) => {
        const { newClassGroupList, getCustomResult, lessonViewCustomValue } = this.props;
        let flattenList = flattenDeep(
            newClassGroupList.map((gradeItem) => {
                let res = [];
                gradeItem.studentGroupList.forEach((groupIem) => {
                    res.push({ value: groupIem.id, label: groupIem.name });
                });
                return res;
            })
        );
        let targetIndex = flattenList.findIndex((item) => item.value == lessonViewCustomValue[0]);
        if (targetIndex === 0 && type === 'previous') {
            message.warning('向前没有班级');
            return;
        }
        if (targetIndex === flattenList.length - 1 && type === 'next') {
            message.warning('向后没有班级');
            return;
        }
        if (type === 'previous') {
            let { value, label } = flattenList[targetIndex - 1];
            this.changeGroup([value], [label]);
        }
        if (type === 'next') {
            let { value, label } = flattenList[targetIndex + 1];

            this.changeGroup([value], [label]);
        }
    };

    changeGrade = (value) => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'lessonView/findMainSchedule',
            payload: {
                id: currentVersion,
                gradeIdList: value,
                view: 'grade',
                courseIds: [],
            },
        });
        dispatch({
            type: 'lessonView/setSearchParameters',
            payload: {
                gradeValue: value,
                studentValue: {
                    studentViewStudentValue: [],
                    studentViewGroupValue: [],
                },
                addressValue: [],
                teacherValue: [],
            },
        });
    };

    changeStudent = async (value, source) => {
        const { dispatch, currentVersion } = this.props;
        const {
            searchParameters: { studentValue },
        } = this.props;

        await this.setCustomTableRowCountBySelectValue(value);
        if (isEmpty(value)) {
            await dispatch({
                type: 'lessonView/setSearchParameters',
                payload: {
                    gradeValue: [],
                    studentValue: {
                        ...studentValue,
                        studentViewStudentValue: source === 'group' ? [] : value,
                    },
                    addressValue: [],
                    teacherValue: [],
                },
            });
            return;
        }
        await dispatch({
            type: 'lessonView/findMainSchedule',
            payload: {
                id: currentVersion,
                studentIds: value,
                view: 'student',
            },
        });
        await dispatch({
            type: 'lessonView/setSearchParameters',
            payload: {
                gradeValue: [],
                studentValue: {
                    ...studentValue,
                    studentViewStudentValue: source === 'group' ? [] : value,
                },
                addressValue: [],
                teacherValue: [],
            },
        });
    };

    changeAddress = async (value) => {
        const { dispatch, currentVersion } = this.props;

        //如果value值为空数组，请求全部教师，并且rowCount设置为3
        await this.setCustomTableRowCountBySelectValue(!isEmpty(value) ? value : [1, 2, 3]);
        await dispatch({
            type: 'lessonView/findMainSchedule',
            payload: {
                id: currentVersion,
                playgroundIds: value,
                view: 'address',
            },
        });
        await dispatch({
            type: 'lessonView/setSearchParameters',
            payload: {
                gradeValue: [],
                studentValue: {
                    studentViewStudentValue: [],
                    studentViewGroupValue: [],
                },
                addressValue: value,
                teacherValue: [],
            },
        });
    };

    changeTeacher = async (value) => {
        const { dispatch, currentVersion } = this.props;

        //如果value值为空数组，请求全部教师，并且rowCount设置为3
        await this.setCustomTableRowCountBySelectValue(!isEmpty(value) ? value : [1, 2, 3]);
        await dispatch({
            type: 'lessonView/findMainSchedule',
            payload: {
                id: currentVersion,
                teacherIds: value,
                view: 'teacher',
            },
        });
        await dispatch({
            type: 'lessonView/setSearchParameters',
            payload: {
                gradeValue: [],
                studentValue: {
                    studentViewStudentValue: [],
                    studentViewGroupValue: [],
                },
                addressValue: [],
                teacherValue: value,
            },
        });
    };

    changeLessonViewTimeTableWrapperWidth = () => {
        let lessonViewTimeTableWrapperEle = document.getElementById('lessonViewTimeTableWrapper');
        let referenceScheduleWrapperEleWidth = document.getElementById('referenceScheduleWrapper')
            .style.width;
        lessonViewTimeTableWrapperEle.style.width = `calc(96vw - ${referenceScheduleWrapperEleWidth})`;
    };

    searchStudentChangeGroup = async (value) => {
        const {
            dispatch,
            currentVersion,
            searchParameters: { studentValue },
        } = this.props;
        const { studentViewSelectGrade } = this.state;
        if (!isEmpty(value)) {
            await dispatch({
                type: 'lessonView/getStudentViewStudentList',
                payload: {
                    gradeIds: studentViewSelectGrade,
                    versionId: currentVersion,
                    groupIds: value,
                },
            });
            const { studentViewStudentList } = this.props;
            console.log('studentViewStudentList :>> ', studentViewStudentList);
            await this.changeStudent(
                studentViewStudentList.map((item) => item.id),
                'group'
            );
            dispatch({
                type: 'lessonView/setSearchParameters',
                payload: {
                    gradeValue: [],
                    studentValue: {
                        ...studentValue,
                        studentViewGroupValue: value,
                    },
                    addressValue: [],
                    teacherValue: [],
                },
            });
        } else {
            dispatch({
                type: 'lessonView/setSearchParameters',
                payload: {
                    gradeValue: [],
                    studentValue: {
                        studentViewStudentValue: [],
                        studentViewGroupValue: [],
                    },
                    addressValue: [],
                    teacherValue: [],
                },
            });
        }
    };

    setCustomTableRowCountBySelectValue = (value) => {
        const { dispatch } = this.props;
        let calculateRowCount = (value) => {
            if (isEmpty(value)) return 1;
            if (value.length === 1) return 1;
            if (value.length === 2) return 2;
            if (value.length >= 3) return 3;
        };
        return dispatch({
            type: 'lessonView/setCustomTableRowCount',
            payload: calculateRowCount(value),
        });
    };

    render() {
        const { customCourseSearchIndex } = this.props;
        const { labelDownVisible, searchList, valueDownVisible } = this.state;
        const { lessonViewCustomValue, lessonViewCustomLabel } = this.props;
        return (
            <div className={styles.lessonViewCustomCourse}>
                <div className={styles.customLabelWrapper}>
                    <Dropdown
                        visible={labelDownVisible}
                        trigger={['click']}
                        // visible={true}
                        onVisibleChange={this.handleLabelVisibleChange}
                        overlay={
                            <Menu
                                onClick={this.switchType}
                                selectedKeys={[customCourseSearchIndex]}
                            >
                                {searchList.map((el, i) => {
                                    if (i == 1) {
                                        return;
                                    } else {
                                        return (
                                            <Menu.Item key={i} label={el}>
                                                <span className={styles.menuItem}>{el}</span>
                                            </Menu.Item>
                                        );
                                    }
                                })}
                            </Menu>
                        }
                    >
                        <div>
                            <span>{searchList[customCourseSearchIndex]}</span>
                            <i className={icon.iconfont}>&#xe682;</i>
                        </div>
                    </Dropdown>
                </div>
                <div className={styles.customValueWrapper}>
                    {customCourseSearchIndex == 0 && (
                        <div className={styles.tagPlaceholder}>
                            {lessonViewCustomLabel.length === 0
                                ? ''
                                : lessonViewCustomLabel.length === 1
                                ? lessonViewCustomLabel[0]
                                : `${lessonViewCustomLabel.length}个班级`}
                            <span className={styles.close} onClick={() => this.changeGroup([])}>
                                <Icon
                                    type="close-circle"
                                    theme="filled"
                                    style={{ color: '#bbb' }}
                                />
                            </span>
                        </div>
                    )}
                    {this.getCustomValueMenu()}
                </div>
                {((lessonViewCustomValue.length === 1 && customCourseSearchIndex == '0') ||
                    customCourseSearchIndex == '1') && (
                    <div className={styles.arrow}>
                        <LeftCircleOutlined
                            onClick={() => this.selectPreviousOrNextClass('previous')}
                        />
                        <RightCircleOutlined
                            onClick={() => this.selectPreviousOrNextClass('next')}
                        />
                    </div>
                )}
            </div>
        );
    }
}
