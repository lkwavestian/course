import { loginRedirect } from '../utils/utils';
import { message } from 'antd';

import {
    findClassScheduleAC,
    conflictInformationAsync,
    findStudentViewGroupList,
    findStudentViewStudentList,
} from '../services/lessonView';
import {
    findClassSchedule,
    findTeacherSchedule,
    findGradeSchedule,
    findFieldSchedule,
    findStudentSchedule,
} from '../services/timeTable';

export default {
    namespace: 'lessonView',
    state: {
        lessonViewTableLoading: false,
        lessonViewScheduleData: [],
        lessonViewCustomValue: [],
        lessonViewCustomLabel: [],
        lessonViewExchangeCourseStatus: false, //false为课表状态 true为调换课状态
        lessonViewExchangeCustomCourseStatus: false, //false为课表状态 true为调换课状态
        conflictInformation: {},
        referenceTableLoadingStatus: false,
        currentStudentGroup: '', //当前操作的班级ad
        displayRules: JSON.parse(localStorage.getItem('displayRules'))
            ? JSON.parse(localStorage.getItem('displayRules'))
            : {
                  morningLessonNum: 4,
                  afternoonLessonNum: 4,
                  eveningLessonNum: 0,
              },
        showWeekend: localStorage.getItem('showWeekend')
            ? localStorage.getItem('showWeekend')
            : false,
        customCourseSearchIndex: 0, //课节视图主视图视角 [0:'班级', 1:'年级', 2:'学生', 3:'教师', 4:'场地']
        mainScheduleData: {},
        customTableRowCount: 1,
        studentViewGroupList: [],
        studentViewStudentList: [],
        searchParameters: {
            gradeValue: [],
            studentValue: [],
            addressValue: [],
            teacherValue: [],
        },

        lessonViewClassScheduleShowType: 2, //课节视图多班时 1：合并一块 2：按班拆开
        currentSideBar: 'reduceSideBar', //sideBar类型  addSideBar：主课表sideBar，reduceSideBar：参考课表sideBar，
    },

    effects: {
        *clearMainSchedule({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setMainSchedule',
                payload: [],
            });
        },
        *getStudentViewGroupList({ payload, onSuccess }, { call, put }) {
            const response = yield call(findStudentViewGroupList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setStudentViewGroupList',
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
        *getStudentViewStudentList({ payload, onSuccess }, { call, put }) {
            const response = yield call(findStudentViewStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setStudentViewStudentList',
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
        *findMainSchedule({ payload, onSuccess }, { call, put }) {
            let { view, ...payloadSync } = payload;
            let findCustomScheduleSync;
            switch (view) {
                case 'group':
                    findCustomScheduleSync = findClassSchedule;
                    break;
                case 'teacher':
                    findCustomScheduleSync = findTeacherSchedule;
                    break;
                case 'grade':
                    findCustomScheduleSync = findGradeSchedule;
                    break;
                case 'address':
                    findCustomScheduleSync = findFieldSchedule;
                    break;
                case 'student':
                    findCustomScheduleSync = findStudentSchedule;
                    break;
                default:
                    findCustomScheduleSync = findClassSchedule;
            }
            yield put({
                type: 'setLessonViewTableLoading',
                payload: true,
            });
            const response = yield call(findCustomScheduleSync, payloadSync);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setMainSchedule',
                        payload: {
                            view,
                            scheduleData: response.content.map((item) => {
                                return view === 'grade'
                                    ? {
                                          ...item,
                                          studentGroup: item.teachingOrgModel,
                                      }
                                    : {
                                          ...item,
                                      };
                            }),
                        },
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            yield put({
                type: 'setLessonViewTableLoading',
                payload: false,
            });
        },
        *setReferenceTableLoadingStatusSync({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setReferenceTableLoadingStatus',
                payload,
            });
        },
        *setScheduleDataSync({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setCustomScheduleData',
                payload,
            });
        },
        *clearCustomScheduleSync({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'clearCustomSchedule',
            });
        },
        *findCustomSchedule({ payload, onSuccess }, { call, put }) {
            let type = payload.type;
            let idType = payload.idType;
            delete payload.type;
            delete payload.idType;
            let findCustomScheduleSync;
            switch (type) {
                case 'group':
                    findCustomScheduleSync = findClassSchedule;
                    break;
                case 'teacher':
                    findCustomScheduleSync = findTeacherSchedule;
                    break;
                case 'grade':
                    findCustomScheduleSync = findGradeSchedule;
                    break;
                case 'address':
                    findCustomScheduleSync = findFieldSchedule;
                    break;
                case 'student':
                    findCustomScheduleSync = findStudentSchedule;
                    break;
                default:
                    findCustomScheduleSync = findClassSchedule;
            }
            yield put({
                type: 'setReferenceTableLoadingStatus',
                payload: true,
            });
            const response = yield call(findCustomScheduleSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCustomScheduleData',
                        payload: response.content.map((item) => {
                            return type === 'grade'
                                ? {
                                      ...item,
                                      view: type,
                                      studentGroup: item.teachingOrgModel,
                                      idType,
                                  }
                                : {
                                      ...item,
                                      view: type,
                                      idType,
                                  };
                        }),
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            yield put({
                type: 'setReferenceTableLoadingStatus',
                payload: false,
            });
        },
        *clearConflictInformation({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setConflictInformation',
                payload,
            });
        },
        *getConflictInformation({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(conflictInformationAsync, payload);
            if (response.ifLogin) {
                if (response.status || response.code == 1518) {
                    yield put({
                        type: 'setConflictInformation',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    onError && onError();
                }
            } else {
                loginRedirect();
            }
        },
        *changeLessonViewExchangeCourseStatus({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setLessonViewExchangeCourseStatus',
                payload: payload,
            });
        },
        *changeLessonViewCustomExchangeCourseStatus({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setLessonViewCustomExchangeCourseStatus',
                payload: payload,
            });
        },
        *setCurrentStudentGroupSync({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setCurrentStudentGroup',
                payload: payload,
            });
        },
        *changeLessonViewCustomValue({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setLessonViewCustomValue',
                payload: payload,
            });
        },
        *changeLessonViewCustomLabel({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setLessonViewCustomLabel',
                payload: payload,
            });
        },
        *getScheduleDataByStudentGroup({ payload, onSuccess }, { call, put }) {
            let { isFirstScreenLoading, ...payloadSync } = payload;
            const response = yield call(findClassSchedule, payloadSync);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setScheduleData',
                        payload: { classSchedule: response.content, isFirstScreenLoading },
                    });
                    yield put({
                        type: 'setMainSchedule',
                        payload: { view: 'group', scheduleData: response.content },
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getClassScheduleACList({ payload, onSuccess }, { call, put }) {
            const response = yield call(findClassScheduleAC, payload);
            if (response.ifLogin) {
                if (response.status) {
                    //table 表示从主课表班级表请求待排列表
                    //customTable 表示参考课表请求待排列表
                    yield put({
                        type: 'setClassScheduleACList',
                        payload: {
                            acList: response.content,
                            id: payload.adminGroupIdString,
                        },
                    });

                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeLessonViewTableLoading({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setLessonViewTableLoading',
                payload: payload,
            });
        },
    },
    reducers: {
        setSideBarVisible(state, action) {
            return {
                ...state,
                currentSideBar: action.payload,
            };
        },
        setLessonViewClassScheduleShowType(state, action) {
            return {
                ...state,
                lessonViewClassScheduleShowType: action.payload,
            };
        },
        setSearchParameters(state, action) {
            return {
                ...state,
                searchParameters: action.payload,
            };
        },
        clearSearchParameters(state, action) {
            return {
                ...state,
                searchParameters: {
                    gradeValue: [],
                    studentValue: {
                        studentViewStudentValue: [],
                        studentViewGroupValue: [],
                        studentViewGradeValue: [],
                    },
                    addressValue: [],
                    teacherValue: [],
                },
                lessonViewCustomValue: [],
                lessonViewCustomLabel: [],
            };
        },
        setStudentViewGroupList(state, action) {
            return {
                ...state,
                studentViewGroupList: action.payload,
            };
        },
        setStudentViewStudentList(state, action) {
            return {
                ...state,
                studentViewStudentList: action.payload,
            };
        },
        setCustomTableRowCount(state, action) {
            return {
                ...state,
                customTableRowCount: action.payload,
            };
        },
        setMainSchedule(state, action) {
            return {
                ...state,
                mainScheduleData: action.payload,
            };
        },
        setCustomCourseSearchIndex(state, action) {
            return {
                ...state,
                customCourseSearchIndex: action.payload,
            };
        },

        setShowWeekend(state, action) {
            return {
                ...state,
                showWeekend: action.payload,
            };
        },
        setDisplayRules(state, action) {
            return {
                ...state,
                displayRules: action.payload,
            };
        },
        setReferenceTableLoadingStatus(state, action) {
            return {
                ...state,
                referenceTableLoadingStatus: action.payload,
            };
        },
        clearCustomSchedule(state, action) {
            return {
                ...state,
                lessonViewScheduleData: state.lessonViewScheduleData.filter((item) => !item.view),
            };
        },
        setCustomScheduleData(state, action) {
            let lessonViewScheduleData = state.lessonViewScheduleData;

            console.log('action.payload :>> ', action.payload);

            //如果没有view，操作是删除
            if (!action.payload[0]?.view) {
                return {
                    ...state,
                    lessonViewScheduleData: [...action.payload],
                };
            } else {
                let fn = (payload) => {
                    let targetIndex = lessonViewScheduleData.findIndex(
                        (item) =>
                            item.view === payload.view &&
                            item.studentGroup.id === payload.studentGroup.id
                    );

                    //lessonViewScheduleData里面有customSchedule表示更新，没有插入到自定义课表第一项
                    if (targetIndex !== -1) {
                        lessonViewScheduleData[targetIndex] = payload;
                    } else {
                        let mainScheduleList = lessonViewScheduleData.filter((item) => !item.view);
                        let customScheduleList = lessonViewScheduleData.filter((item) => item.view);
                        customScheduleList.unshift(payload);
                        lessonViewScheduleData = [...mainScheduleList, ...customScheduleList];
                    }
                };
                action.payload?.forEach((payload) => {
                    fn(payload);
                });

                return {
                    ...state,
                    lessonViewScheduleData: [...lessonViewScheduleData],
                };
            }
        },
        setConflictInformation(state, action) {
            return {
                ...state,
                conflictInformation: action.payload,
            };
        },
        setLessonViewExchangeCourseStatus(state, action) {
            return {
                ...state,
                lessonViewExchangeCourseStatus: action.payload,
            };
        },
        setLessonViewCustomExchangeCourseStatus(state, action) {
            return {
                ...state,
                lessonViewExchangeCustomCourseStatus: action.payload,
            };
        },
        setCurrentStudentGroup(state, action) {
            return {
                ...state,
                currentStudentGroup: action.payload,
            };
        },
        setLessonViewCustomValue(state, action) {
            return {
                ...state,
                lessonViewCustomValue: action.payload,
            };
        },
        setLessonViewCustomLabel(state, action) {
            return {
                ...state,
                lessonViewCustomLabel: action.payload,
            };
        },

        setScheduleData(state, action) {
            let { classSchedule, isFirstScreenLoading } = action.payload;
            let lessonViewScheduleData = state.lessonViewScheduleData;
            if (isFirstScreenLoading) {
                return {
                    ...state,
                    lessonViewScheduleData: [...classSchedule],
                };
            } else {
                let customScheduleList = lessonViewScheduleData.filter((item) => item.view);
                return {
                    ...state,
                    lessonViewScheduleData: [...customScheduleList, ...classSchedule],
                };
            }
        },
        setClassScheduleACList(state, action) {
            return {
                ...state,
                lessonViewScheduleData: state.lessonViewScheduleData.map((item) => {
                    if (item.studentGroup.id == action.payload.id) {
                        return {
                            ...item,
                            acList: action.payload.acList,
                        };
                    } else {
                        return {
                            ...item,
                        };
                    }
                }),
            };
        },
        setLessonViewTableLoading(state, action) {
            return {
                ...state,
                lessonViewTableLoading: action.payload,
            };
        },
        emptyLessonViewAboutData(state, action) {
            return {
                ...state,
                mainScheduleData: {},
                lessonViewScheduleData: [],
                lessonViewCustomValue: [],
                lessonViewCustomLabel: [],
            };
        },
    },
};
