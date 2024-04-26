import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, Select, Radio, Spin, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { trans } from '../../../../utils/i18n';

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
        selectTeacherItem: '',
        loadingStatus: false,
    };
    componentDidMount() {
        this.findTeacherList();
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
                            .source,
                    },
                }).then(() => {
                    this.setState({
                        loadingStatus: false,
                    });
                });
            }
        );
    };

    changeSelectTeacher = (item, isSelectedAddLessonTeacher) => {
        if (isSelectedAddLessonTeacher) {
            return;
        }
        this.setState(
            {
                selectTeacherItem: item,
            },
            () => {
                this.addReplaceTeacher();
            }
        );
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

    cancelRightContent = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/setRightContentType',
            payload: '',
        });
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
        dispatch({
            type: 'replace/setRightContentType',
            payload: '',
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

    render() {
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
            <Spin spinning={loadingStatus} wrapperClassName={styles.rightContentWrapper}>
                <div className={styles.searchReplace}>
                    <div className={styles.header}>
                        <Icon
                            className={styles.icon}
                            type="close"
                            onClick={() => this.cancelRightContent()}
                        />
                        <span className={styles.text}>
                            {trans('global.replace.chooseSubstituteTeacher', '选择代课老师')}
                        </span>
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchSubjectOrGrade}>
                                <Select
                                    style={{ width: 120, marginRight: 10 }}
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
                                    style={{ width: 180 }}
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
                            </div>
                            <div className={styles.searchTeacher}></div>
                            <Select
                                style={{ width: 150 }}
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
                                let isSelectedAddLessonTeacher =
                                    this.judgeSelectedAddLessonTeacher(item);
                                return (
                                    <div
                                        className={styles.teacherItem}
                                        style={{
                                            borderColor:
                                                item.teacherId === selectTeacherItem.teacherId
                                                    ? 'rgba(4,69,252,1)'
                                                    : '#fff',
                                        }}
                                    >
                                        <div className={styles.selectTeacher}>
                                            {item.teacherName !== item.teacherEnName ? (
                                                <span>{`${item.teacherName} ${
                                                    item.teacherEnName ? item.teacherEnName : ''
                                                }`}</span>
                                            ) : (
                                                <span>{item.teacherName}</span>
                                            )}
                                        </div>
                                        <div className={styles.middlePart}>
                                            {isSelectedAddLessonTeacher ? (
                                                <div className={styles.disabled}>
                                                    {trans(
                                                        'global.replace.thisLessons',
                                                        '本课节教师'
                                                    )}
                                                </div>
                                            ) : item.conflict ? (
                                                <div className={styles.conflict}>
                                                    {trans('global.replace.haveClasses', '有课')}
                                                </div>
                                            ) : (
                                                <div className={styles.free}>
                                                    {trans('global.replace.noClass', '无课')}
                                                </div>
                                            )}
                                            <Icon
                                                type="calendar"
                                                className={styles.calendarIcon}
                                                onClick={() => this.getTeacherCalendarList(item)}
                                            />
                                        </div>

                                        <div
                                            className={styles.selectBtn}
                                            style={{
                                                pointerEvents: isSelectedAddLessonTeacher
                                                    ? 'none'
                                                    : 'auto',
                                            }}
                                            onClick={() =>
                                                this.changeSelectTeacher(
                                                    item,
                                                    isSelectedAddLessonTeacher
                                                )
                                            }
                                        >
                                            {trans('global.replace.chooseSubstitute', '选TA代课')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
