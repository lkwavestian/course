import { loginRedirect, getUrlSearch } from '../utils/utils';
import { message } from 'antd';
import moment from 'moment';
import {
    getGradeList,
    getRoleList,
    getSubjectList,
    getTeacherList,
    getWorkFlowRuleSync,
    saveWorkFlowRuleSync,
    getCurrentUserSync,
    getListSchoolYearSync,
    findClassScheduleSync,
    newListExchangeSync,
    submitChangeRequestSync,
    updateChangeRequestSync,
    changeRequestDetailSync,
    importSupplementSync,
    getTotalLessonListSync,
    selectCopySendRuleSync,
    getActiveRelatedListSync,
    getChangeCourseRequestListSync,
    getListAllOrgTeachersSync,
    getRecordListSync,
    getCourseListSync,
    checkWorkFlowNodePermissionSync,
    selectSupportVersionSync,
    getApproveCheckSync,
    getApproveSync,
    revokeRequestSync,
    exportActingRequestListSync,
    listVersionChangeCourseRequestSync,
    publishChangeCourseRequestListSync,
    deleteWorkFlowRuleSync,
    selectScheduleCourseMessageSync,
    getTeacherCalendarListSync,
    getPersonalChangeCourseCountSync,
    checkChangeCoursePermissionEduInBisUsingSync,
    selfArrangeReadySync,
} from '../services/replace';

//将可选课节处理成单个的数组对象[{},{},{}]
function formatExchangeCourse(arr) {
    let resultArr = [];
    if (!arr || arr.length <= 0) return [];
    arr &&
        arr.length > 0 &&
        arr.map((item) => {
            if (item.length) {
                item.map((el) => {
                    resultArr.push(el);
                });
            } else {
                resultArr.push(item);
            }
        });
    return resultArr;
}

export default {
    namespace: 'replace',
    state: {
        selectKeys: 0,
        gradeList: [],
        teacherList: [],
        listAllOrgTeachers: [],
        subjectList: [],
        roleList: [],
        roleSettingDetail: [],
        rightContentType: '',
        workFlowRuleList: [],
        currentUser: {},
        schoolYearList: [],
        classScheduleList: [],
        newListExchangeList: [],
        searchExchangeLoading: false,
        changeRequest: {}, //提交申请基本参数
        status: 'application', //application：申请，detail：详情信息，schoolApproval：教务审批，businessApproval：业务审批
        selectLessonList: [],
        addLessonList: [],
        // addLessonList: [
        //     {
        //         source: {
        //             acId: 1047003,
        //             courseEnglishName: 'English G1',
        //             courseId: 65,
        //             courseName: '英语G1',
        //             courseSort: 3,
        //             duration: 1,
        //             endTime: '10:50',
        //             endTimeMillion: 1682391000000,
        //             frequency: 0,
        //             id: 2329631,
        //             lesson: 3,
        //             mainTeachers: [
        //                 {
        //                     avatar: 'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/record/image_file/20180830092735-aaef765c830f44449c64aa229c7d622c.jpeg?x-oss-process=image/crop,x_696,y_472,w_1290,h_1293',
        //                     englishName: '管89',
        //                     id: 1,
        //                     name: '管理员哈哈11',
        //                 },
        //                 {
        //                     avatar: 'https://yungu-record-public2.oss-cn-hangzhou.aliyuncs.com/yungu-record/image_file/c7025820-d890-4563-b1cd-434eaa108b3e.png',
        //                     englishName: '朱906',
        //                     id: 1543,
        //                     name: '朱一禾',
        //                 },
        //             ],
        //             newSubjectDTO: {
        //                 color: '#F05A8F',
        //                 credit: 0,
        //                 deleted: false,
        //                 disable: false,
        //                 eduGroupCompanyId: 1,
        //                 enName: 'English',
        //                 id: 15,
        //                 name: '英语',
        //                 schoolId: 1,
        //                 sortNumber: 0,
        //                 stageIds: [1, 2, 3, 4],
        //             },
        //             singleTime: 35,
        //             startTime: '10:15',
        //             startTimeMillion: 1716430875000,
        //             studentGroups: [
        //                 {
        //                     englishName: 'G1 C4',
        //                     grade: 1,
        //                     id: 4846,
        //                     name: '一年级(4)班',
        //                     type: 1,
        //                 },
        //             ],
        //             versionId: 2324,
        //             weekDay: 2,
        //         },
        //     },
        // ],
        selectedAddLessonItem: {},
        // selectedAddLessonItem: {
        //     source: {
        //         acId: 1047003,
        //         courseEnglishName: 'English G1',
        //         courseId: 65,
        //         courseName: '英语G1',
        //         courseSort: 3,
        //         duration: 1,
        //         endTime: '10:50',
        //         endTimeMillion: 1682391000000,
        //         frequency: 0,
        //         id: 2329631,
        //         lesson: 3,
        //         mainTeachers: [
        //             {
        //                 avatar: 'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/record/image_file/20180830092735-aaef765c830f44449c64aa229c7d622c.jpeg?x-oss-process=image/crop,x_696,y_472,w_1290,h_1293',
        //                 englishName: '管89',
        //                 id: 1,
        //                 name: '管理员哈哈11',
        //             },
        //             {
        //                 avatar: 'https://yungu-record-public2.oss-cn-hangzhou.aliyuncs.com/yungu-record/image_file/c7025820-d890-4563-b1cd-434eaa108b3e.png',
        //                 englishName: '朱906',
        //                 id: 1543,
        //                 name: '朱一禾',
        //             },
        //         ],
        //         newSubjectDTO: {
        //             color: '#F05A8F',
        //             credit: 0,
        //             deleted: false,
        //             disable: false,
        //             eduGroupCompanyId: 1,
        //             enName: 'English',
        //             id: 15,
        //             name: '英语',
        //             schoolId: 1,
        //             sortNumber: 0,
        //             stageIds: [1, 2, 3, 4],
        //         },
        //         singleTime: 35,
        //         startTime: '10:15',
        //         startTimeMillion: 1716430875000,
        //         studentGroups: [
        //             {
        //                 englishName: 'G1 C4',
        //                 grade: 1,
        //                 id: 4846,
        //                 name: '一年级(4)班',
        //                 type: 1,
        //             },
        //         ],
        //         versionId: 2324,
        //         weekDay: 2,
        //     },
        // },
        importSupplementUrlList: [],
        importSupplementFileList: [],
        contentWrapperLoading: false,
        totalLessonList: [],
        copySendRuleList: [],
        rangePickerTimeList: [],
        subjectValue: '',
        ccValue: [0],
        activeRelatedList: [],
        requestRelatedList: [],
        submitResultId: getUrlSearch('requestId') ? getUrlSearch('requestId') : '',
        applicationList: [],
        totalApplicationList: [],
        applicationListTableLoading: false,
        recordList: [],
        recordListTableLoading: false,
        courseList: [],
        checkWorkFlowNodePermission: 0,
        selectSupportVersion: [],
        approveCheck: '',
        listVersionChangeCourseRequest: [],
        listVersionChangeCourseRequestCount: 0,
        publishChangeCourseRequestList: [],
        selectScheduleCourseMessage: {},
        teacherCalendarList: [],
        selectedTeacherItem: {},
        personalChangeCourseCount: [],
        checkChangeCoursePermission: false,
        noProcessingRequiredModalVisible: false,
    },
    effects: {
        *selfArrangeReady({ payload, onSuccess }, { call, put }) {
            const response = yield call(selfArrangeReadySync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getPersonalChangeCourseCount({ payload, onSuccess }, { call, put }) {
            const response = yield call(getPersonalChangeCourseCountSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setPersonalChangeCourseCount',
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
        *getTeacherCalendarList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getTeacherCalendarListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setTeacherCalendarList',
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
        *getSelectScheduleCourseMessage({ payload, onSuccess }, { call, put }) {
            const response = yield call(selectScheduleCourseMessageSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setSelectScheduleCourseMessage',
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
        *getPublishChangeCourseRequestList({ payload, onSuccess }, { call, put }) {
            const response = yield call(publishChangeCourseRequestListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setPublishChangeCourseRequestList',
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
        *getListVersionChangeCourseRequest({ payload, onSuccess }, { call, put }) {
            const response = yield call(listVersionChangeCourseRequestSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setListVersionChangeCourseRequest',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteWorkFlowRule({ payload, onSuccess }, { call, put }) {
            const response = yield call(deleteWorkFlowRuleSync, payload);
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
        *exportActingRequestList({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportActingRequestListSync, payload);
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
        *revokeRequest({ payload, onSuccess }, { call, put }) {
            const response = yield call(revokeRequestSync, payload);
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
        *getApprove({ payload, onSuccess }, { call, put }) {
            const response = yield call(getApproveSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    yield put({
                        type: 'setNoProcessingRequiredModalVisible',
                        payload: true,
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *getApproveCheck({ payload, onSuccess }, { call, put }) {
            const response = yield call(getApproveCheckSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setApproveResult',
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
        *getSelectSupportVersion({ payload, onSuccess }, { call, put }) {
            const response = yield call(selectSupportVersionSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setSelectSupportVersion',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCheckWorkFlowNodePermission({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkWorkFlowNodePermissionSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCheckWorkFlowNodePermission',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCourseListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCourseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getRecordList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getRecordListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRecordList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getApplicationList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getChangeCourseRequestListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setApplicationList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *geTotalApplicationList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getChangeCourseRequestListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setTotalApplicationList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getActiveRelatedListSync({ payload, onSuccess }, { call, put }) {
            const response = yield call(getActiveRelatedListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setActiveRelatedList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *selectCopySendRule({ payload, onSuccess }, { call, put }) {
            if (!payload.resultIdString) {
                yield put({
                    type: 'setCopySendRuleList',
                    payload: [],
                });
            } else {
                const response = yield call(selectCopySendRuleSync, payload);
                if (response.ifLogin) {
                    if (response.status) {
                        yield put({
                            type: 'setCopySendRuleList',
                            payload: response.content,
                        });
                    } else {
                        message.error(response.message);
                    }
                } else {
                    loginRedirect();
                }
            }
        },
        *getTotalLessonList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getTotalLessonListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setTotalLessonList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeContentWrapperLoading({ payload }, { call, put }) {
            yield put({
                type: 'setContentWrapperLoading',
                payload,
            });
        },
        *importSupplement({ payload, onSuccess }, { call, put }) {
            const response = yield call(importSupplementSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportSupplementUrlList',
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
        *changeRequestDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(changeRequestDetailSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setChangeRequest',
                        payload: response.content,
                    });
                    yield put({
                        type: 'setRequestRelatedList',
                        payload: response.content.requestRelatedList
                            ? response.content.requestRelatedList
                            : [],
                    });
                    //业务审批下，判断是否出现业务提前处理按钮
                    if (response.content.status === 0) {
                        const permissionResponse = yield call(
                            checkChangeCoursePermissionEduInBisUsingSync,
                            payload
                        );
                        if (response.status) {
                            yield put({
                                type: 'setCheckChangeCoursePermissionEduInBisUsing',
                                payload: permissionResponse.content,
                            });
                            onSuccess && onSuccess(permissionResponse.content);
                        } else {
                            message.error(permissionResponse.message);
                        }
                    } else {
                        yield put({
                            type: 'setCheckChangeCoursePermissionEduInBisUsing',
                            payload: false,
                        });
                    }
                    let targetRecord = response.content.recordList?.find(
                        (item) => item.workflowNode === 'COPY_SEND'
                    );
                    yield put({
                        type: 'setCopySendRuleList',
                        payload: targetRecord
                            ? [
                                  {
                                      approveRoleList: targetRecord.roleTagVOList
                                          ? targetRecord.roleTagVOList
                                          : [],
                                      approveUserList: targetRecord.approveUserList
                                          ? targetRecord.approveUserList.map((item) => {
                                                return {
                                                    name: item.name,
                                                    userId: item.id,
                                                    enName: item.englishName,
                                                };
                                            })
                                          : [],
                                  },
                              ]
                            : [],
                    });
                    yield put({
                        type: 'setAddLessonList',
                        payload: response.content.changeScheduleResultDTOList.map((item) => {
                            return {
                                ...item,
                                source: item.sourceResult,
                                selectTeacherItem: item.actingTeacherList
                                    ? {
                                          teacherId: item.actingTeacherList[0].id,
                                          teacherName: item.actingTeacherList[0].name,
                                          teacherEnName: item.actingTeacherList[0].englishName,
                                      }
                                    : '',
                                target: item.targetResult,
                            };
                        }),
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *setRelatedRequestDetail({ payload, onSuccess }, { call, put }) {
            let changeRequest = { ...payload };
            yield put({
                type: 'setChangeRequest',
                payload: changeRequest,
            });
            let targetRecord = changeRequest.recordList?.find(
                (item) => item.workflowNode === 'COPY_SEND'
            );
            yield put({
                type: 'setCopySendRuleList',
                payload: targetRecord
                    ? [
                          {
                              approveRoleList: targetRecord.roleTagVOList
                                  ? targetRecord.roleTagVOList
                                  : [],
                              approveUserList: targetRecord.approveUserList
                                  ? targetRecord.approveUserList.map((item) => {
                                        return {
                                            name: item.name,
                                            userId: item.id,
                                            enName: item.englishName,
                                        };
                                    })
                                  : [],
                          },
                      ]
                    : [],
            });
            yield put({
                type: 'setAddLessonList',
                payload: changeRequest.changeScheduleResultDTOList.map((item) => {
                    return {
                        ...item,
                        source: item.sourceResult,
                        selectTeacherItem: item.actingTeacherList
                            ? {
                                  teacherId: item.actingTeacherList[0].id,
                                  teacherName: item.actingTeacherList[0].name,
                                  teacherEnName: item.actingTeacherList[0].englishName,
                              }
                            : '',
                        target: item.targetResult,
                    };
                }),
            });
        },
        *submitChangeRequest({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(submitChangeRequestSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content);
                    yield put({
                        type: 'setSubmitResultId',
                        payload: response.content,
                    });
                } else {
                    onError && onError();
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateChangeRequest({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateChangeRequestSync, payload);
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
        *changeSearchExchangeLoading({ payload }, { call, put }) {
            yield put({
                type: 'setSearchExchangeLoading',
                payload,
            });
        },
        *getNewListExchange({ payload, onSuccess }, { call, put }) {
            const response = yield call(newListExchangeSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setNewListExchange',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findClassSchedule({ payload, onSuccess }, { call, put }) {
            const response = yield call(findClassScheduleSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setClassSchedule',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getListSchoolYear({ payload, onSuccess }, { call, put }) {
            const response = yield call(getListSchoolYearSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setListSchoolYear',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCurrentUser({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCurrentUserSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCurrentUser',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveWorkFlowRule({ payload, onSuccess }, { call, put }) {
            const response = yield call(saveWorkFlowRuleSync, payload);
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
        *getWorkFlowRule({ payload }, { call, put }) {
            const response = yield call(getWorkFlowRuleSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setWorkFlowRule',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findSubject({ payload }, { call, put }) {
            const response = yield call(getSubjectList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setSubjectList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findRoleList({ payload }, { call, put }) {
            const response = yield call(getRoleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRoleList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findTeacher({ payload }, { call, put }) {
            const response = yield call(getTeacherList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setTeacherList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getListAllOrgTeachers({ payload }, { call, put }) {
            const response = yield call(getListAllOrgTeachersSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setListAllOrgTeachers',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *findGrade({ payload }, { call, put }) {
            const response = yield call(getGradeList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setGradeList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeSelectKeys({ payload }, { call, put }) {
            yield put({
                type: 'setSelectKeys',
                payload,
            });
        },
    },
    reducers: {
        setNoProcessingRequiredModalVisible(state, action) {
            return {
                ...state,
                noProcessingRequiredModalVisible: action.payload,
            };
        },
        setCheckChangeCoursePermissionEduInBisUsing(state, action) {
            return {
                ...state,
                checkChangeCoursePermission: action.payload,
            };
        },
        setPersonalChangeCourseCount(state, action) {
            return {
                ...state,
                personalChangeCourseCount: action.payload,
            };
        },
        setSelectedTeacherItem(state, action) {
            return {
                ...state,
                selectedTeacherItem: action.payload,
            };
        },
        setTeacherCalendarList(state, action) {
            return {
                ...state,
                teacherCalendarList: action.payload,
            };
        },
        setSelectScheduleCourseMessage(state, action) {
            return {
                ...state,
                selectScheduleCourseMessage: action.payload,
            };
        },
        setPublishChangeCourseRequestList(state, action) {
            return {
                ...state,
                publishChangeCourseRequestList: action.payload,
            };
        },
        setListVersionChangeCourseRequest(state, action) {
            return {
                ...state,
                listVersionChangeCourseRequest: action.payload,
                listVersionChangeCourseRequestCount: action.payload.filter(
                    (item) => item.status === 4 || item.status === 0
                ).length,
            };
        },
        setApproveResult(state, action) {
            return {
                ...state,
                approveCheck: action.payload,
            };
        },
        setSelectSupportVersion(state, action) {
            return {
                ...state,
                selectSupportVersion: action.payload,
            };
        },
        setCheckWorkFlowNodePermission(state, action) {
            return {
                ...state,
                checkWorkFlowNodePermission: action.payload,
            };
        },
        setRecordListTableLoading(state, action) {
            return {
                ...state,
                recordListTableLoading: action.payload,
            };
        },
        setRecordList(state, action) {
            return {
                ...state,
                recordList: action.payload,
            };
        },
        setApplicationListTableLoading(state, action) {
            return {
                ...state,
                applicationListTableLoading: action.payload,
            };
        },
        setApplicationList(state, action) {
            return {
                ...state,
                applicationList: action.payload,
            };
        },
        setTotalApplicationList(state, action) {
            return {
                ...state,
                totalApplicationList: action.payload,
            };
        },
        setSubmitResultId(state, action) {
            return {
                ...state,
                submitResultId: action.payload,
            };
        },
        setRequestRelatedList(state, action) {
            return {
                ...state,
                requestRelatedList: action.payload,
            };
        },
        setActiveRelatedList(state, action) {
            return {
                ...state,
                activeRelatedList: action.payload,
            };
        },
        setCcValue(state, action) {
            return {
                ...state,
                ccValue: action.payload,
            };
        },
        setRangePickerTimeList(state, action) {
            return {
                ...state,
                rangePickerTimeList: action.payload,
            };
        },
        setCopySendRuleList(state, action) {
            return {
                ...state,
                copySendRuleList: action.payload,
            };
        },
        setTotalLessonList(state, action) {
            return {
                ...state,
                totalLessonList: action.payload,
            };
        },
        setContentWrapperLoading(state, action) {
            return {
                ...state,
                contentWrapperLoading: action.payload,
            };
        },
        setImportSupplementFileList(state, action) {
            return {
                ...state,
                importSupplementFileList: action.payload,
            };
        },
        setImportSupplementUrlList(state, action) {
            return {
                ...state,
                importSupplementUrlList: [...state.importSupplementUrlList, ...action.payload],
            };
        },
        emptyImportSupplementUrlList(state, action) {
            return {
                ...state,
                importSupplementUrlList: [],
            };
        },
        setAddLessonList(state, action) {
            return {
                ...state,
                addLessonList: action.payload,
            };
        },
        setSelectedAddLessonItem(state, action) {
            return {
                ...state,
                selectedAddLessonItem: action.payload,
                subjectValue: action.payload.source?.newSubjectDTO.id,
            };
        },
        setSubjectValue(state, action) {
            return {
                ...state,
                subjectValue: action.payload,
            };
        },

        setStatus(state, action) {
            return {
                ...state,
                status: action.payload,
            };
        },
        setChangeRequest(state, action) {
            return {
                ...state,
                changeRequest: action.payload,
            };
        },
        setSearchExchangeLoading(state, action) {
            return {
                ...state,
                searchExchangeLoading: action.payload,
            };
        },
        setNewListExchange(state, action) {
            return {
                ...state,
                newListExchangeList: formatExchangeCourse(action.payload),
            };
        },
        setClassSchedule(state, action) {
            return {
                ...state,
                classScheduleList: action.payload,
            };
        },
        setListSchoolYear(state, action) {
            return {
                ...state,
                schoolYearList: action.payload,
            };
        },
        setCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        setWorkFlowRule(state, action) {
            return {
                ...state,
                workFlowRuleList: action.payload,
            };
        },
        setRightContentType(state, action) {
            return {
                ...state,
                rightContentType: action.payload,
            };
        },
        setSubjectList(state, action) {
            return {
                ...state,
                subjectList: action.payload,
            };
        },
        setCourseList(state, action) {
            return {
                ...state,
                courseList: action.payload,
            };
        },
        setRoleList(state, action) {
            return {
                ...state,
                roleList: action.payload,
            };
        },
        setTeacherList(state, action) {
            return {
                ...state,
                teacherList: action.payload,
            };
        },
        setListAllOrgTeachers(state, action) {
            return {
                ...state,
                listAllOrgTeachers: action.payload,
            };
        },
        setGradeList(state, action) {
            return {
                ...state,
                gradeList: action.payload,
            };
        },
        setSelectKeys(state, action) {
            return {
                ...state,
                selectKeys: action.payload,
            };
        },
    },
};
