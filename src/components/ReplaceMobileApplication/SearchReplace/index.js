import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, Select, Radio, Spin, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { trans } from '../../../utils/i18n';

const { Option } = Select;
@connect((state) => ({
    teacherList: state.replace.teacherList,
    gradeList: state.replace.gradeList,
    subjectList: state.replace.subjectList,
    addLessonList: state.replace.addLessonList,
    subjectValue: state.replace.subjectValue,
    listAllOrgTeachers: state.replace.listAllOrgTeachers,
    selectedAddLessonItem: state.replace.selectedAddLessonItem,
}))
export default class SearchReplace extends PureComponent {
    state = {
        gradeValue: '',
        teacherValue: '',
        selectTeacherItem: {},
        loadingStatus: false,
    };
    componentDidMount() {
        this.findTeacherList();
        document.title = trans('global.replace.chooseSubstituteTeacher', '选择代课老师');
    }

    findTeacherList = () => {
        const { dispatch, addLessonList, subjectValue } = this.props;
        const { gradeValue, teacherValue } = this.state;
        this.setState(
            {
                loadingStatus: true,
            },
            () => {
                dispatch({
                    type: 'replace/findTeacher',
                    payload: {
                        subjectId: subjectValue,
                        gradeIdList: gradeValue,
                        teacherId: teacherValue,
                        scheduleResultOutputModel: addLessonList.find((item) => item.isSelected)
                            ?.source,
                    },
                }).then(() => {
                    this.setState({
                        loadingStatus: false,
                    });
                });
            }
        );
    };

    changeSelectTeacher = (item) => {
        const { selectTeacherItem } = this.state;
        if (selectTeacherItem.teacherId === item.teacherId) {
            this.setState({
                selectTeacherItem: {},
            });
        } else {
            this.setState({
                selectTeacherItem: item,
            });
        }
    };

    changeGradeValue = (value) => {
        this.setState(
            {
                gradeValue: value,
            },
            () => {
                this.findTeacherList();
            }
        );
    };

    changeSubjectValue = async (value) => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'replace/setSubjectValue',
            payload: value,
        });
        this.findTeacherList();
    };

    changeTeacherValue = (value) => {
        this.setState(
            {
                teacherValue: value,
            },
            () => {
                this.findTeacherList();
            }
        );
    };

    addReplaceTeacher = () => {
        const { dispatch, addLessonList } = this.props;
        const { selectTeacherItem } = this.state;
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonList.map((item) => {
                if (item.isSelected) {
                    return {
                        ...item,
                        selectTeacherItem,
                    };
                } else {
                    return item;
                }
            }),
        });
    };

    //代课教师列表中，禁选所操作课节的教师
    judgeSelectedAddLessonTeacher = (teacherItem) => {
        const { selectedAddLessonItem } = this.props;
        return selectedAddLessonItem.source?.mainTeachers
            .map((item) => item.id)
            .includes(teacherItem.teacherId);
    };

    getTeacherCalendarList = (teacherItem) => {
        const { dispatch, changeCalendarModalVisible, selectedAddLessonItem } = this.props;
        dispatch({
            type: 'replace/getTeacherCalendarList',
            payload: {
                queryStartTime: moment(selectedAddLessonItem.source.startTimeMillion)
                    .startOf('isoWeek')
                    .valueOf(),
                queryEndTime: moment(selectedAddLessonItem.source.startTimeMillion)
                    .endOf('isoWeek')
                    .valueOf(),
                teacherIds: [teacherItem.teacherId],
            },
        });
        dispatch({
            type: 'replace/setSelectedTeacherItem',
            payload: {
                id: teacherItem.teacherId,
                name: teacherItem.teacherName,
                englishName: teacherItem.teacherEnName,
            },
        });
        changeCalendarModalVisible && changeCalendarModalVisible();
    };

    cancelSubmit = () => {
        const { history } = this.props;
        history.push('/replace/mobile/application/index');
    };

    confirmSubmit = () => {
        const { history } = this.props;
        this.addReplaceTeacher();
        history.push('/replace/mobile/application/index');
    };

    render() {
        console.log('this.props.addLessonList :>> ', this.props.addLessonList);
        const {
            teacherList,
            gradeList,
            subjectList,
            subjectValue,
            listAllOrgTeachers,
            currentLang,
        } = this.props;
        const { selectTeacherItem, loadingStatus } = this.state;
        return (
            <Spin spinning={loadingStatus}>
                <div className={styles.searchReplace}>
                    <div className={styles.mainContent}>
                        <div className={styles.searchWrapper}>
                            <Select
                                className={styles.selectItem}
                                showArrow={true}
                                placeholder="搜索学科"
                                onChange={this.changeSubjectValue}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                                value={subjectValue}
                            >
                                {subjectList.map((item) => (
                                    <Option value={item.id}>
                                        {currentLang === 'cn' ? item.name : item.ename}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                className={styles.selectItem}
                                showArrow={true}
                                placeholder={trans('global.replace.search.grades', '搜索年级')}
                                onChange={this.changeGradeValue}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                mode="multiple"
                                allowClear
                                maxTagCount={1}
                            >
                                {gradeList.map((item) => (
                                    <Option value={item.id}>
                                        {currentLang === 'cn' ? item.orgName : item.orgEname}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                className={styles.selectItem}
                                placeholder={trans('global.replace.search.teachers', '搜索教师')}
                                onChange={this.changeTeacherValue}
                                showArrow={true}
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    return (
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    );
                                }}
                                showSearch
                                allowClear
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.teacherList}>
                            {teacherList.map((item) => {
                                //是否是当前选择的教师
                                let isSelectedAddLessonTeacher =
                                    this.judgeSelectedAddLessonTeacher(item);
                                let middlePartObj = isSelectedAddLessonTeacher
                                    ? {
                                          color: '#bfbfbf',
                                          text: trans('global.replace.thisLessons', '本课节教师'),
                                      }
                                    : item.conflict
                                    ? {
                                          color: '#e02020',
                                          text: trans('global.replace.haveClasses', '有课'),
                                      }
                                    : {
                                          color: '#30bd07',
                                          text: trans('global.replace.noClass', '无课'),
                                      };
                                return (
                                    <div
                                        className={styles.teacherItem}
                                        onClick={() => this.changeSelectTeacher(item)}
                                    >
                                        <div className={styles.leftPart}>
                                            <Checkbox
                                                disabled={isSelectedAddLessonTeacher}
                                                checked={
                                                    selectTeacherItem.teacherId ===
                                                        item.teacherId &&
                                                    !isSelectedAddLessonTeacher
                                                }
                                            />
                                            <span>
                                                {currentLang === 'cn'
                                                    ? item.teacherName
                                                    : item.teacherEnName}
                                            </span>
                                        </div>

                                        <div className={styles.middlePart}>
                                            <div
                                                className={styles.icon}
                                                style={{ backgroundColor: middlePartObj.color }}
                                            ></div>
                                            <div style={{ color: middlePartObj.color }}>
                                                {middlePartObj.text}
                                            </div>
                                        </div>
                                        <div className={styles.rightPart}>
                                            <Icon
                                                type="calendar"
                                                onClick={() => this.getTeacherCalendarList(item)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.searchReplaceBtnWrapper}>
                        <div className={styles.searchReplaceBtn}>
                            <span className={styles.cancelBtn} onClick={this.cancelSubmit}>
                                {trans('global.replace.cancel', '取消')}
                            </span>
                            <span className={styles.submitBtn} onClick={this.confirmSubmit}>
                                {trans('global.replace.chooseSubstitute', '选TA代课')}
                            </span>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
