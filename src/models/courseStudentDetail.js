import { loginRedirect, loginRedirectWeide } from '../utils/utils';
import { message } from 'antd';
import {
    getListCourse,
    submittedCourse,
    getSchedule,
    getCourseStartPeriod,
    getSubjectList,
    getComplateSchedule, // 完整课表
    getSelectionQuarter,
    getStudentListCourse,
    deleteSelectedCourses,
    submitSelectedCourse,
    getCancelAndSignUp,
    getStudentCourseDetails,
    getCourseMessage,
    grabSignUp,
    optionalMargin,
    getSchoolTime,
    getListCourseNew,
    optionalMarginNew,
    getAllCourse,
    getSubjectListNew,
    saveInformation,
    getInformation,
    getUserAccountBindInformation,
    sendMessageCode,
    checkMessageCode,
    updatePassword,
    unbindOtherAccount,
    unbindWeChat,
    fetchParentChildList,
    getStudentListCourseNew,
    // fetchParentChildList,
    cancelPay,
} from '../services/courseStudentDetail';

export default {
    namespace: 'studentDetail',
    state: {
        courseList: [],
        selectedList: [],
        deleteItem: '',
        submitedCourseList: '',
        scheduleList: [],
        courseStartPeriodList: [],
        subjectList: [],
        checkedItem: '',
        detailScheduleInfo: [],
        timeStageContent: '',
        studentCourseList: [],
        deleteResult: '',
        submitResult: '',
        cancelAndSignUpResult: '',
        studentCourseDetailContent: '',
        courseIntroduction: '',
        optionalMargin: [],
        grabMsg: '',
        changeStatus: '',
        schoolList: [],
        isNeedOpen: false,
        information: {}, //个人信息
        bindInformation: {}, //绑定个人信息
        ifLogout: null,
        planMsg: JSON.parse(localStorage.getItem('planMsgH5')),
        parentChildList: [],
    },
    effects: {
        // 课程介绍
        *getParentChildList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(fetchParentChildList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setParentChildList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 存储所选选课计划
        *setPlanMsg({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setPlanMsgReducer',
                payload,
            });
        },
        // 课程介绍
        *getCourseMessage({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseMessage, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseIntroduce',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 学生端选课计划课程详情
        *getStudentCourseDetails({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getStudentCourseDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 已选课程删除，报名，取消报名
        *getCancelAndSignUp({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCancelAndSignUp, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'cancelAndSignUp',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 提交已选课程
        *submitSelectedCourse({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(submitSelectedCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'submitCourse',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *cancelPay({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(cancelPay, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 删除已选课程
        *deleteSelectedCourses({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(deleteSelectedCourses, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'deleteCourse',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 学生端--选课计划列表
        *getStudentListCourse({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getStudentListCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getStudentListCourseNew({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getStudentListCourseNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 查看学生选课结果-时间分段
        *getSelectionQuarter({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getSelectionQuarter, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'stage',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 完整课表
        *getComplateSchedule({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getComplateSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'complateSchedule',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSubjectList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getSubjectList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'subject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSubjectListNew({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getSubjectListNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'subject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSchoolTimeList({ payload }, { call, put }) {
            const response = yield call(getSchoolTime, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'time',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCourseStartPeriod({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseStartPeriod, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'coursePeriod',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSchedule({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'schedule',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submittedCourse({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(submittedCourse, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'submited',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getListCourse({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getListCourse, payload);
            //搜索不存在的课程时，服务端没有返回content导致白屏，前端模拟空数据结构
            const tempStructure = {
                continueCourseList:[],
                courseOutList:[],
                total: 0
            };
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'detail',
                        payload: response.content || tempStructure,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                // console.log('/api/choose/courseList')
                loginRedirect();
            }
        },
        *getListCourseNew({ payload, onFail }, { call, put }) {
            //获取club列表数据
            // debugger;
            const response = yield call(getListCourseNew, payload);
            // debugger;
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'detail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                // console.log('/api/choose/courseList')
                // loginRedirect();
                onFail();
            }
        },
        *grabSignUp({ payload, onSuccess, onFail }, { call, put }) {
            //获取club列表数据
            const response = yield call(grabSignUp, payload);
            if (response.ifLogin) {
                // if(response.status || response.code==1515 || response.code==1520 || response.code==1522 || response.code==1525 || response.code==1526 || response.code==1527 || response.code==1528 || response.code==1529 || response.code==9999) {
                if (response.status) {
                    yield put({
                        type: 'grab',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },
        *getSelectedList({ payload }, { call, put }) {
            yield put({
                type: 'selected',
                payload: payload,
            });
        },
        *deleteItem({ payload }, { call, put }) {
            yield put({
                type: 'delete',
                payload: payload,
            });
        },
        *checkedItem({ payload }, { call, put }) {
            yield put({
                type: 'checked',
                payload: payload,
            });
        },
        *optionalMargin({ payload, onSuccess, onFail }, { call, put }) {
            //获取club列表数据
            const response = yield call(optionalMargin, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'optionalMarginReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },
        *getAllCourse({ payload, onSuccess, onFail }, { call, put }) {
            //获取club列表数据
            const response = yield call(getAllCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'detail',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },
        *optionalMarginNew({ payload, onSuccess, onFail }, { call, put }) {
            //获取club列表数据
            const response = yield call(optionalMarginNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'optionalMarginReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },
        //保存信息
        *saveInformation({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(saveInformation, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },

        //获取信息
        *getInformation({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(getInformation, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'save',
                        payload: {
                            information: response.content,
                        },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            information: {},
                        },
                    });
                    message.error(response.message);
                    // onFail && onFail();
                }
            } else {
                onFail && onFail();
            }
        },

        //获取绑定信息
        *getUserAccountBindInformation({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(getUserAccountBindInformation, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'save',
                        payload: {
                            bindInformation: response.content,
                        },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            bindInformation: {},
                        },
                    });
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirectWeide();
            }
        },

        //获取验证码
        *sendMessageCode({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(sendMessageCode, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },

        //校验验证码
        *checkMessageCode({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(checkMessageCode, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('绑定成功');
                    yield put({
                        type: 'saveCheck',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },

        //解绑
        *unbindOtherAccount({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(unbindOtherAccount, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('解绑成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },

        //微信解绑
        *unbindWeChat({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(unbindWeChat, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('解绑成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },

        //更新密码
        *updatePassword({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(updatePassword, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('更新成功');
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onFail && onFail();
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        setParentChildList(state, action) {
            return {
                ...state,
                parentChildList: action.payload,
            };
        },
        setPlanMsgReducer(state, action) {
            return {
                ...state,
                planMsg: action.payload,
            };
        },
        detail(state, action) {
            return {
                ...state,
                courseList: action.payload,
            };
        },
        selected(state, action) {
            return {
                ...state,
                selectedList: action.payload,
            };
        },
        delete(state, action) {
            return {
                ...state,
                deleteItem: action.payload,
            };
        },
        checked(state, action) {
            return {
                ...state,
                checkedItem: action.payload,
            };
        },
        saveCheck(state, action) {
            return {
                ...state,
                ifLogout: action.payload,
            };
        },
        submited(state, action) {
            return {
                ...state,
                submitedCourseList: action.payload,
            };
        },
        schedule(state, action) {
            return {
                ...state,
                scheduleList: action.payload,
            };
        },
        coursePeriod(state, action) {
            return {
                ...state,
                courseStartPeriodList: action.payload,
            };
        },
        subject(state, action) {
            return {
                ...state,
                subjectList: action.payload,
            };
        },
        time(state, action) {
            return {
                ...state,
                schoolList: action.payload,
            };
        },
        complateSchedule(state, action) {
            return {
                ...state,
                detailScheduleInfo: action.payload,
            };
        },
        stage(state, action) {
            return {
                ...state,
                timeStageContent: action.payload,
            };
        },
        courseList(state, action) {
            return {
                ...state,
                studentCourseList: action.payload,
            };
        },

        deleteCourse(state, action) {
            return {
                ...state,
                deleteResult: action.payload,
            };
        },

        submitCourse(state, action) {
            return {
                ...state,
                submitResult: action.payload,
            };
        },
        cancelAndSignUp(state, action) {
            return {
                ...state,
                cancelAndSignUpResult: action.payload,
            };
        },
        courseDetail(state, action) {
            return {
                ...state,
                studentCourseDetailContent: action.payload,
            };
        },
        courseIntroduce(state, action) {
            return {
                ...state,
                courseIntroduction: action.payload,
            };
        },
        optionalMarginReducer(state, action) {
            return {
                ...state,
                optionalMargin: action.payload,
            };
        },
        grab(state, action) {
            return {
                ...state,
                grabMsg: action.payload,
            };
        },
        getOpenStatus(state, action) {
            return {
                ...state,
                isNeedOpen: action.payload.open,
            };
        },
        save(state, { payload: newState }) {
            return { ...state, ...newState };
        },

        clearData(state) {
            return {
                ...state,
                courseList: [],
            };
        },
    },
};
