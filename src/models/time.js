import { loginRedirect } from '../utils/utils';
import { message, Modal } from 'antd';
import {
    getCourseLists,
    listChooseCourse,
    getSemester,
    selectAllSchoolYear,
    getGrade,
    allGrade,
    getDateList,
    getCalendarList,
    deleteCalendar,
    addScheduleList,
    editScheduleList,
    copyScheduleList,
    addScheduleText,
    fetchCalendarDetail,
    modifScheduleWork,
    deleteBaseListText,
    fetchWorkEnquiry,
    changeSchedulelist,
    changeDay,
    changeDifference,
    changeSchedule,
    versionScheduleChange,
    getClassList,
    getScheduleList,
    allStudent,
    allStage,
    getAllStageGrade, // 学段年级
    copyLatestVersion, // 调换课自动创建版本
    scheduleInvalidInfo,
    confirmInvalid,
    getByRangeTimeWeeklyCurrentVersion,
    getSemesterListByTime,
    scheduleDetailWeedDayCopySync,
    scheduleDetailWeedDayDeleteSync,
} from '../services/time';

export default {
    namespace: 'time',
    state: {
        semesterList: [], //学期列表
        getCourseLists: [],
        listChooseCourse: [],
        gradeList: [], //年级列表
        allGrade: [],
        dateList: [], //时间列表
        dataSourceList: [], //作息表数据
        deleteSuccess: {}, //删除作息内容
        addScheduleSuccess: {}, //添加作息表
        editScheduleSuccess: {}, //编辑作息表
        copyScheduleList: {}, //复制作息表
        addScheduleText: {}, // 添加作息内容
        calendrDetail: {}, //查询作息活动内容
        addScheduleList: {}, //添加作息表
        modifScheduleWork: {}, // 修改作息内容
        deleteBaseListText: {}, // 删除作息表
        fetchWorkingHours: {}, // 查询作息详情
        changeSchedulelist: undefined, //查询新旧作息表
        changeDay: {},
        changeDifference: {},
        changeSchedule: {}, //更改作息表,
        versionScheduleChange: {},
        classList: [], // 所有班级
        allStudent: {}, // 所有学生
        allStage: [], // 获取学段列表
        allStageGrade: [], // 学段年级
        invalidInfo: {},
        byRangeTimeList: [],
        semesterListByTime: [],
        changeResult: undefined,
        getScheduleList: [],
    },
    effects: {
        *scheduleDetailWeedDayCopy({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(scheduleDetailWeedDayCopySync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    onError && onError(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *scheduleDetailWeedDayDelete({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(scheduleDetailWeedDayDeleteSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    onError && onError();
                }
            } else {
                loginRedirect();
            }
        },
        *getSemesterListByTime({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSemesterListByTime, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getTimeSemesterList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getByRangeTimeWeeklyCurrentVersion({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(getByRangeTimeWeeklyCurrentVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getByRange',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *scheduleInvalidInfo({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(scheduleInvalidInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'totalAndInfo',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmInvalid({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(confirmInvalid, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *copyLatestVersion({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(copyLatestVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getAllStageGrade({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(getAllStageGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'stageAndGrade',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexAllStageGrade({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'stageAndGrade',
                payload: payload,
            });
        },

        *allStage({ payload, onSuccess }, { call, put }) {
            //获取学段列表
            const response = yield call(allStage, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allStageReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSemesterList({ payload, onSuccess }, { call, put }) {
            //获取学期列表
            const response = yield call(getSemester, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateSemesterList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexSemesterList({ payload }, { call, put }) {
            yield put({
                type: 'updateSemesterList',
                payload: payload,
            });
        },

        *selectAllSchoolYear({ payload, onSuccess }, { call, put }) {
            //获取学期列表
            const response = yield call(selectAllSchoolYear, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateselectAllSchoolYear',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCourseLists({ payload, onSuccess }, { call, put }) {
            //获取课
            const response = yield call(getCourseLists, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updategetCourseLists',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listChooseCourse({ payload, onSuccess }, { call, put }) {
            //获取课
            const response = yield call(listChooseCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatelistChooseCourse',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getGradeList({ payload, onSuccess }, { call, put }) {
            //获取年级列表
            const response = yield call(getGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateGradeList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexGradeList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateGradeList',
                payload: payload,
            });
        },

        *getallGrade({ payload, onSuccess }, { call, put }) {
            //获取年级列表
            const response = yield call(allGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateallGrade',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getDateList({ payload, onSuccess }, { call, put }) {
            //获取时间列表
            const response = yield call(getDateList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateDateList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCalendarSource({ payload }, { call, put }) {
            //查询作息表
            const response = yield call(getCalendarList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateScheduleList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *deleteBaseListText({ payload }, { call, put }) {
            //删除作息表（及表下的内容）
            const response = yield call(deleteBaseListText, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undatedeleteBaseListText',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteCalendar({ payload }, { call, put }) {
            //删除作息内容
            const response = yield call(deleteCalendar, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateDeleteCalendar',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addScheduleList({ payload, onSuccess }, { call, put }) {
            //添加作息表
            const response = yield call(addScheduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undateaddScheduleSuccess',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    Modal.error({
                        title: response.message,
                        okText: '知道了',
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *editScheduleList({ payload, onSuccess }, { call, put }) {
            //修改作息表
            const response = yield call(editScheduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateEditList',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    Modal.error({
                        title: response.message,
                        okText: '知道了',
                    });
                }
            } else {
                loginRedirect();
            }
        },

        *copyScheduleList({ payload, onSuccess }, { call, put }) {
            //复制作息表
            const response = yield call(copyScheduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCopyScheduleList',
                        payload: response,
                    });
                    message.success('已成功复制');
                    onSuccess && onSuccess();
                } else {
                    Modal.error({
                        title: response.message,
                        okText: '知道了',
                    });
                }
            } else {
                loginRedirect();
            }
        },

        *addScheduleText({ payload }, { call, put }) {
            //添加作息内容
            const response = yield call(addScheduleText, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undateaddScheduleText',
                        payload: response,
                    });
                    message.success('已成功创建');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchCalendarDetail({ payload }, { call, put }) {
            //查询作息表内容
            const response = yield call(fetchCalendarDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undateCalendarDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *fetchWorkingHours({ payload }, { call, put }) {
            //查询作息详情
            const response = yield call(fetchWorkEnquiry, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undatefetchWorkingHours',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeSchedulelist({ payload, onSuccess }, { call, put }) {
            //更改作息表
            const response = yield call(changeSchedulelist, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undatechangeSchedulelist',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeDay({ payload, onSuccess }, { call, put }) {
            //更改作息表
            const response = yield call(changeDay, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undatechangeDay',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeDifference({ payload }, { call, put }) {
            //更改作息表列表
            const response = yield call(changeDifference, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undatechangeDifference',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeSchedule({ payload, onSuccess }, { call, put }) {
            //更改作息表
            const response = yield call(changeSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success('已更换成功');
                    onSuccess && onSuccess();
                } else {
                    // message.error(response.message);
                    // yield put({
                    //     type: 'undatechangeSchedule',
                    //     payload: response,
                    // });
                }
                yield put({
                    type: 'undatechangeSchedule',
                    payload: response,
                });
            } else {
                loginRedirect();
            }
        },

        *versionScheduleChange({ payload, onSuccess }, { call, put }) {
            //更改作息表
            const response = yield call(versionScheduleChange, payload);
            if (response.ifLogin) {
                yield put({
                    type: 'changeLotsSchedule',
                    payload: response,
                });
                if (response.status) {
                    message.success('已更换成功');
                    onSuccess && onSuccess();
                } else {
                    // message.error(response.message);
                    // yield put({
                    //     type: 'undatechangeSchedule',
                    //     payload: response,
                    // });
                }
            } else {
                loginRedirect();
            }
        },

        *modifScheduleWork({ payload }, { call, put }) {
            //修改作息内容
            const response = yield call(modifScheduleWork, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undateModifScheduleWork',
                        payload: response,
                    });
                } else {
                    Modal.error({
                        title: response.message,
                        onText: '知道了',
                    });
                    // message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getClassList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getClassList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getClassListReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getScheduleList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getScheduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getScheduleListReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *allStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(allStudent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allStudentReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        getTimeSemesterList(state, action) {
            return {
                ...state,
                semesterListByTime: action.payload,
            };
        },
        getByRange(state, action) {
            return {
                ...state,
                byRangeTimeList: action.payload,
            };
        },
        allStageReducer(state, action) {
            return {
                ...state,
                allStage: action.payload,
            };
        },
        updateSemesterList(state, action) {
            return {
                ...state,
                semesterList: action.payload,
            };
        },
        updateselectAllSchoolYear(state, action) {
            return {
                ...state,
                selectAllSchoolYear: action.payload,
            };
        },
        updategetCourseLists(state, action) {
            return {
                ...state,
                getCourseLists: action.payload,
            };
        },
        updatelistChooseCourse(state, action) {
            return {
                ...state,
                listChooseCourse: action.payload,
            };
        },
        updateGradeList(state, action) {
            return {
                ...state,
                gradeList: action.payload,
            };
        },
        updateallGrade(state, action) {
            return {
                ...state,
                allGrade: action.payload,
            };
        },
        updateDateList(state, action) {
            return {
                ...state,
                dateList: action.payload,
            };
        },
        updateScheduleList(state, action) {
            return {
                ...state,
                dataSourceList: action.payload,
            };
        },
        updateDeleteCalendar(state, action) {
            return {
                ...state,
                deleteSuccess: action.payload,
            };
        },
        addScheduleSuccess(state, action) {
            return {
                ...state,
                addScheduleSuccess: action.payload,
            };
        },
        updateEditList(state, action) {
            return {
                ...state,
                editScheduleSuccess: action.payload,
            };
        },
        updateCopyScheduleList(state, action) {
            return {
                ...state,
                copyScheduleList: action.payload,
            };
        },
        undateaddScheduleText(state, action) {
            return {
                ...state,
                addScheduleText: action.payload,
            };
        },
        undateCalendarDetail(state, action) {
            return {
                ...state,
                calendrDetail: action.payload,
            };
        },
        undateaddScheduleSuccess(state, action) {
            return {
                ...state,
                addScheduleList: action.payload,
            };
        },
        undateModifScheduleWork(state, action) {
            return {
                ...state,
                modifScheduleWork: action.payload,
            };
        },
        undatedeleteBaseListText(state, action) {
            return {
                ...state,
                deleteBaseListText: action.payload,
            };
        },
        undatefetchWorkingHours(state, action) {
            return {
                ...state,
                fetchWorkingHours: action.payload,
            };
        },
        undatechangeSchedulelist(state, action) {
            return {
                ...state,
                changeSchedulelist: action.payload,
            };
        },
        undatechangeDay(state, action) {
            return {
                ...state,
                changeDay: action.payload,
            };
        },
        undatechangeDifference(state, action) {
            return {
                ...state,
                changeDifference: action.payload,
            };
        },
        getClassListReducer(state, action) {
            return {
                ...state,
                classList: action.payload,
            };
        },
        allStudentReducer(state, action) {
            return {
                ...state,
                allStudent: action.payload,
            };
        },
        stageAndGrade(state, action) {
            return {
                ...state,
                allStageGrade: action.payload,
            };
        },
        totalAndInfo(state, action) {
            return {
                ...state,
                invalidInfo: action.payload,
            };
        },
        clearData(state, action) {
            return {
                ...state,
                byRangeTimeList: [],
            };
        },
        undatechangeSchedule(state, action) {
            return {
                ...state,
                changeResult: action.payload,
            };
        },
        changeLotsSchedule(state, action) {
            return {
                ...state,
                versionScheduleChange: action.payload,
            };
        },
        getScheduleListReducer(state, action) {
            return {
                ...state,
                getScheduleList: action.payload,
            };
        },
    },
};
