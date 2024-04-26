//系统排课的编辑
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './editCourse.less';
import icon from '../../../../icon.less';
import {
    Modal,
    Radio,
    Form,
    Input,
    Select,
    Row,
    Col,
    TreeSelect,
    Checkbox,
    message,
    Icon,
    TimePicker,
} from 'antd';
import { intoChineseNumber } from '../../../../utils/utils';
import SelectTeacherAndOrg from '../FreedomCourse/common/selectTeacherAndOrg';
import { trans, locale } from '../../../../utils/i18n';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const week = [
    { id: 1, name: '周一' },
    { id: 2, name: '周二' },
    { id: 3, name: '周三' },
    { id: 4, name: '周四' },
    { id: 5, name: '周五' },
    { id: 6, name: '周六' },
    { id: 7, name: '周七' },
];

@Form.create()
@connect((state) => ({
    studentGroupList: state.course.studentGroupList,
    teacherList: state.course.teacherList,
    areaList: state.timeTable.areaList,
    lastPublicContent: state.timeTable.lastPublicContent,
    // getPublishResultList:state.course.publishResult,
    checkEditResult: state.timeTable.checkEditResult,
    versionList: state.timeTable.versionList,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
}))
export default class EditCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //编辑课节
            studentGroupValue: [], //学生组
            mainTeacherList: [], //主教老师
            assistantTeacher: [], //协同老师

            isNewVersion: false, //是否已发布
            value: false,
            buttonTrue: true,

            roomId: '',
            isShowTip: false,
            changeRoom: false,
            teacherChange: false,
            isOk: true,
            isRoomOk: true,

            timeStatus: false,
        };
    }

    componentDidMount() {
        //获取班级
        this.getStudentGroup();
        //获取场地
        this.getAddressList();
        //是否是最新发布的版本
        this.isLastPublic();
        this.setState({
            mainTeacherList: this.getGroupId(
                this.props.courseDetail && this.props.courseDetail.mainTeachers
            ), // --主教ID
            assistTeacherList: this.getGroupId(
                this.props.courseDetail && this.props.courseDetail.assistantTeachers
            ), // --辅教ID
        });

        //获取调整时间编辑状态
        const {
            courseDetail: {
                startTimeMillion,
                baseDetailStartTimeMillion,
                endTimeMillion,
                baseDetailEndTimeMillion,
                duration,
            },
        } = this.props;
        this.setState({
            timeStatus:
                duration === 2
                    ? false
                    : startTimeMillion !== baseDetailStartTimeMillion ||
                      endTimeMillion !== baseDetailEndTimeMillion
                    ? true
                    : false,
        });
    }

    //是否显示公布
    getPublishResult(props) {
        const { dispatch, cardUtil } = this.props;
        cardUtil &&
            cardUtil.resultId &&
            dispatch({
                type: 'course/getPublishResult',
                payload: {
                    resultType: 2,
                    resultId: cardUtil.resultId,
                },
            });
    }

    //课节信息--获取学生组
    getStudentGroup() {
        const { dispatch, currentVersion, versionList } = this.props;
        let semesterId = versionList.find((item) => item.id === currentVersion)?.semesterId;
        dispatch({
            type: 'course/getStudentGroup',
            payload: {
                grade: '',
                semesterId,
            },
        });
    }

    //获取场地
    getAddressList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getAreaList',
            payload: {},
        });
    }

    //是否是最新发布的版本
    isLastPublic = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                this.setState({
                    isNewVersion: lastPublicContent,
                    value: lastPublicContent,
                });
            },
        });
    };
    // 编辑完成后刷新详情
    refreshDetail = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/lookCourseDetail',
            payload: {
                id: cardUtil.acId,
                type: 2,
            },
        });
    };

    getStr = (list) => {
        let str = '';
        list &&
            list.length > 0 &&
            list.map((item, index) => {
                str = item.name + `${list.length - 1 == index ? '' : '，'}`;
            });
        return str;
    };

    // 系统排课结果的编辑检查老师场地是否冲突
    checkEditResultSchedule = (isPublish, e) => {
        const { dispatch, courseDetail, form } = this.props;
        const { mainTeacherList, assistantTeacher, roomId, timeStatus } = this.state;
        const _this = this;
        dispatch({
            type: 'timeTable/checkEditResultSchedule',
            payload: {
                resultId: courseDetail && courseDetail.id ? courseDetail.id : null, //结果id
                mainTeacherList: this.necessary.state.userIds,
                assistTeacherList: this.unnecessary.state.userIds,
                roomId: roomId
                    ? roomId
                    : this.state.isRoomOk
                    ? courseDetail && courseDetail.roomId
                    : '', // --教室ID
                editStartTime: timeStatus
                    ? moment(form.getFieldValue('startTimeMillion')).valueOf()
                    : courseDetail.startTimeMillion,
                editEndTime: timeStatus
                    ? moment(form.getFieldValue('endTimeMillion')).valueOf()
                    : courseDetail.endTimeMillion,
            },
            onSuccess: (res) => {
                let checkEditResult = { ...res };
                if (checkEditResult && checkEditResult.ifConflict) {
                    Modal.confirm({
                        okText: '确认',
                        cancelText: '取消',
                        icon: '',
                        content: (
                            <div>
                                {this.getStr(checkEditResult.teachers)}
                                {checkEditResult.teachers &&
                                    checkEditResult.teachers.length &&
                                    checkEditResult.rooms &&
                                    checkEditResult.rooms.length &&
                                    '、'}
                                {this.getStr(checkEditResult.rooms)}
                                在该活动时间段内存在冲突，是否确认修改?
                            </div>
                        ),
                        onOk() {
                            _this.handleSubmit(isPublish, e);
                        },
                        onCancel() {},
                    });
                } else {
                    _this.handleSubmit(isPublish, e);
                }
            },
        });
    };

    getLayerClasslistByAcId = (item) => {
        if (item.acId) {
            let domList = Array.from(document.querySelectorAll(`[data-acid='${item.acId}']`));
            return domList.map((item) => Number(item.dataset.studentgroupid));
        } else {
            return [];
        }
    };

    getLayerClasslistByDetailId = (item) => {
        if (item.compareGroupIdList) {
            return item.compareGroupIdList;
        } else return [];
    };

    //提交
    handleSubmit(isPublish, e) {
        e.stopPropagation();
        const {
            dispatch,
            form,
            getClubDataSource,
            hideSystemModal,
            currentVersion,
            showTable,
            courseDetail,
            getshowAcCourseList,
            fetchCourseDetail,
            tableView,
            getLessonViewMsg,
        } = this.props;
        const { timeStatus } = this.state;
        this.setState({
            roomId: '',
        });

        form.validateFields((err, values) => {
            if (!err) {
                let payload = {
                    versionId: currentVersion, //版本id
                    resultId: courseDetail.type === 1 ? courseDetail.id : null, //结果id
                    // mainTeacherList: values.mainTeachers, //主教id
                    // assistTeacherList: values.assistantTeachers, //辅教id
                    mainTeacherList: this.necessary.state.userIds,
                    assistTeacherList: this.unnecessary.state.userIds,
                    roomId: values.playgroundId, //教师id
                    publish: isPublish, //是否发布到日程，false:不发布，true:发布
                    publish: values.publish,
                    noticeIdentities: values.noticeIdentities,
                    acId: courseDetail.acId ? courseDetail.acId : null,
                    changeRange: values.changeRange,
                    editStartTime: timeStatus
                        ? moment(form.getFieldValue('startTimeMillion')).valueOf()
                        : courseDetail.startTimeMillion,
                    editEndTime: timeStatus
                        ? moment(form.getFieldValue('endTimeMillion')).valueOf()
                        : courseDetail.endTimeMillion,
                };
                dispatch({
                    type: 'timeTable/clearCheck',
                });
                dispatch({
                    type: 'timeTable/editSystemCourse',
                    payload: payload,
                    onSuccess: () => {
                        let _this = this;
                        form.resetFields();
                        this.setState({
                            studentGroupValue: [],
                            mainTeacherList: [],
                            assistantTeacher: [],
                            value: false,
                        });
                        typeof hideSystemModal == 'function' &&
                            hideSystemModal.call(this, 'submit');
                        typeof getClubDataSource == 'function' && getClubDataSource.call(this);
                    },
                }).then(() => {
                    this.setState({
                        buttonTrue: true,
                    });
                    // 编辑成功后刷新详情
                    if (courseDetail.type === 1) {
                        // 无resultId为待排课程
                        typeof fetchCourseDetail == 'function' &&
                            fetchCourseDetail(courseDetail.id, 1);
                        const lessonRelateInfo = {
                            sourceGroupIdList: this.getGroupId(courseDetail.studentGroups),
                            sourceMainTeacherIdList: this.necessary.state.userIds.concat(
                                this.getGroupId(courseDetail.mainTeachers)
                            ),
                            sourceAssistantTeacherIdList: this.unnecessary.state.userIds.concat(
                                this.getGroupId(courseDetail.assistantTeachers)
                            ),
                            sourceRoomId: this.getRoomId(values.playgroundId, courseDetail.roomId),

                            targetGroupIdList: [],
                            targetMainTeacherIdList: [],
                            targetAssistantTeacherIdList: [],

                            layerClassIdList: [
                                ...this.getLayerClasslistByAcId(courseDetail),
                                ...this.getLayerClasslistByDetailId(courseDetail),
                            ],
                            flag: Boolean(true),
                        };
                        typeof showTable == 'function' && showTable('编辑保存', lessonRelateInfo);
                        if (tableView === 'weekLessonView') {
                            typeof getLessonViewMsg === 'function' && getLessonViewMsg();
                        }
                    } else {
                        typeof getshowAcCourseList == 'function' && getshowAcCourseList.call(this);
                    }
                });
            } else {
                this.setState({ buttonTrue: true });
            }
        });
    }

    //取消
    handleCancel = (e) => {
        e.stopPropagation();
        this.props.form.resetFields();
        this.setState({
            studentGroupValue: [],
            mainTeacherList: [],
            assistantTeacher: [],
            value: false,
            buttonTrue: true,
        });
        const { hideSystemModal, form } = this.props;
        typeof hideSystemModal == 'function' && hideSystemModal.call(this);
    };

    //选择学生组
    changeStudentGroup = (value) => {
        this.setState({
            studentGroupValue: value,
        });
    };

    //格式化学生组数据
    formatStudentGroup = (groupList) => {
        if (!groupList || groupList.length < 0) return;
        let studentGroup = [];
        groupList.map((item, index) => {
            let obj = {
                title: item.name,
                key: item.type + item.name,
                value: item.type + item.name,
                children: this.formatClassData(item.studentGroupList),
            };
            studentGroup.push(obj);
        });
        return studentGroup;
    };

    //处理子班级
    formatClassData = (classList) => {
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        classList.map((item, index) => {
            let obj = {
                title: item.name,
                key: item.id,
                value: item.id,
            };
            classGroup.push(obj);
        });
        return classGroup;
    };

    //课节信息--获取学生组id&&获取教师id
    getGroupId = (studentGroup) => {
        if (!studentGroup || studentGroup.length <= 0) return [];
        let resultId = [];
        studentGroup.map((item) => {
            resultId.push(item.id);
        });
        return resultId;
    };

    //格式化教师列表
    /* formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return [];
        let teacherResult = [];
        teacherList.map((item, index) => {
            let obj = {
                title: item.name + ' ' + item.englishName,
                key: index,
                value: item.teacherId,
            };
            teacherResult.push(obj);
        });
        return teacherResult;
    }; */

    formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return [];
        let teacherResult = [];
        teacherList.map((item, index) => {
            /* let obj = {
                title: item.name + ' ' + item.englishName,
                key: index,
                value: item.teacherId,
            }; */
            let obj = {
                name: item.name,
                enName: item.englishName,
                orgFlag: false,
                id: item.teacherId,
            };
            teacherResult.push(obj);
        });
        return teacherResult;
    };

    //选择主教老师
    changeMainTeacher = (value) => {
        this.setState({
            mainTeacherList: value,
            teacherChange: true,
        });
    };
    // 阻止冒泡事件
    stop = (e) => {
        e.stopPropagation();
    };
    // 点击保存提交&阻止冒泡事件
    save = (isPublish, e) => {
        e.stopPropagation();
        this.setState({
            isShowTip: false,
        });
        if (this.validateTime()) {
            const { courseDetail } = this.props;
            if (courseDetail.type === 1) {
                // 编辑已排课程需校验冲突
                this.checkEditResultSchedule(isPublish, e);
            } else {
                this.handleSubmit(isPublish, e);
            }
        }
    };

    //选择协同老师
    changeAssistantTeacher = (value) => {
        if (value.length == 0) {
            this.setState({
                isOk: false,
            });
        }
        if (value.length > 0) {
            this.setState({
                isOk: true,
            });
        }

        this.setState({
            assistantTeacher: value,
            teacherChange: true,
        });
    };

    //是否公布
    onChangeGroup = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    roomChange = (value) => {
        if (!value) {
            this.setState({
                isRoomOk: false,
            });
        }
        if (value) {
            this.setState({
                isRoomOk: true,
            });
        }
        this.setState({
            roomId: value,
            changeRoom: true,
        });
    };

    rangeChange = (e) => {
        if (e.target.value == 1) {
            this.setState({
                isShowTip: true,
            });
        } else {
            this.setState({
                isShowTip: false,
            });
        }
    };

    getRoomId = (resId, initialId) => {
        if (initialId && resId) {
            return [initialId, resId];
        }
        if (initialId) {
            return [initialId];
        }
        if (resId) {
            return [resId];
        }
    };

    timeStatusChange = () => {
        const {
            courseDetail: { duration },
        } = this.props;
        if (duration === 2) {
            message.warning('连堂课不允许修改上课时间');
        } else {
            this.setState({
                timeStatus: true,
            });
        }
    };

    validateTime = () => {
        let {
            courseDetail: { baseDetailEndTimeMillion, baseDetailStartTimeMillion },
            form: { getFieldValue },
        } = this.props;
        let startTimeMillion = getFieldValue('startTimeMillion');
        let endTimeMillion = getFieldValue('endTimeMillion');
        console.log('startTimeMillion :>> ', startTimeMillion);
        console.log('endTimeMillion', endTimeMillion);
        if (startTimeMillion > endTimeMillion) {
            message.warning('开始时间不能大于结束时间');
            return false;
        }
        if (
            startTimeMillion > baseDetailEndTimeMillion ||
            endTimeMillion < baseDetailStartTimeMillion
        ) {
            message.warning('结果时间修改范围必须与当前作息明细存在时间交集');
            return false;
        }
        return true;
    };

    render() {
        const {
            cardUtil,
            showEditCourse,
            areaList,
            studentGroupList,
            teacherList,
            form: { getFieldDecorator },
            courseDetail, //系统排课详情
            freeCourseDetail, //自由排课详情
            getPublishResultList,
        } = this.props;

        const {
            isNewVersion,
            value,
            buttonTrue,
            isShowTip,
            teacherChange,
            changeRoom,
            assistantTeacher,
            timeStatus,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };

        const studentGroupProps = {
            treeData: this.formatStudentGroup(studentGroupList),
            placeholder: '选择学生组',
            onChange: this.changeStudentGroup,
            disabled: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            ...treeProps,
        };

        const options = [
            { label: '教师', value: 'employee' },
            { label: '学生', value: 'student' },
            { label: '家长', value: 'parent' },
        ];
        return (
            <div>
                {courseDetail && (
                    <Modal
                        title="编辑课节信息"
                        visible={showEditCourse}
                        onCancel={this.handleCancel}
                        width="800px"
                        footer={null}
                        destroyOnClose={true}
                        key="editCourse"
                    >
                        <Form {...formItemLayout} className={styles.formStyle} onClick={this.stop}>
                            <Form.Item label="课程">
                                {getFieldDecorator('course', {
                                    initialValue: courseDetail.courseName,
                                })(<Input placeholder="请选择课程" disabled={true} />)}
                            </Form.Item>
                            <Form.Item label="分配给">
                                {getFieldDecorator('courseStudentList', {
                                    rules: [{ required: true, message: '请选择学生' }],
                                    initialValue: this.getGroupId(courseDetail.studentGroups),
                                })(<TreeSelect {...studentGroupProps} />)}
                            </Form.Item>
                            <Form.Item label="主教老师" /* required={true} */>
                                {getFieldDecorator('mainTeachers', {
                                    // rules: [{ require: false, message: '请选择主教老师' }],
                                })(
                                    <SelectTeacherAndOrg
                                        placeholder="搜素或选择人员"
                                        treeData={this.formatTeacherList(teacherList)}
                                        onRef={(ref) => {
                                            this.necessary = ref;
                                        }}
                                        // userIds={[31]}
                                        userIds={this.getGroupId(courseDetail.mainTeachers)}
                                        selectType="1"
                                    />
                                )}
                            </Form.Item>

                            <Form.Item label="协同老师">
                                {getFieldDecorator('activeOptionalTeacherList')(
                                    <SelectTeacherAndOrg
                                        placeholder="搜索或选择人员"
                                        treeData={this.formatTeacherList(teacherList)}
                                        onRef={(ref) => {
                                            this.unnecessary = ref;
                                        }}
                                        userIds={this.getGroupId(courseDetail.assistantTeachers)}
                                        selectType="1"
                                    />
                                )}
                            </Form.Item>

                            {cardUtil && cardUtil.type == 1 && cardUtil.resultId ? (
                                <Form.Item label="开始时间">
                                    <Row gutter={4}>
                                        <Col span={6}>
                                            {getFieldDecorator('timeType', {
                                                rules: [{ required: true, message: '请选择类型' }],
                                                initialValue: 'lesson',
                                            })(
                                                <Select style={{ width: 120 }} disabled={true}>
                                                    <Option value="lesson">按节次选择</Option>
                                                </Select>
                                            )}
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item>
                                                {getFieldDecorator('weekDay', {
                                                    rules: [
                                                        { required: true, message: '请选择周次' },
                                                    ],
                                                    initialValue: courseDetail.weekDay,
                                                })(
                                                    <Select
                                                        style={{ width: 120 }}
                                                        placeholder="请选择周次"
                                                        disabled={true}
                                                    >
                                                        {week &&
                                                            week.map((el) => {
                                                                return (
                                                                    <Option
                                                                        value={el.id}
                                                                        key={el.id}
                                                                    >
                                                                        {el.name}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        {!timeStatus && (
                                            <Fragment>
                                                <Col span={6}>
                                                    <Form.Item>
                                                        {getFieldDecorator('lessonNum', {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请选择节次',
                                                                },
                                                            ],
                                                            initialValue: `第${intoChineseNumber(
                                                                courseDetail.lesson
                                                            )}节`,
                                                        })(
                                                            <Input
                                                                placeholder="请选择节次"
                                                                disabled={true}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={this.timeStatusChange}>调整时间</a>
                                                </Col>
                                            </Fragment>
                                        )}

                                        {timeStatus && (
                                            <Fragment>
                                                <Col span={5}>
                                                    <Form.Item>
                                                        {getFieldDecorator('startTimeMillion', {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请选择课程开始时间',
                                                                },
                                                            ],
                                                            initialValue: moment(
                                                                courseDetail.startTimeMillion
                                                            ),
                                                        })(
                                                            <TimePicker
                                                                format="HH:mm"
                                                                disabled={
                                                                    courseDetail.duration === 2
                                                                }
                                                                minuteStep={5}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ textAlign: 'center' }}>
                                                    一
                                                </Col>
                                                <Col span={5}>
                                                    <Form.Item>
                                                        {getFieldDecorator('endTimeMillion', {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请选择课程结束时间',
                                                                },
                                                            ],
                                                            initialValue: moment(
                                                                courseDetail.endTimeMillion
                                                            ),
                                                        })(
                                                            <TimePicker
                                                                format="HH:mm"
                                                                disabled={
                                                                    courseDetail.duration === 2
                                                                }
                                                                minuteStep={5}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Fragment>
                                        )}
                                    </Row>
                                </Form.Item>
                            ) : null}

                            <Form.Item label="地点">
                                {getFieldDecorator('playgroundId', {
                                    rules: [{ required: false, message: '请选择地点' }],
                                    initialValue: courseDetail.roomId,
                                })(
                                    <Select
                                        showSearch
                                        allowClear={true}
                                        optionFilterProp="children"
                                        style={{ width: 250 }}
                                        placeholder="请选择地点"
                                        onChange={this.roomChange}
                                    >
                                        {areaList &&
                                            areaList.length > 0 &&
                                            areaList.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="修改范围">
                                {getFieldDecorator('changeRange', {
                                    rules: [{ required: true, message: '请选择修改范围' }],
                                    initialValue: 0,
                                })(
                                    <Radio.Group onChange={this.rangeChange}>
                                        <Radio value={0}>修改本次</Radio>
                                        <Radio value={1}>修改本次及以后所有</Radio>
                                        {isShowTip && (
                                            <div style={{ width: '580px', lineHeight: '20px' }}>
                                                {' '}
                                                <Icon
                                                    type="info-circle"
                                                    theme="twoTone"
                                                    twoToneColor="#eeb020"
                                                />
                                                修改教师将会联动修改当天及以后相同课程相同班级并且教师相同的排课结果
                                                <br />
                                                &nbsp;&nbsp;&nbsp;修改场地将会联动修改当天及以后相同课程相同班级并且场地相同的排课结果
                                                <br />
                                                &nbsp;&nbsp;&nbsp;修改上课时间将会联动修改当天及以后相同课程相同班级并且时间相同的排课结果
                                            </div>
                                        )}
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            {
                                // getPublishResultList&&
                                cardUtil && cardUtil.type == 1 && cardUtil.resultId ? (
                                    <Form.Item label="是否公布">
                                        {getFieldDecorator('publish', {
                                            rules: [{ required: true, message: '请选择是否公布' }],
                                            initialValue: isNewVersion,
                                        })(
                                            <Radio.Group
                                                onChange={this.onChangeGroup}
                                                disabled={true}
                                            >
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                                <div style={{ width: '580px', lineHeight: '20px' }}>
                                                    <Icon
                                                        type="info-circle"
                                                        theme="twoTone"
                                                        twoToneColor="#eeb020"
                                                    />
                                                    选择“是”操作完成后将立即生效到日程，选择“否”操作完成仅在课表中修改，随后可通过课表公布一起生效到日程。
                                                </div>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                ) : null
                            }
                            {
                                // getPublishResultList&&
                                value && (
                                    <Form.Item label="通知人员">
                                        {getFieldDecorator('noticeIdentities')(
                                            <Checkbox.Group options={options} />
                                        )}
                                    </Form.Item>
                                )
                            }
                        </Form>
                        <Row>
                            <Col offset={4} span={16}>
                                <span
                                    key="cancel"
                                    className={styles.modalBtn + ' ' + styles.cancelBtn}
                                    onClick={this.handleCancel}
                                >
                                    取消
                                </span>
                                {buttonTrue ? (
                                    value ? (
                                        <span
                                            key="confirm"
                                            className={styles.modalBtn + ' ' + styles.submitBtn}
                                            onClick={this.save.bind(this, true)}
                                        >
                                            保存并公布
                                        </span>
                                    ) : (
                                        <span
                                            key="save"
                                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                                            onClick={this.save.bind(this, false)}
                                        >
                                            {trans('global.save', '保存')}
                                        </span>
                                    )
                                ) : (
                                    <span
                                        key="save"
                                        className={styles.modalBtn + ' ' + styles.cancelBtn}
                                        style={{ background: '#999', borderColor: '#999' }}
                                    >
                                        {trans('global.save', '保存')}
                                    </span>
                                )}
                            </Col>
                        </Row>
                    </Modal>
                )}
            </div>
        );
    }
}
