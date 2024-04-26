//课程表model
import { loginRedirect } from '../utils/utils';
import { message, Modal } from 'antd';
import { xorWith, uniq } from 'lodash';
import {
    createSchedule,
    haveScheduleNum,
    saveVersion,
    searchImportCourse,
    confirmImport,
    fetchCourseList,
    fetchArrangeDetail,
    copyCard,
    deleteCard,
    findWeekCoursePlanning,
    getVersionList,
    setNewVersion,
    fetchScheduleList,
    deleteCourse,
    changeArrange,
    lookCourseDetail,
    copyResult,
    saveCardTeacher,
    getScheduleDetailList,
    saveChangeTime,
    continueArrange,
    deletePlanningRow,
    deletePlanningAllRow,
    saveWeekCoursePlanning,
    fetchGradeListBySubject,
    getClickKeySchedule,
    fetSchedule, //一键排课
    saveFreeScheduleTime, //卡片新建人工自由排课
    getDepartmentList, //获取部门人员
    getStudentList, //获取学生列表
    createFreeCourse, //新建自由排课
    lookFreeCourseDetail, //查看自由排课的详情
    deleteFreeCourse, //删除自由排课课程
    getAreaList, //获取场地列表
    publishSchedule, //公布课表
    getAcCourseList, // AC课程下拉列表展示
    lockUtilLesson, //锁定单节课程
    unLockUtilLesson, //解锁单节课程
    confirmLock, //确认锁定
    confirmUpdate, //确认调整
    exchangeClass, //换课--查询可选结果
    validateCanChange, //换课--校验
    getExchangeResult, //换课--详情
    lastPublic, //检查版本是否是最新发布版本
    finishExchangeCourse, //确认调课换课
    editSystemCourse, //编辑系统排课结果
    editFreeCourse, //编辑自由排课结果
    confirmCourseNum, //自由排课操作的数量
    fetchCourseBySubject, //科目-课程级联
    getFetProgress, //获取fet进程进度条
    stopFetCourse, //fet进场停止排课
    statisticsCourse, //待排课数量优化--排课v1.3
    getGradeByType, //自由排课--学生组优化接口
    searchNoAddress, //公布课表--查询缺失场地的课节
    manualScheduleCheck, //人工预排--按节次--规则校验
    changeFreeArrange, //人工自由排课--转为待排
    scheduleResultNumber, //清空某天结果的统计
    confirmDelete, //确认清空某天的结果
    fetchAddressResult, //根据场地进行查询
    fetchTeacherResult, //根据教师进行查询
    compareVersion, //版本差异对比
    versionGrade, //适用年级
    findGradeSchedule,
    updateVersion, // 编辑版本名称
    findStudentResult,
    findGrade,
    findGroup,
    findTeacherSchedule,
    findFieldSchedule,
    findStudentSchedule,
    newExchangeClass, // 新 换课--查询可选结果
    newCheckScheduleList, // 待排课节可选课节列表
    conflictReasonCard, // 冲突原因卡片
    findClassSchedule,
    willSureExchange, // 待排确认换课
    getWillGroupList,
    sureCreateActive, // 确认创建自由活动
    getExportGroupList,
    importByCourse,
    downloadFetSchedule,
    getCompareVersion,
    getCompareVersionResult,
    getCompareVersionTeacher,
    scheduleCheck,
    unListedStudents, //未排学生
    teacherCare, //教师关怀
    queryScheduleStatus,
    getCopyByDayScheduleResult,
    checkEditResultSchedule,
    coursePlanSubjectList,
    searchPeopleAsync,
    exportExcelResult,
    getOperationRecordList,
    revokeOperationRecord,
    deleteCoursePlanning,
    batchArrange,
    changeWeekTeachingPlanGroup,
    uploadFetResult,
    courseScheduleImport,
    batchDeletedAC,
    batchSuspendAC,
    fetchWeekVersionCourseList,
    splitContinuousResultSync,
    roomConflictCheckSync,
    checkVersionGroupSync,
    acrossSemesterCopyVersionSync,
    getTaskWeekVersionListSync,
} from '../services/timeTable';

function cycleScheduleData(scheduleData, fetchData) {
    let isCover = false;
    // 自定义视角下添加行存在替换，不存在添加
    if (fetchData instanceof Array && fetchData.length > 1) {
        // 自定义视角多选条件下fetchData为list
        let itemCover = false;
        for (let j = 0; j < fetchData.length; j++) {
            for (let i = 0; i < scheduleData.length; i++) {
                if (scheduleData[i].studentGroup.id === fetchData[j].studentGroup.id) {
                    scheduleData[i] = fetchData[j];
                    itemCover = true;
                    break;
                }
            }
            if (!itemCover) {
                scheduleData.splice(scheduleData.length - 1, 0, fetchData[j]);
            }
            itemCover = false;
        }
    } else {
        for (let i = 0; i < scheduleData.length; i++) {
            if (scheduleData[i].studentGroup.id === fetchData.studentGroup.id) {
                scheduleData[i] = fetchData;
                isCover = true;
            }
        }
        if (!isCover) {
            scheduleData.splice(scheduleData.length - 1, 0, fetchData);
        }
    }
    return scheduleData;
}

//格式化学生组数据
function formatStudentGroup(groupList) {
    //处理年级
    let formatGradeData = (gradeList) => {
        if (!gradeList || gradeList.length < 0) return [];
        let gradeGroup = [];
        gradeList.map((item, index) => {
            let obj = {
                title: item.name,
                key: item.gradeId + item.name,
                value: item.gradeId + item.name,
                children: formatClassData(item.studentGroupList),
            };
            gradeGroup.push(obj);
        });
        return gradeGroup;
    };

    //处理班级
    let formatClassData = (classList) => {
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

    if (!groupList || groupList.length < 0) return;
    let studentGroup = [];
    groupList.map((item, index) => {
        let obj = {
            title: item.name,
            key: item.type + item.name,
            value: item.type + item.name,
            children: item.gradeStudentGroupModels
                ? formatGradeData(item.gradeStudentGroupModels)
                : formatClassData(item.studentGroupList),
        };
        studentGroup.push(obj);
    });
    return studentGroup;
}
export default {
    namespace: 'timeTable',
    state: {
        operationRecordList: [],
        importCourseList: [],
        acCourseList: {},
        arrangeDetailList: [],
        classCourseList: undefined,
        scheduleNum: undefined,
        versionList: [],
        scheduleData: [],
        scheduleDataResponse: {},
        courseDetail: {},
        freeCourseDetail: {}, //自由排课查看详情
        scheduleList: [], //按节-可选课节列表
        changeTimeStatus: {}, //按节-可选课节列表-检查
        gradeListByVersion: [], //年级按照版本获取
        clickKeuScheduleList: [], //一键排课列表
        fetScheduleSuccess: {}, //一键排课提交
        departmentList: [], //人员部门列表
        studentList: [], //学生列表
        areaList: [], //场地列表
        showAcCourseList: [], // ac课程下拉列表展示
        lockCourseArr: [], //锁定课程数量
        unlockResultIdList: [], //需要解锁的结果集合
        canChangeCourse: [], //换课-可选结果
        checkChangeResult: {}, //换课--校验结果
        changeCourseDetail: {}, //换课--详情
        lastPublicContent: {}, //是否是最新版本
        accountCourseNum: {}, //自由排课要操作的数量
        fetchScheduleMessage: {}, //排课失败错误信息
        courseBySubject: [], //科目-课程级联
        fetProgress: {}, //进程进度条
        statisticsCourseNum: [], //待排课数量优化
        gradeByTypeArr: [], //自由排课--学生组优化
        getNoAddressResult: {}, //发布课表--获取无场地的课节
        scheduleCheckResult: {}, //人工预排--按节--规则校验
        deleteScheduleResult: {}, //清空某天结果的统计
        addressResult: [], //根据场地查询结果
        teacherResult: [], //根据教师查询结果
        compareVersion: [],
        editVersionMsg: '',

        customStudentList: [],
        customGroupList: [],
        customGradeList: [],
        customTeacherResult: [],

        newCanChangeCourse: [], //换课-可选结果
        newCanCheckScheduleList: [], // 待排课节可选课节列表
        conflictReasonCardInfo: null, // 冲突原因卡片信息
        fromWillSure: [], // 待排确认换课
        willGroupList: [], // 课程班级联动
        ifLoading: false, // 判断接口是否正在请求中
        ifExchangeLoading: false,
        sureActive: [], // 确认创建活动
        exportPlanGroupList: [],
        activeConflictList: [], // 活动冲突结果
        editActiveConflictList: [], // 编辑的活动冲突结果
        fetDownLoadUrl: '',
        fetFileDTO: {},
        compareVersionList: [],
        compareVersionResult: '',
        compareVersionTeacherList: [],

        scheduleCheckList: [],
        studentsCheckList: [], //未排学生定义的数组
        teacherCheckList: [], //教师关怀定义的数组

        scheduleStatusList: [],
        checkEditResult: {},
        planSubjectList: [],
        searchPeopleData: [],
        changeCourseMessage: {},
        isExpend: false,
        courseScheduleImport: [],

        bathCourseList: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, //课节数量
        xingKong: [2, 3, 4],
        tableWidthRatio: JSON.parse(localStorage.getItem('tableWidthRatio'))
            ? JSON.parse(localStorage.getItem('tableWidthRatio'))
            : 1,
        tableHeightRatio: JSON.parse(localStorage.getItem('tableHeightRatio'))
            ? JSON.parse(localStorage.getItem('tableHeightRatio'))
            : 1,
        lessonViewTableHeightRatio: JSON.parse(localStorage.getItem('lessonViewTableHeightRatio'))
            ? JSON.parse(localStorage.getItem('lessonViewTableHeightRatio'))
            : 1,
        displayType: JSON.parse(localStorage.getItem('displayType'))
            ? JSON.parse(localStorage.getItem('displayType'))
            : [2, 4],
        displayDirection: JSON.parse(localStorage.getItem('displayDirection'))
            ? JSON.parse(localStorage.getItem('displayDirection'))
            : 2,

        weekVersionCourseList: [],
        teacherIdList: [],
        studentIdList: [],

        confirmStatus: undefined,
        createMessage: '',

        tableView: localStorage.getItem('tableView')
            ? localStorage.getItem('tableView')
            : 'timeLineView',
        roomConflict: {},
        copyModalVisible: false,
        checkVersionGroupResult: false,
        copyScheduleVersionList: [],
        taskWeekVersionList: [],
    },
    effects: {
        *getTaskWeekVersionList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getTaskWeekVersionListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setTaskWeekVersionList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *acrossSemesterCopyVersion({ payload, onSuccess }, { call, put }) {
            const response = yield call(acrossSemesterCopyVersionSync, payload);
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
        *checkVersionGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkVersionGroupSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCheckVersionGroupResult',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getRoomConflict({ payload, onSuccess }, { call, put }) {
            const response = yield call(roomConflictCheckSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRoomConflict',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *splitContinuousResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(splitContinuousResultSync, payload);
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
        *setTableView({ payload }, { call, put }) {
            //  课程列表
            yield put({
                type: 'setTableViewReducers',
                payload,
            });
        },

        *getWeekVersionCourseList({ payload }, { call, put }) {
            //  课程列表
            const response = yield call(fetchWeekVersionCourseList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setWeekVersionCourseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //展示类型
        *changeDisplayType({ payload }, { put }) {
            yield put({
                type: 'setDisplayType',
                payload,
            });
        },

        //改变列表高度
        *changeTableHeight({ payload }, { put }) {
            yield put({
                type: 'setTableHight',
                payload,
            });
        },

        //改变列表宽度
        *changeTableWidth({ payload }, { put }) {
            yield put({
                type: 'setTableWidth',
                payload,
            });
        },

        //改变课节视图列表高度
        *changeLessonViewTableHeight({ payload }, { put }) {
            yield put({
                type: 'setLessonViewTableHight',
                payload,
            });
        },

        *batchDeletedAC({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchDeletedAC, payload);
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

        *batchSuspendAC({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchSuspendAC, payload);
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

        *changeWeekTeachingPlanGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(changeWeekTeachingPlanGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('调换课成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *batchArrange({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchArrange, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('一键转待排成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *deleteCoursePlanning({ payload, onSuccess }, { call, put }) {
            const response = yield call(deleteCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    /* yield put({
            type: "saveOperationRecordList",
            payload: response.content,
          });
          onSuccess && onSuccess(); */
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *uploadFetResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(uploadFetResult, payload);
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

        *courseScheduleImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(courseScheduleImport, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveCourseScheduleImport',
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

        *getOperationRecordList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getOperationRecordList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveOperationRecordList',
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

        *revokeOperationRecord({ payload, onSuccess }, { call, put }) {
            const response = yield call(revokeOperationRecord, payload);
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

        *exportExcelResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportExcelResult, payload);
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
        *searchPeople({ payload }, { call, put }) {
            const response = yield call(searchPeopleAsync, payload);
            if (!response) {
                return;
            }
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'searchPeopleReducers',
                payload:
                    response.content && response.content.teacherNameList
                        ? response.content.teacherNameList
                        : [],
            });
        },
        *coursePlanSubjectList({ payload, onSuccess }, { call, put }) {
            const response = yield call(coursePlanSubjectList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'coursePlanSubjectListInfo',
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
        *checkEditResultSchedule({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkEditResultSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkEdit',
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
        *queryScheduleStatus({ payload, onSuccess }, { call, put }) {
            const response = yield call(queryScheduleStatus, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'scheduleStatus',
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
        *getCopyByDayScheduleResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCopyByDayScheduleResult, payload);
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
        *scheduleCheck({ payload, onSuccess }, { call, put }) {
            const response = yield call(scheduleCheck, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkScheduleResult',
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

        *unListedStudents({ payload, onSuccess }, { call, put }) {
            const response = yield call(unListedStudents, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkUnListedStudents',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    yield put({
                        type: 'checkUnListedStudents',
                        payload: response.content,
                    });
                    // message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *teacherCare({ payload, onSuccess }, { call, put }) {
            const response = yield call(teacherCare, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkTeacherCare',
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

        *getCompareVersion({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCompareVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'compareVer',
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
        *getCompareVersionResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCompareVersionResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'compareVersionRes',
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

        *getCompareVersionTeacher({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCompareVersionTeacher, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'compareVersionTeacher',
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

        *downloadFetSchedule({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(downloadFetSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetUrl',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    onError && onError();
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *importByCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(importByCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getExportGroupList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getExportGroupList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'exportPlan',
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
        // 待排确认换课
        *willSureExchangeCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(willSureExchange, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fromWillSureExchange',
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
        // 课程班级联动
        *getWillGroupList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getWillGroupList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'willGroup',
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
        // 自定义请求班级结果
        *fetchGroupList({ payload, onSuccess }, { call, put }) {
            let { actionType, groupId, actionWay, searchIndex, studentGroupCanclose } = payload;
            delete payload.actionType;
            delete payload.groupId;
            delete payload.actionWay;
            delete payload.searchIndex;
            const response = yield call(findClassSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'findGroupResult',
                        payload: response.content,
                        actionType,
                        groupId,
                        actionWay,
                        searchIndex,
                        studentGroupCanclose,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 自定义请求年级结果
        *findGradeSchedule({ payload, onSuccess }, { call, put }) {
            let { actionType, groupId, actionWay, searchIndex } = payload;
            delete payload.actionType;
            delete payload.groupId;
            delete payload.actionWay;
            delete payload.searchIndex;
            const response = yield call(findGradeSchedule, payload);
            response.content =
                (response &&
                    response.content &&
                    response.content.map((el) => ({
                        ...el,
                        studentGroup: el.teachingOrgModel,
                    }))) ||
                [];
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'findGradeResult',
                        payload: response.content,
                        actionType,
                        groupId,
                        actionWay,
                        searchIndex,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 删除自定义中操作项
        *deleteCustom({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'deleteCustomItem',
                payload: payload.deleteItem,
            });
            onSuccess && onSuccess();
        },
        // 自定义请求教师结果
        *findTeacherSchedule({ payload, onSuccess }, { call, put }) {
            let { actionType, groupId, searchIndex } = payload;
            delete payload.actionType;
            delete payload.groupId;
            delete payload.searchIndex;
            const response = yield call(findTeacherSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'findTeacher',
                        payload: response.content,
                        actionType,
                        groupId,
                        searchIndex,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 自定义请求场地结果
        *findFieldSchedule({ payload }, { call, put }) {
            let { actionType, groupId, searchIndex } = payload;

            delete payload.actionType;
            delete payload.groupId;
            delete payload.searchIndex;

            const response = yield call(findFieldSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'findField',
                        payload: response.content,
                        actionType,
                        groupId,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 自定义请求学生结果
        *findStudentSchedule({ payload }, { call, put }) {
            let { actionType, groupId, actionWay, searchIndex } = payload;
            delete payload.actionType;
            delete payload.groupId;
            delete payload.actionWay;
            delete payload.searchIndex;
            const response = yield call(findStudentSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchStudentResult',
                        payload: response.content,
                        actionType,
                        groupId,
                        actionWay,
                        searchIndex,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 请求班级下拉数据
        *findGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(findGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'groupSearch',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 请求年级下拉数据

        *findGrade({ payload, onSuccess }, { call, put }) {
            const response = yield call(findGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'gradeSearch',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *findCourseIndexGrade({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'gradeSearch',
                payload: payload,
            });
        },

        *findStudentResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(findStudentResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'studentSearch',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateVersion({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *createSchedule({ payload, onSuccess }, { call, put }) {
            //新建课表
            const response = yield call(createSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('创建成功');
                    onSuccess && onSuccess();
                } else {
                    // message.error(response.message);
                    yield put({
                        type: 'createNewSchedule',
                        payload: response,
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *haveScheduleNum({ payload, onSuccess }, { call, put }) {
            //选中年级包含几个作息
            const response = yield call(haveScheduleNum, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchScheduleNum',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveVersion({ payload, onSuccess }, { call, put }) {
            //保存版本
            const response = yield call(saveVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('保存成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *searchImportCourse({ payload }, { call, put }) {
            //查询导入基础课时计划的课程
            const response = yield call(searchImportCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateImportCourse',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmImport({ payload, onSuccess }, { call }) {
            //确认导入基础课时计划
            const response = yield call(confirmImport, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('导入成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchCourseList({ payload }, { call, put }) {
            //AC课程展示列表
            const response = yield call(fetchCourseList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *setCourseList({ payload }, { put }) {
            yield put({
                type: 'updateCourseList',
                payload: payload,
            });
        },
        *fetchArrangeDetail({ payload }, { call, put }) {
            //AC待排课程详情
            const response = yield call(fetchArrangeDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateArrangeDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *setArrangeDetail({ payload }, { put }) {
            yield put({
                type: 'updateArrangeDetail',
                payload: payload,
            });
        },
        *copyCard({ payload, onSuccess }, { call, put }) {
            //复制AC
            const response = yield call(copyCard, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('复制成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteCard({ payload, onSuccess }, { call, put }) {
            //删除AC
            const response = yield call(deleteCard, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveCardTeacher({ payload, onSuccess }, { call, put }) {
            //修改AC教师
            const response = yield call(saveCardTeacher, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('修改成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *findWeekCoursePlanning({ payload }, { call, put }) {
            //修改周课时计划
            const response = yield call(findWeekCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateWeekCoursePlanning',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCopyScheduleVersionList({ payload }, { call, put }) {
            //获取周版本列表
            const response = yield call(getVersionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCopyScheduleVersionList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getVersionList({ payload }, { call, put }) {
            //获取周版本列表
            const response = yield call(getVersionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateVersionList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *setNewVersion({ payload, onSuccess }, { call, put }) {
            //设置为最新版本
            const response = yield call(setNewVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('设置成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchScheduleList({ payload, onSuccess }, { call, put }) {
            let { searchIndex } = payload;
            delete payload.searchIndex;
            let response;
            // 自定义视角添加按钮占位
            let customArr = [
                {
                    resultList: [[], [], [], [], [], [], []],
                    studentGroup: {
                        isCustomBtn: true,
                        id: 'custom',
                    },
                },
            ];
            if (searchIndex === 0) {
                response = yield call(fetchScheduleList, payload);
            } else if (searchIndex === 1) {
                response = yield call(findGradeSchedule, payload);
                response.content =
                    (response &&
                        response.content &&
                        response.content.map((el) => ({
                            ...el,
                            studentGroup: el.teachingOrgModel,
                        }))) ||
                    [];
            } else if (searchIndex === 2) {
                response = yield call(findStudentSchedule, payload);
            } else if (searchIndex === 3) {
                delete payload.courseIds;
                delete payload.freeName;
                delete payload.gradeIdList;
                delete payload.playgroundIds;
                delete payload.studentIds;
                response = yield call(findTeacherSchedule, payload);
            } else if (searchIndex === 4) {
                delete payload.courseIds;
                delete payload.freeName;
                delete payload.gradeIdList;
                delete payload.teacherIds;
                delete payload.studentIds;
                response = yield call(findFieldSchedule, payload);
            } else if (searchIndex === 5) {
                response = {
                    code: 0,
                    content: [],
                    ifAdmin: false,
                    ifLogin: true,
                    message: '成功',
                    status: true,
                };
                response.content = [...customArr];
            }

            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateScheduleList',
                        payload: {
                            data: response.content,
                            status: response,
                            searchIndex,
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
        *lookCourseDetail({ payload, onSuccess }, { call, put }) {
            //查询课程详情
            const response = yield call(lookCourseDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseDetail',
                        payload: { ...response.content, type: 1 },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *lessonViewLookCourseDetail({ payload, onSuccess }, { call, put }) {
            //查询课程详情
            const response = yield call(lookCourseDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseDetail',
                        payload: { ...response.content, type: payload.type },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *setCourseDetail({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateCourseDetail',
                payload: Object.keys(payload).length === 0 ? {} : { ...payload, type: 2 },
            });
        },

        *clearNewCanCheckScheduleList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'clearScheduleList',
            });
        },

        *deleteCourse({ payload, onSuccess }, { call, put }) {
            //删除课程
            const response = yield call(deleteCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *changeArrange({ payload, onSuccess }, { call, put }) {
            //转为待排
            const response = yield call(changeArrange, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *copyResult({ payload, onSuccess }, { call }) {
            //复制排课结果 && 复制版本
            const response = yield call(copyResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success("复制成功");
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getScheduleDetailList({ payload }, { call, put }) {
            //人工预排-可选课节列表
            const response = yield call(getScheduleDetailList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateChangeSchedule',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveChangeTime({ payload }, { call, put }) {
            //人工预排-按节-可选课节列表-检查
            const response = yield call(saveChangeTime, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateChangeTime',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *continueArrange({ payload, onSuccess }, { call, put }) {
            //人工预排冲突--点击继续
            const response = yield call(continueArrange, payload);
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
        *deletePlanningRow({ payload, onSuccess }, { call, put }) {
            //删除单个周计划
            const response = yield call(deletePlanningRow, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deletePlanningAllRow({ payload, onSuccess }, { call, put }) {
            //批量删除周计划
            const response = yield call(deletePlanningAllRow, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveWeekCoursePlanning({ payload, onSuccess }, { call, put }) {
            //更新周计划
            const response = yield call(saveWeekCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('更新成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchGradeListBySubject({ payload }, { call, put }) {
            //根据版本查询年级
            const response = yield call(fetchGradeListBySubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateGradeListBySubject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getClickKeySchedule({ payload }, { call, put }) {
            //获取一键排课的列表
            const response = yield call(getClickKeySchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateClickKeySchedule',
                        payload: response.content,
                    });
                } /* else {
                    message.error(response.message);
                } */
            } else {
                loginRedirect();
            }
        },
        *fetSchedule({ payload, onSuccess, onError }, { call, put }) {
            //一键排课提交
            const response = yield call(fetSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    onError();
                    yield put({
                        type: 'fetchScheduleMessage',
                        payload: response,
                    });
                    // message.error(response.message);
                    // Modal.error({
                    //     title: (
                    //         <div style={{height: '300px', overflowY: 'scroll'}}>
                    //             {response.message}
                    //         </div>),
                    //     okText: "知道了"
                    // })
                }
            } else {
                loginRedirect();
            }
        },
        *saveFreeScheduleTime({ payload, onSuccess }, { call, put }) {
            //待排卡片中新建自由排课
            const response = yield call(saveFreeScheduleTime, payload);
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
        *getDepartmentList({ payload, onSuccess }, { call, put }) {
            //新建自由排课--获取部门和人员
            const response = yield call(getDepartmentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchDeparmentList',
                        payload: response.content.getDepartmentList,
                    });
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getStudentList({ payload }, { call, put }) {
            //获取学生列表
            const response = yield call(getStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchStudentList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexStudentList({ payload }, { call, put }) {
            yield put({
                type: 'fetchStudentList',
                payload: payload,
            });
        },

        *createFreeCourse({ payload, onSuccess }, { call, put }) {
            //新建自由排课---活动
            const response = yield call(createFreeCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'activeConflict',
                        payload: response.content,
                    });
                    // message.success("创建成功~");
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *lookFreeCourseDetail({ payload, onSuccess }, { call, put }) {
            //查看自由活动的详情--自由排课
            const response = yield call(lookFreeCourseDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateFreeCourseDetail',
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
        *deleteFreeCourse({ payload, onSuccess }, { call, put }) {
            //删除自由排课课程
            const response = yield call(deleteFreeCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getAreaList({ payload }, { call, put }) {
            //获取场地列表
            const response = yield call(getAreaList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateAreaList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexAreaList({ payload }, { call, put }) {
            yield put({
                type: 'updateAreaList',
                payload: payload,
            });
        },

        *publishSchedule({ payload, onSuccess }, { call, put }) {
            //公布课表
            const response = yield call(publishSchedule, payload);
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
        *showAcCourseList({ payload }, { call, put }) {
            //AC课程下拉列表展示
            const response = yield call(getAcCourseList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'undateshowAcCourseList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *lockUtilLesson({ payload, onSuccess }, { call, put }) {
            //锁定单节课程
            const response = yield call(lockUtilLesson, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('锁定成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *unLockUtilLesson({ payload, onSuccess }, { call, put }) {
            //解锁单节课程
            const response = yield call(unLockUtilLesson, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('解锁成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmLock({ payload, onSuccess }, { call, put }) {
            //确认锁定课程
            const response = yield call(confirmLock, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(`批量${payload.lockType === 1 ? '锁定' : '解锁'}操作完成~`);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmUpdate({ payload, onSuccess }, { call, put }) {
            //确认调整节次
            const response = yield call(confirmUpdate, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('批量操作完成~');
                    onSuccess && onSuccess();
                } /* else {
                    message.error(response.message);
                } */
                yield put({
                    type: 'updateConfirmStatus',
                    payload: response,
                });
            } else {
                loginRedirect();
            }
        },
        *exchangeClass({ payload, onSuccess }, { call, put }) {
            //调课换课
            const response = yield call(exchangeClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                    yield put({
                        type: 'updateCanChangeClass',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *newExchangeClass({ payload, onSuccess, onError }, { call, put }) {
            yield put({
                type: 'exchangeLoading',
                payload: true,
            });
            const response = yield call(newExchangeClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newUpdateCanChangeClass',
                        payload: response.content,
                    });
                    yield put({
                        type: 'exchangeLoading',
                        payload: false,
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

        *newCheckScheduleList({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(newCheckScheduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getNewCheckScheduleList',
                        payload: response.content || [],
                    });
                    onSuccess && onSuccess();
                } else {
                    onError && onError(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *conflictReasonCard({ payload, onSuccess, onError }, { call, put }) {
            yield put({
                type: 'updateLoading',
                payload: true,
            });
            const response = yield call(conflictReasonCard, payload);
            if (response.ifLogin) {
                if (response.status || response.code == 1518) {
                    yield put({
                        type: 'getConflictReasonCard',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    yield put({
                        type: 'clearConflictReasonCardInfo',
                        payload: response.content,
                    });
                    yield put({
                        type: 'updateLoading',
                        payload: false,
                    });
                    message.error(response.message);
                    onError && onError();
                }
            } else {
                yield put({
                    type: 'updateLoading',
                    payload: false,
                });
                loginRedirect();
            }
        },

        *validateCanChange({ payload, onSuccess }, { call, put }) {
            //换课-校验
            const response = yield call(validateCanChange, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getChangeCourseResult',
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
        *getExchangeResult({ payload }, { call, put }) {
            //换课--详情
            const response = yield call(getExchangeResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getChangeCourseDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *lastPublic({ payload, onSuccess }, { call, put }) {
            //判断当前版本是否是最新发布版本
            const response = yield call(lastPublic, payload);

            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getPublicResult',
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
        *finishExchangeCourse({ payload, onSuccess }, { call, put }) {
            //确认调课换课
            const response = yield call(finishExchangeCourse, payload);
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
        *editSystemCourse({ payload, onSuccess }, { call, put }) {
            //编辑系统排课结果
            const response = yield call(editSystemCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('系统排课编辑成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *editFreeCourse({ payload, onSuccess }, { call, put }) {
            //编辑自由排课结果
            const response = yield call(editFreeCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'editActiveConflict',
                        payload: response.content,
                    });
                    // message.success("自由排课编辑成功~");
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmCourseNum({ payload, onSuccess }, { call, put }) {
            //自由排课涉及到课程的数量
            const response = yield call(confirmCourseNum, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'accountCourseNum',
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

        *fetchCourseBySubject({ payload, onSuccess }, { call, put }) {
            //科目-课程级联
            const response = yield call(fetchCourseBySubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseBySubject',
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

        *fetchCourseIndexCourseBySubject({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateCourseBySubject',
                payload: payload,
            });
        },

        *getFetProgress({ payload, onSuccess }, { call, put }) {
            //fet进程查询
            const response = yield call(getFetProgress, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchFetProgress',
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
        *stopFetCourse({ payload, onSuccess }, { call, put }) {
            //终止fet排课
            const response = yield call(stopFetCourse, payload);
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
        *statisticsCourse({ payload, onSuccess }, { call, put }) {
            //待排课数量优化
            const response = yield call(statisticsCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getStatisticsCourseNum',
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
        *getGradeByType({ payload }, { call, put }) {
            //自由排课--学生组组件优化
            const response = yield call(getGradeByType, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchGradeByType',
                        payload: formatStudentGroup(response.content),
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *searchNoAddress({ payload, onSuccess, onError }, { call, put }) {
            //公布课表--查询缺失场地的课节
            const response = yield call(searchNoAddress, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNoAddress',
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
        *manualScheduleCheck({ payload, onSuccess }, { call, put }) {
            //人工预排--按节次-规则校验
            const response = yield call(manualScheduleCheck, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchScheduleCheck',
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
        *changeFreeArrange({ payload, onSuccess }, { call, put }) {
            //AC自由排课--转为待排
            const response = yield call(changeFreeArrange, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *scheduleResultNumber({ payload, onSuccess }, { call, put }) {
            //清空某天自由排课的的统计
            const response = yield call(scheduleResultNumber, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateScheduleResult',
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
        *confirmDelete({ payload, onSuccess }, { call, put }) {
            //确认清空某天的结果
            const response = yield call(confirmDelete, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('排课结果清除成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchAddressResult({ payload, onSuccess }, { call, put }) {
            //根据场地查询结果
            const response = yield call(fetchAddressResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateAddressResult',
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
        *fetchTeacherResult({ payload, onSuccess }, { call, put }) {
            //根据教师查询结果
            const response = yield call(fetchTeacherResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateTeacherResult',
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
        *compareVersion({ payload, onSuccess }, { call, put }) {
            //版本对比
            const response = yield call(compareVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatecompareVersion',
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
        *versionGrade({ payload, onSuccess }, { call, put }) {
            //适用年级
            const response = yield call(versionGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateversionGrade',
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
        *dealCustomChange({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'customChange',
                payload: payload.studentGroupId,
            });
        },

        // 确认创建自由活动
        *sureCreat({ payload, onSuccess }, { call, put }) {
            const response = yield call(sureCreateActive, payload);

            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'confirmCreateActive',
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
        *deposit({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'deposit_teacherIds',
                payload,
            });
        },
        *studentIds({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'deposit_studentIds',
                payload,
            });
        },
    },
    reducers: {
        updateCopyScheduleVersionList(state, { payload }) {
            return {
                ...state,
                copyScheduleVersionList: payload,
            };
        },
        setTaskWeekVersionList(state, { payload }) {
            return {
                ...state,
                taskWeekVersionList: payload,
            };
        },
        setCheckVersionGroupResult(state, { payload }) {
            return {
                ...state,
                checkVersionGroupResult: payload,
            };
        },
        setCopyModalVisible(state, { payload }) {
            return {
                ...state,
                copyModalVisible: payload,
            };
        },
        setRoomConflict(state, { payload }) {
            return {
                ...state,
                roomConflict: payload,
            };
        },
        setTableViewReducers(state, { payload }) {
            return {
                ...state,
                tableView: payload,
            };
        },

        setWeekVersionCourseList(state, { payload }) {
            return {
                ...state,
                weekVersionCourseList: payload,
            };
        },
        setDisplayType(state, { payload }) {
            return {
                ...state,
                displayType: payload,
            };
        },
        setDisplayDirection(state, { payload }) {
            return {
                ...state,
                displayDirection: payload,
            };
        },

        setTableHight(state, { payload }) {
            return {
                ...state,
                tableHeightRatio: payload,
            };
        },

        setTableWidth(state, { payload }) {
            return {
                ...state,
                tableWidthRatio: payload,
            };
        },

        setLessonViewTableHight(state, { payload }) {
            return {
                ...state,
                lessonViewTableHeightRatio: payload,
            };
        },

        saveOperationRecordList(state, { payload }) {
            return {
                ...state,
                operationRecordList: payload,
            };
        },

        searchScheduleStatus(_, { payload }) {
            return {
                isExpend: payload,
            };
        },

        changeCourseMessage(state, { payload }) {
            return {
                ...state,
                changeCourseMessage: payload,
            };
        },

        searchPeopleReducers(state, { payload }) {
            return {
                payload,
            };
        },
        coursePlanSubjectListInfo(state, action) {
            return {
                ...state,
                planSubjectList: action.payload,
            };
        },
        checkEdit(state, action) {
            return {
                ...state,
                checkEditResult: action.payload,
            };
        },
        clearCheck(state, action) {
            return {
                ...state,
                checkEditResult: '',
            };
        },
        scheduleStatus(state, action) {
            return {
                ...state,
                scheduleStatusList: action.payload,
            };
        },
        checkScheduleResult(state, action) {
            return {
                ...state,
                scheduleCheckList: action.payload,
            };
        },
        // 未排学生
        checkUnListedStudents(state, action) {
            return {
                ...state,
                studentsCheckList: action.payload,
            };
        },
        //教师关怀
        checkTeacherCare(state, action) {
            return {
                ...state,
                teacherCheckList: action.payload,
            };
        },
        willGroup(state, action) {
            return {
                ...state,
                willGroupList: action.payload,
            };
        },
        fetchStudentResult(state, action) {
            let oldData = JSON.stringify(state.scheduleData)
                ? JSON.parse(JSON.stringify(state.scheduleData))
                : [];
            let result;
            let idx = null;
            let groupId = action.groupId, // 课程详情中点击教师所在的班级id
                length = oldData && oldData.length;

            if (action.searchIndex == 2) {
                // 学生视角查询学生直接更新当前列表
                action.payload &&
                    action.payload.length > 0 &&
                    action.payload.map((item) => {
                        item.studentGroup.view = 'student';
                        return item;
                    });
                // 判断添加行在原数组中是否存在，存在替换，不存在添加
                result = cycleScheduleData(
                    oldData,
                    action.payload.length > 1 ? action.payload : action.payload[0]
                );
            } else {
                if (action.actionType == 'custom') {
                    if (
                        !oldData.length ||
                        (oldData[oldData.length - 1].studentGroup.id != 'custom' &&
                            action.actionWay != '双击调换' &&
                            action.searchIndex == 5)
                    ) {
                        // 自定义视角下判断有无添加按钮，无加入添加按钮
                        oldData.push({
                            resultList: [[], [], [], [], [], [], []],
                            studentGroup: {
                                isCustomBtn: true,
                                id: 'custom',
                            },
                        });
                    }
                    // 遍历定义每行课表的type和删除状态
                    for (let i = 0; i < action.payload.length; i++) {
                        action.payload[i].studentGroup.view = 'student';
                        if (action.searchIndex !== 0) {
                            action.payload[i].studentGroup.canClose = true;
                        }
                    }
                    if (action.actionWay == '双击调换') {
                        for (let i = 0; i < oldData.length; i++) {
                            let canClose = oldData[i].studentGroup.canClose;
                            if (canClose) {
                                // 带入添加行课表
                                action.payload.push(oldData[i]);
                            }
                        }
                        result = action.payload;
                    } else {
                        // 判断添加行在原数组中是否存在，存在替换，不存在添加
                        result = cycleScheduleData(
                            oldData,
                            action.payload.length > 1 ? action.payload : action.payload[0]
                        );
                    }
                } else if (action.actionType == 'detail') {
                    // 点击详情或冲突原因添加行
                    action.payload[0].studentGroup.canClose = true;
                    action.payload[0].studentGroup.view = 'student';
                    // 找到双击或课表操作的位置，添加到操作班级的下一行
                    for (let i = 0; i < length; i++) {
                        if (groupId == oldData[i].studentGroup.id) {
                            idx = i;
                            break;
                        }
                    }
                    oldData.splice(idx + 1, 0, action.payload[0]);
                    result = oldData;
                }
                return {
                    ...state,
                    scheduleData: result,
                };
            }
            return {
                ...state,
                scheduleData: result,
            };
        },
        fromWillSureExchange(state, action) {
            return {
                ...state,
                fromWillSure: action.payload,
            };
        },
        updateLoading(state, action) {
            return {
                ...state,
                ifLoading: action.payload,
            };
        },
        clearConflictReasonCardInfo(state, action) {
            return {
                ...state,
                conflictReasonCardInfo: null,
            };
        },
        exchangeLoading(state, action) {
            return {
                ...state,
                ifExchangeLoading: action.payload,
            };
        },
        findGroupResult(state, action) {
            let result;
            let groupId = action.groupId, // 课程详情中点击教师所在的班级id
                idx = null;
            let oldData = JSON.parse(JSON.stringify(state.scheduleData)),
                length = oldData && oldData.length;

            if (action.actionType == 'custom') {
                // 自定义视角添加行
                // 自定义视角下：没有课表数据 || 课表最后一行id不为custom && 不是双击调换课触发 && 自定义视角
                if (
                    !oldData.length ||
                    (oldData[oldData.length - 1].studentGroup.id != 'custom' &&
                        action.actionWay != '双击调换' &&
                        action.searchIndex == 5)
                ) {
                    // 自定义视角下判断有无添加按钮，无加入添加按钮
                    oldData.push({
                        resultList: [[], [], [], [], [], [], []],
                        studentGroup: {
                            isCustomBtn: true,
                            id: 'custom',
                        },
                    });
                }
                // 遍历定义每行课表的type和删除状态
                for (let i = 0; i < action.payload.length; i++) {
                    action.payload[i].studentGroup.view = 'group';
                    if (action.searchIndex !== 0 || action.studentGroupCanclose) {
                        action.payload[i].studentGroup.canClose = true;
                    }
                }
                if (action.actionWay == '双击调换') {
                    for (let i = 0; i < oldData.length; i++) {
                        let canClose = oldData[i].studentGroup.canClose;
                        if (canClose) {
                            // 带入添加行课表
                            action.payload.push(oldData[i]);
                        }
                    }
                    result = action.payload;
                } else {
                    // 判断添加行在原数组中是否存在，存在替换，不存在添加
                    result = cycleScheduleData(
                        oldData,
                        action.payload.length > 1 ? action.payload : action.payload[0]
                    );
                }
            } else if (action.actionType == 'detail') {
                // 点击详情或冲突原因添加行
                action.payload[0].studentGroup.canClose = true;
                // 找到双击或课表操作的位置，添加到操作班级的下一行
                for (let i = 0; i < length; i++) {
                    if (groupId == oldData[i].studentGroup.id) {
                        idx = i;
                        break;
                    }
                }
                for (let j = 0; j < action.payload.length; j++) {
                    action.payload[j].studentGroup.view = 'group';
                    action.payload[j].studentGroup.canClose = true;
                    oldData.splice(idx + 1, 0, action.payload[j]);
                }

                result = oldData;
            }
            return {
                ...state,
                scheduleData: result,
            };
        },
        findGradeResult(state, action) {
            let groupId = action.groupId; // 课程详情中点击教师所在的班级id
            let result;
            let idx = null;
            let oldData = JSON.parse(JSON.stringify(state.scheduleData));
            length = oldData && oldData.length;
            if (action.actionType == 'custom') {
                if (
                    !oldData.length ||
                    (oldData[oldData.length - 1].studentGroup.id != 'custom' &&
                        action.actionWay != '双击调换' &&
                        action.searchIndex == 5)
                ) {
                    oldData.push({
                        resultList: [[], [], [], [], [], [], []],
                        studentGroup: {
                            isCustomBtn: true,
                            id: 'custom',
                        },
                    });
                }
                // 遍历定义每行课表的type和删除状态
                for (let i = 0; i < action.payload.length; i++) {
                    action.payload[i].studentGroup.view = 'grade';
                    if (action.searchIndex !== 0) {
                        action.payload[i].studentGroup.canClose = true;
                    }
                }
                if (action.actionWay == '双击调换') {
                    for (let i = 0; i < oldData.length; i++) {
                        let canClose = oldData[i].studentGroup.canClose;
                        if (canClose) {
                            // 带入添加行课表
                            action.payload.push(oldData[i]);
                        }
                    }
                    result = action.payload;
                } else {
                    // 判断添加行在原数组中是否存在，存在替换，不存在添加
                    result = cycleScheduleData(
                        oldData,
                        action.payload.length > 1 ? action.payload : action.payload[0]
                    );
                }
            } else if (action.actionType == 'detail') {
                // 点击详情或冲突原因添加行
                action.payload[0].studentGroup.canClose = true;
                action.payload[0].studentGroup.view = 'grade';
                // 找到双击或课表操作的位置，添加到操作班级的下一行
                for (let i = 0; i < length; i++) {
                    if (groupId == oldData[i].studentGroup.id) {
                        idx = i;
                        break;
                    }
                }
                oldData.splice(idx + 1, 0, action.payload[0]);
                result = oldData;
            }
            return {
                ...state,
                scheduleData: result,
            };
        },
        findField(state, action) {
            let groupId = action.groupId, // 课程详情中点击教师所在的班级id
                idx = null;
            let oldData = JSON.parse(JSON.stringify(state.scheduleData)),
                length = oldData && oldData.length;
            let result;
            if (action.actionType == 'custom') {
                action.payload[0].studentGroup.view = 'address';
                action.payload[0].studentGroup.canClose = true;
                result = cycleScheduleData(oldData, action.payload[0]);
            } else if (action.actionType == 'detail') {
                action.payload[0].studentGroup.canClose = true;
                action.payload[0].studentGroup.view = 'address';
                // 找到双击或课表操作的位置，添加到操作班级的下一行
                for (let i = 0; i < length; i++) {
                    if (groupId == oldData[i].studentGroup.id) {
                        idx = i;
                        break;
                    }
                }
                oldData.splice(idx + 1, 0, action.payload[0]);
                result = oldData;
            }
            return {
                ...state,
                scheduleData: [...result],
            };
        },
        findTeacher(state, action) {
            let groupId = action.groupId, // 课程详情中点击教师所在的班级id
                idx = null;
            let oldData = JSON.parse(JSON.stringify(state.scheduleData)),
                length = oldData && oldData.length;
            let result;
            if (action.searchIndex == 3) {
                result =
                    action.payload &&
                    action.payload.length > 0 &&
                    action.payload.map((item) => {
                        item.studentGroup.view = 'teacher';
                        return item;
                    });
            }
            if (action.actionType == 'custom') {
                // 自定义视角
                action.payload[0].studentGroup.view = 'teacher';
                if (action.searchIndex !== 3) {
                    action.payload[0].studentGroup.canClose = true;
                }
                result = cycleScheduleData(oldData, action.payload[0]);
            } else if (action.actionType == 'detail' && action.payload[0]) {
                action.payload[0].studentGroup.canClose = true;
                action.payload[0].studentGroup.view = 'teacher';
                for (let i = 0; i < length; i++) {
                    if (groupId == oldData[i].studentGroup.id) {
                        idx = i;
                        break;
                    }
                }
                oldData.splice(idx + 1, 0, action.payload[0] || {});
                result = oldData;
            }
            return {
                ...state,
                customTeacherResult: action.payload,
                scheduleData: [...result],
            };
        },
        updateImportCourse(state, action) {
            return {
                ...state,
                importCourseList: action.payload,
            };
        },
        updateCourseList(state, action) {
            return {
                ...state,
                acCourseList: action.payload,
            };
        },
        updateArrangeDetail(state, action) {
            return {
                ...state,
                arrangeDetailList: action.payload,
            };
        },
        updateWeekCoursePlanning(state, action) {
            return {
                ...state,
                classCourseList: action.payload,
            };
        },
        fetchScheduleNum(state, action) {
            return {
                ...state,
                scheduleNum: action.payload,
            };
        },
        createNewSchedule(state, action) {
            return {
                ...state,
                createMessage: action.payload,
            };
        },
        updateVersionList(state, action) {
            return {
                ...state,
                versionList: action.payload,
            };
        },

        updateScheduleList(state, action) {
            let index = action.payload.searchIndex;
            //统计锁定课节的数量
            let allCourse = JSON.stringify(action.payload.data)
                ? JSON.parse(JSON.stringify(action.payload.data))
                : [];
            let lockCourseArr = [];
            allCourse =
                allCourse &&
                allCourse.length > 0 &&
                allCourse.map((item) => {
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId && list.ifLock) {
                                        lockCourseArr.push(list.resultId);
                                    }
                                });
                        });
                    if (index == 0) {
                        item.studentGroup.view = 'group';
                    } else if (index == 1) {
                        item.studentGroup.view = 'grade';
                    } else if (index == 2) {
                        item.studentGroup.view = 'student';
                    } else if (index == 3) {
                        item.studentGroup.view = 'teacher';
                    } else if (index == 4) {
                        item.studentGroup.view = 'address';
                    }
                    return item;
                });

            return {
                ...state,
                scheduleData: allCourse,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: [],
                scheduleDataResponse: action.payload.status,
            };
        },
        updateCourseDetail(state, action) {
            return {
                ...state,
                courseDetail: action.payload,
            };
        },
        clearScheduleList(state, action) {
            return {
                ...state,
                newCanCheckScheduleList: [],
            };
        },

        updateChangeSchedule(state, action) {
            return {
                ...state,
                scheduleList: action.payload,
            };
        },
        updateChangeTime(state, action) {
            return {
                ...state,
                changeTimeStatus: action.payload,
            };
        },
        updateGradeListBySubject(state, action) {
            return {
                ...state,
                gradeListByVersion: action.payload,
            };
        },
        updateClickKeySchedule(state, action) {
            return {
                ...state,
                clickKeuScheduleList: action.payload,
            };
        },
        addPlanningRow(state, action) {
            //添加行
            let newClassCourseList = Object.assign({}, state.classCourseList);
            let groups = newClassCourseList['groups'].concat();
            let effictiveIndex = action.payload.effictiveIndex;
            let copyResult = action.payload.rowDetail;
            groups.map((item, index) => {
                if (index == effictiveIndex) {
                    item.weekCoursePlanningOutputModelList.push(copyResult);
                }
            });
            return {
                ...state,
                classCourseList: newClassCourseList,
            };
        },
        saveUserChange(state, action) {
            //行修改暂存
            let newClassCourseList = Object.assign({}, state.classCourseList);
            let groups = newClassCourseList['groups'].concat();
            let fatherKey = action.payload.fatherKey;
            let groupIndex = action.payload.groupIndex;
            let editItem = action.payload.editItem;
            let mainTeacherInfoList = action.payload.mainTeacherInfoList; //主教老师
            let assistTeacherInfoList = action.payload.assistTeacherInfoList; //辅教老师
            let newWeekLessons = action.payload.newWeekLessons; //周课节
            let unitDuration = action.payload.unitDuration; //单节时长
            let onceLessons = action.payload.onceLessons; //连排数量
            let frequency = action.payload.singleOrNot; //连排数量
            let minValue = action.payload.minValue;
            let weekLessons = action.payload.weekLessons;
            groups.map((item, index) => {
                if (index == fatherKey) {
                    item.weekCoursePlanningOutputModelList.map((el, order) => {
                        if (order == groupIndex) {
                            switch (editItem) {
                                case 'mainTeacherInfoList':
                                    el.mainTeacherInfoList = mainTeacherInfoList;
                                    break;
                                case 'assistTeacherInfoList':
                                    el.assistTeacherInfoList = assistTeacherInfoList;
                                    break;
                                case 'weekLessons':
                                    el.newWeekLessons = newWeekLessons;
                                    el.minValue = minValue;
                                    break;
                                case 'unitDuration':
                                    el.unitDuration = unitDuration;
                                    break;
                                case 'onceLessons':
                                    el.onceLessons = onceLessons;
                                    break;
                                case 'singleOrNot':
                                    el.frequency = frequency;
                                    break;
                            }
                        }
                    });
                }
            });
            return {
                ...state,
                classCourseList: newClassCourseList,
            };
        },
        // saveUserChange(state, action) {
        //     //行修改暂存
        //     let newClassCourseList = Object.assign({}, state.classCourseList);
        //     let groups = newClassCourseList["groups"].concat();
        //     let fatherKey = action.payload.fatherKey;
        //     let groupIndex = action.payload.groupIndex;
        //     let editItem = action.payload.editItem;
        //     let mainTeacherInfoList = action.payload.mainTeacherInfoList;//主教老师
        //     let assistTeacherInfoList = action.payload.assistTeacherInfoList;//辅教老师
        //     let weekLessons = action.payload.weekLessons;//周课节
        //     let unitDuration = action.payload.unitDuration;//单节时长
        //     let onceLessons = action.payload.onceLessons;//连排数量
        //     groups.map((item, index) => {
        //         if (index == fatherKey) {
        //             item.weekCoursePlanningOutputModelList.map((el, order) => {
        //                 if (order == groupIndex) {
        //                     switch (editItem) {
        //                         case "mainTeacherInfoList":
        //                             el.mainTeacherInfoList = mainTeacherInfoList;
        //                             break;
        //                         case "assistTeacherInfoList":
        //                             el.assistTeacherInfoList = assistTeacherInfoList;
        //                             break;
        //                         case "weekLessons":
        //                             el.weekLessons = weekLessons;
        //                             break;
        //                         case "unitDuration":
        //                             el.unitDuration = unitDuration;
        //                             break;
        //                         case "onceLessons":
        //                             el.onceLessons = onceLessons;
        //                             break;
        //                     }

        //                 }
        //             })
        //         }
        //     })
        //     return {
        //         ...state,
        //         classCourseList: newClassCourseList
        //     }
        // },

        deleteOwnPlanningRow(state, action) {
            //删除行
            let newClassCourseList = JSON.parse(JSON.stringify(state.classCourseList));
            let groups = newClassCourseList['groups'].concat();
            let fatherKey = action.payload.fatherKey;
            let groupIndex = action.payload.groupIndex;
            groups.map((item, index) => {
                if (index == fatherKey) {
                    item.weekCoursePlanningOutputModelList.map((el, order) => {
                        if (order == groupIndex) {
                            item.weekCoursePlanningOutputModelList.splice(order, 1);
                        }
                    });
                }
            });
            return {
                ...state,
                classCourseList: newClassCourseList,
            };
        },
        fetchDeparmentList(state, action) {
            return {
                ...state,
                departmentList: action.payload,
            };
        },
        fetchStudentList(state, action) {
            return {
                ...state,
                studentList: action.payload,
            };
        },
        updateFreeCourseDetail(state, action) {
            return {
                ...state,
                freeCourseDetail: action.payload,
            };
        },
        updateAreaList(state, action) {
            return {
                ...state,
                areaList: action.payload,
            };
        },
        undateshowAcCourseList(state, action) {
            return {
                ...state,
                showAcCourseList: action.payload,
            };
        },
        lockAllClassCourse(state, action) {
            //根据班级锁定
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let studentGroupId = action.payload.id;
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let choiceScheduleDetailId = action.payload.baseScheduleDetailId;
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    if (item.studentGroup && item.studentGroup.id == studentGroupId) {
                        item.studentGroup.allLock = true;
                        item.resultList &&
                            item.resultList.length > 0 &&
                            item.resultList.map((el, order) => {
                                el &&
                                    el.length > 0 &&
                                    el.map((list) => {
                                        if (list.resultId) {
                                            list.ifLock = true;
                                            lockCourseArr.push(list.resultId);
                                            if (unlockResultIdList.indexOf(list.resultId) != -1) {
                                                let index = unlockResultIdList.indexOf(
                                                    list.resultId
                                                );
                                                unlockResultIdList.splice(index, 1);
                                            }
                                        }
                                    });
                            });
                    }
                });
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },
        unLockAllClassCourse(state, action) {
            //根据班级解锁
            let unLockCourseById = JSON.parse(JSON.stringify(state.scheduleData));
            let studentGroupId = action.payload.id;
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            unLockCourseById &&
                unLockCourseById.length > 0 &&
                unLockCourseById.map((item) => {
                    if (item.studentGroup && item.studentGroup.id == studentGroupId) {
                        item.studentGroup.allLock = false;
                        // item.studentGroup.allChoice = false;
                        item.resultList &&
                            item.resultList.length > 0 &&
                            item.resultList.map((el, order) => {
                                el &&
                                    el.length > 0 &&
                                    el.map((list) => {
                                        if (list.resultId) {
                                            list.ifLock = false;
                                            unlockResultIdList.push(list.resultId);
                                            if (lockCourseArr.indexOf(list.resultId) != -1) {
                                                let index = lockCourseArr.indexOf(list.resultId);
                                                lockCourseArr.splice(index, 1);
                                            }
                                        }
                                    });
                            });
                    }
                });
            return {
                ...state,
                scheduleData: unLockCourseById,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },
        //将全部weekDay的课节id填到 bathCourseList[weekDayRow] 里
        lockAll(state, action) {
            //全部锁定
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));

            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el, order) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifLock = true;
                                        bathCourseList[order].push(list.resultId);
                                    }
                                });
                        });
                });
            console.log('bathCourseList', bathCourseList);
            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    courseResultIdList.push(...course);
                }
            });

            return {
                ...state,
                scheduleData: scheduleDataCopy,
                bathCourseList,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
                // lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: [],
            };
        },

        unLockAll(state, action) {
            //全部解锁
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));

            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.studentGroup.allLock = false;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el, order) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    //将解锁到课节id从lockCourseArr去除
                                    if (list.resultId) {
                                        list.ifLock = false;
                                        unlockResultIdList.push(list.resultId);
                                    }
                                });
                        });
                });
            console.log('unlockResultIdList', unlockResultIdList);
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                bathCourseList,
                lockCourseArr: [],
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },
        // lockAll(state, action) {
        //     //全部锁定
        //     let lockAllCourse = JSON.parse(JSON.stringify(state.scheduleData));
        //     let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
        //     lockAllCourse &&
        //         lockAllCourse.length > 0 &&
        //         lockAllCourse.map((item) => {
        //             item.studentGroup.allLock = true;
        //             item.resultList &&
        //                 item.resultList.length > 0 &&
        //                 item.resultList.map((el) => {
        //                     el &&
        //                         el.length > 0 &&
        //                         el.map((list) => {
        //                             if (list.resultId) {
        //                                 list.ifLock = true;
        //                                 lockCourseArr.push(list.resultId);
        //                             }
        //                         });
        //                 });
        //         });
        //     return {
        //         ...state,
        //         scheduleData: lockAllCourse,
        //         lockCourseArr: Array.from(new Set(lockCourseArr)),
        //         unlockResultIdList: [],
        //     };
        // },
        // unLockAll(state, action) {
        //     //全部解锁
        //     let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
        //     let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
        //     scheduleDataCopy &&
        //         scheduleDataCopy.length > 0 &&
        //         scheduleDataCopy.map((item) => {
        //             item.studentGroup.allLock = false;
        //             item.resultList &&
        //                 item.resultList.length > 0 &&
        //                 item.resultList.map((el) => {
        //                     el &&
        //                         el.length > 0 &&
        //                         el.map((list) => {
        //                             if (list.resultId) {
        //                                 list.ifLock = false;
        //                                 unlockResultIdList.push(list.resultId);
        //                             }
        //                         });
        //                 });
        //         });
        //     return {
        //         ...state,
        //         scheduleData: scheduleDataCopy,
        //         lockCourseArr: [],
        //         unlockResultIdList: Array.from(new Set(unlockResultIdList)),
        //     };
        // },

        transferToWaitingAll(state, action) {
            //全部转待排
            let lockAllCourse = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            lockAllCourse &&
                lockAllCourse.length > 0 &&
                lockAllCourse.map((item) => {
                    // item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = true;
                                        lockCourseArr.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: lockAllCourse,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: [],
            };
        },

        unTransferToWaitingAll(state, action) {
            //全部取消转待排
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    // item.studentGroup.allLock = false;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = false;
                                        unlockResultIdList.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                lockCourseArr: [],
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        copyAll(state, action) {
            //全部转待排
            let lockAllCourse = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            lockAllCourse &&
                lockAllCourse.length > 0 &&
                lockAllCourse.map((item) => {
                    // item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = true;
                                        lockCourseArr.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: lockAllCourse,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: [],
            };
        },

        unCopyAll(state, action) {
            //全部取消转待排
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    // item.studentGroup.allLock = false;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = false;
                                        unlockResultIdList.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                lockCourseArr: [],
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        AdjustmentAll(state, action) {
            //全部调整
            let lockAllCourse = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            lockAllCourse &&
                lockAllCourse.length > 0 &&
                lockAllCourse.map((item) => {
                    // item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = true;
                                        lockCourseArr.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: lockAllCourse,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: [],
            };
        },
        unAdjustmentAll(state, action) {
            //全部取消调整
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    // item.studentGroup.allLock = false;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId) {
                                        list.ifChoice = false;
                                        unlockResultIdList.push(list.resultId);
                                    }
                                });
                        });
                });
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                lockCourseArr: [],
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        WaitingListChoiceAllClassCourse(state, action) {
            //根据班级转待排
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let studentGroupId = action.payload.id;
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let choiceScheduleDetailId = action.payload.baseScheduleDetailId;
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    if (item.studentGroup && item.studentGroup.id == studentGroupId) {
                        // item.studentGroup.allLock = true;
                        item.resultList &&
                            item.resultList.length > 0 &&
                            item.resultList.map((el, order) => {
                                el &&
                                    el.length > 0 &&
                                    el.map((list) => {
                                        if (list.resultId) {
                                            list.ifChoice = true;
                                            lockCourseArr.push(list.resultId);
                                            if (unlockResultIdList.indexOf(list.resultId) != -1) {
                                                let index = unlockResultIdList.indexOf(
                                                    list.resultId
                                                );
                                                unlockResultIdList.splice(index, 1);
                                            }
                                        }
                                        // if(!list.detail && list.id == choiceScheduleDetailId){
                                        //   // let choiceScheduleDetailId=list.id;
                                        //   // (item.resultList.baseScheduleId && item.resultList.id==choiceScheduleDetailId)
                                        //   baseScheduleDetailId:choiceScheduleDetailId
                                        // }
                                    });
                            });
                    }
                });
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },
        unWaitingListChoiceAllClassCourse(state, action) {
            //根据班级转待排
            let unLockCourseById = JSON.parse(JSON.stringify(state.scheduleData));
            let studentGroupId = action.payload.id;
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            unLockCourseById &&
                unLockCourseById.length > 0 &&
                unLockCourseById.map((item) => {
                    if (item.studentGroup && item.studentGroup.id == studentGroupId) {
                        //     item.studentGroup.allLock = false;
                        // item.studentGroup.allChoice = false;
                        item.resultList &&
                            item.resultList.length > 0 &&
                            item.resultList.map((el, order) => {
                                el &&
                                    el.length > 0 &&
                                    el.map((list) => {
                                        if (list.resultId) {
                                            list.ifChoice = false;
                                            unlockResultIdList.push(list.resultId);
                                            if (lockCourseArr.indexOf(list.resultId) != -1) {
                                                let index = lockCourseArr.indexOf(list.resultId);
                                                lockCourseArr.splice(index, 1);
                                            }
                                        }
                                    });
                            });
                    }
                });
            return {
                ...state,
                scheduleData: unLockCourseById,
                lockCourseArr: Array.from(new Set(lockCourseArr)),
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        //批量删除、批量调整节次、批量转待排 选中
        choiceAllWeekDayCourse(state, action) {
            //根据周几选择调整课节
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el, order) => {
                            if (el.acDuration) {
                                el.ifChoice = true;
                                bathCourseList[weekDayRow].push(el.resultId);
                            }
                        });
                    // }
                });

            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    courseResultIdList.push(...course);
                }
            });

            return {
                ...state,
                bathCourseList,
                scheduleData: scheduleDataCopy,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        //批量删除、批量调整节次、批量转待排 取消
        unChoiceAllWeekDayCourse(state, action) {
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el) => {
                            if (el.acDuration) {
                                el.ifChoice = false;
                                unlockResultIdList.push(el.resultId);
                                if (lockCourseArr.indexOf(el.resultId) != -1) {
                                    let index = lockCourseArr.indexOf(el.resultId);
                                    lockCourseArr.splice(index, 1);
                                }
                            }
                        });
                });

            let list = lockCourseArr.filter((item) => {
                if (!unlockResultIdList.includes(item)) return item;
            });

            return {
                ...state,
                bathCourseList,
                scheduleData: scheduleDataCopy,
                lockCourseArr: list,
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        //锁定所选weekday所有course
        lockAllWeekDayCourse(state, action) {
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            //将所选weekDay的课节id填到 bathCourseList[weekDayRow] 里
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el, order) => {
                            if (el.resultId) {
                                bathCourseList[weekDayRow].push(el.resultId);
                                el.ifLock = true;
                            }
                        });
                });

            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    courseResultIdList.push(...course);
                }
            });
            console.log('bathCourseList', bathCourseList);
            console.log('courseResultIdList', courseResultIdList);
            let arr = [];
            let list =
                state.scheduleData &&
                state.scheduleData.length > 0 &&
                state.scheduleData.map((item) => {
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((item2) => {
                                    if (item2.acDuration) {
                                        arr.push(item2.resultId);
                                    }
                                });
                            // return el.resultId;
                        });
                });
            console.log('arr>>>', uniq(arr));
            // console.log('lockArr>>>>>', lockCourseArr);
            let unLockList = xorWith(uniq(arr), courseResultIdList);
            console.log('unlockArr>>>', unLockList);
            return {
                ...state,
                scheduleData: scheduleDataCopy,
                bathCourseList,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
                // unlockResultIdList: Array.from(new Set(unlockResultIdList)),
                unlockResultIdList: unLockList,
            };
        },

        //解锁所选weekday所有course
        unLockAllWeekDayCourse(state, action) {
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            //将所选weekDay的解锁课节id填到 unlockResultIdList 里
            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.studentGroup.allLock = false;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el) => {
                            if (el.acDuration) {
                                el.ifLock = false;
                                unlockResultIdList.push(el.resultId);
                                //将解锁到课节id从lockCourseArr去除
                                if (lockCourseArr.indexOf(el.resultId) != -1) {
                                    let index = lockCourseArr.indexOf(el.resultId);
                                    lockCourseArr.splice(index, 1);
                                }
                            }
                        });
                    // }
                });

            //过滤lockCourseArr里unlockResultIdList的值
            let list = lockCourseArr.filter((item) => {
                if (!unlockResultIdList.includes(item)) return item;
            });

            return {
                ...state,
                bathCourseList,
                scheduleData: scheduleDataCopy,
                lockCourseArr: list,
                unlockResultIdList: Array.from(new Set(unlockResultIdList)),
            };
        },

        //获取课表已锁定课节
        getLockResultIdList(state, action) {
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr || []));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    //按班级锁定
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el, order) => {
                            return (
                                el &&
                                el.length > 0 &&
                                el.map((list) => {
                                    if (list.resultId && list.ifLock == true) {
                                        bathCourseList[order].push(list.resultId);
                                    }
                                })
                            );
                            // el.acDuration && el.length>0
                        });
                });

            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    courseResultIdList.push(...course);
                }
            });

            return {
                ...state,
                bathCourseList,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
            };
        },

        //单选所选weekday 的 节次， 除锁定其他操作
        choiceAllClassCourse(state, action) {
            //根据周选择课节
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            let checkedList = action.payload.checkedList;

            bathCourseList[weekDayRow] = [];

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el, order) => {
                            if (checkedList.includes(el.lesson) && el.resultId) {
                                //处理连堂课 单击连堂课第一节移动 第二节不移动
                                if (el.acDuration === 2) {
                                    if (
                                        item.resultList[weekDayRow][order].resultId ===
                                        item.resultList[weekDayRow][order + 1]?.resultId
                                    ) {
                                        el.ifChoice = true;
                                        bathCourseList[weekDayRow].push(el.resultId);
                                    }
                                } else {
                                    el.ifChoice = true;
                                    bathCourseList[weekDayRow].push(el.resultId);
                                }
                            } else {
                                el.ifChoice = false;
                            }
                        });
                    // }
                });

            //当前课节所有 - 选中课节
            let list =
                scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy
                    .map((item) => {
                        item.studentGroup.allLock = true;
                        item.resultList &&
                            item.resultList.length > 0 &&
                            item.resultList.map((el) => {
                                return el.resultId;
                            });
                    })
                    .filter((item) => {
                        if (!bathCourseList[weekDayRow].includes(item)) return item;
                    });
            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    courseResultIdList.push(...course);
                }
            });
            console.log('bathCourseList', bathCourseList);
            console.log('courseResultIdList', courseResultIdList);
            return {
                ...state,
                bathCourseList,
                scheduleData: scheduleDataCopy,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
                unlockResultIdList: list,
            };
        },

        //单选所选weekday 的 节次， 锁定操作
        lockOrUnlockChoiceAllCourse(state, action) {
            let scheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            let lockCourseArr = JSON.parse(JSON.stringify(state.lockCourseArr));
            let unlockResultIdList = JSON.parse(JSON.stringify(state.unlockResultIdList));
            let bathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            // let lockScheduleDataCopy = JSON.parse(JSON.stringify(state.scheduleData));
            // let lockBathCourseList = JSON.parse(JSON.stringify(state.bathCourseList));

            let weekDayRow = action.payload.weekDayRow;
            let checkedList = action.payload.checkedList;
            bathCourseList[weekDayRow] = [];

            // lockScheduleDataCopy &&
            //     lockScheduleDataCopy.length > 0 &&
            //     lockScheduleDataCopy.map((item) => {
            //         //按班级锁定
            //         item.studentGroup.allLock = true;
            //         item.resultList &&
            //             item.resultList.length > 0 &&
            //             item.resultList.map((el, order) => {
            //                 return (
            //                     el &&
            //                     el.length > 0 &&
            //                     el.map((list) => {
            //                         if (list.resultId && list.ifLock == true) {
            //                             lockBathCourseList[order].push(list.resultId);
            //                         }
            //                     })
            //                 );
            //                 // el.acDuration && el.length>0
            //             });
            //     });
            // console.log('lockBathCourseList', lockBathCourseList);

            //全部已锁定的的resultId
            // let lockCourseResultIdList = [];
            // Object.values(lockBathCourseList).map((course) => {
            //     if (course.length > 0) {
            //         lockCourseResultIdList.push(...course);
            //     }
            // });
            // console.log('lockCourseResultIdList', lockCourseResultIdList);

            scheduleDataCopy &&
                scheduleDataCopy.length > 0 &&
                scheduleDataCopy.map((item) => {
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList[weekDayRow].map((el, order) => {
                            if (
                                checkedList.includes(el.lesson) &&
                                el.resultId
                                //  ||
                                // lockBathCourseList[weekDayRow].includes(el.resultId)
                            ) {
                                el.ifLock = true;
                                bathCourseList[weekDayRow].push(el.resultId);
                            } else {
                                // bathCourseList[weekDayRow].filter((item) => {
                                //     if (!checkedList.includes(el.lesson)) return item;
                                // });
                                el.ifLock = false;
                            }
                        });

                    // }
                });
            console.log('bathCourseList', bathCourseList);

            let arr = [];
            //去当前课表所有的resultId
            let list =
                state.scheduleData &&
                state.scheduleData.length > 0 &&
                state.scheduleData.map((item) => {
                    item.studentGroup.allLock = true;
                    item.resultList &&
                        item.resultList.length > 0 &&
                        item.resultList.map((el) => {
                            el &&
                                el.length > 0 &&
                                el.map((item2) => {
                                    if (item2.acDuration) {
                                        arr.push(item2.resultId);
                                    }
                                });
                        });
                });

            //选择的resultId
            let courseResultIdList = [];
            Object.values(bathCourseList).map((course) => {
                if (course.length > 0) {
                    //todo:去重
                    courseResultIdList.push(...course);
                }
            });

            // let arrLockCourseResultIdList = lockCourseResultIdList.concat(courseResultIdList);
            // console.log('arrLockCourseResultIdList', arrLockCourseResultIdList);

            // let aa = Array.from(new Set(arrLockCourseResultIdList));
            // console.log('aa', aa);

            //未锁定的resultId
            let list2 = xorWith(uniq(arr), courseResultIdList);

            return {
                ...state,
                scheduleData: scheduleDataCopy,
                bathCourseList,
                lockCourseArr: Array.from(new Set(courseResultIdList)),
                unlockResultIdList: list2,
            };
        },

        //置空bathCourseList
        emptyChoiceCourseArr(state, action) {
            console.log('clear-bathCourseList', state.bathCourseList);
            return {
                ...state,
                // lockCourseArr: action.payload,
                bathCourseList: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, //课节数量
                lockCourseArr: [],
            };
        },

        updateCanChangeClass(state, action) {
            return {
                ...state,
                canChangeCourse: action.payload,
            };
        },
        updateConfirmStatus(state, action) {
            return {
                ...state,
                confirmStatus: action.payload,
            };
        },
        newUpdateCanChangeClass(state, action) {
            return {
                ...state,
                newCanChangeCourse: action.payload,
            };
        },
        getNewCheckScheduleList(state, action) {
            return {
                ...state,
                newCanCheckScheduleList: action.payload,
            };
        },
        getConflictReasonCard(state, action) {
            return {
                ...state,
                conflictReasonCardInfo: action.payload,
                ifLoading: false,
            };
        },
        getChangeCourseResult(state, action) {
            return {
                ...state,
                checkChangeResult: action.payload,
            };
        },
        getChangeCourseDetail(state, action) {
            return {
                ...state,
                changeCourseDetail: action.payload,
            };
        },
        getPublicResult(state, action) {
            return {
                ...state,
                lastPublicContent: action.payload,
            };
        },
        accountCourseNum(state, action) {
            return {
                ...state,
                accountCourseNum: action.payload,
            };
        },
        fetchScheduleMessage(state, action) {
            return {
                ...state,
                fetchScheduleMessage: action.payload,
            };
        },
        updateCourseBySubject(state, action) {
            return {
                ...state,
                courseBySubject: action.payload,
            };
        },
        fetchFetProgress(state, action) {
            return {
                ...state,
                fetProgress: action.payload,
            };
        },
        getStatisticsCourseNum(state, action) {
            return {
                ...state,
                statisticsCourse: action.payload,
            };
        },
        fetchGradeByType(state, action) {
            return {
                ...state,
                gradeByTypeArr: action.payload,
            };
        },
        updateNoAddress(state, action) {
            return {
                ...state,
                getNoAddressResult: action.payload,
            };
        },
        fetchScheduleCheck(state, action) {
            return {
                ...state,
                scheduleCheckResult: action.payload,
            };
        },
        updateScheduleResult(state, action) {
            return {
                ...state,
                deleteScheduleResult: action.payload,
            };
        },
        updateAddressResult(state, action) {
            return {
                ...state,
                addressResult: action.payload,
            };
        },
        updateTeacherResult(state, action) {
            return {
                ...state,
                teacherResult: action.payload,
            };
        },
        updatecompareVersion(state, action) {
            return {
                ...state,
                compareVersion: action.payload,
            };
        },
        updateversionGrade(state, action) {
            return {
                ...state,
                versionGrade: action.payload,
            };
        },
        clearProps(state, action) {
            return {
                ...state,
                compareVersion: [],
            };
        },
        studentSearch(state, action) {
            return {
                ...state,
                customStudentList: action.payload,
            };
        },
        groupSearch(state, action) {
            return {
                ...state,
                customGroupList: action.payload,
            };
        },
        gradeSearch(state, action) {
            return {
                ...state,
                customGradeList: action.payload,
            };
        },
        deleteCustomItem(state, action) {
            let oldScheduleData = JSON.parse(JSON.stringify(state.scheduleData));
            oldScheduleData = oldScheduleData.filter((item) => {
                return item.studentGroup.id != action.payload;
            });
            return {
                ...state,
                scheduleData: oldScheduleData,
            };
        },
        getExchangeGroupInfo(state, { payload }) {
            const newScheduleData = payload.exchangeScheduleData.map((item, index) => {
                if (!item.studentGroup.view) {
                    if (payload.searchIndex === 1) {
                        item.studentGroup.view = 'grade';
                    } else {
                        item.studentGroup.view = 'group';
                    }
                }
                return item;
            });
            return {
                ...state,
                scheduleData: [...newScheduleData],
            };
        },

        confirmCreateActive(state, action) {
            return {
                ...state,
                sureActive: action.payload,
            };
        },

        exportPlan(state, { payload }) {
            return {
                ...state,
                exportPlanGroupList: payload,
            };
        },

        activeConflict(state, action) {
            return {
                ...state,
                activeConflictList: action.payload,
            };
        },

        editActiveConflict(state, action) {
            return {
                ...state,
                editActiveConflictList: action.payload,
            };
        },
        fetUrl(state, action) {
            return {
                ...state,
                fetDownLoadUrl: action.payload.fileDownloadUrl,
                fetFileDTO: action.payload,
            };
        },
        compareVer(state, action) {
            return {
                ...state,
                compareVersionList: action.payload,
            };
        },
        compareVersionRes(state, action) {
            return {
                ...state,
                compareVersionResult: action.payload,
            };
        },

        compareVersionTeacher(state, action) {
            return {
                ...state,
                compareVersionTeacherList: action.payload,
            };
        },

        saveCourseScheduleImport(state, action) {
            return {
                ...state,
                courseScheduleImport: action.payload,
            };
        },
        deposit_teacherIds(state, action) {
            return {
                ...state,
                teacherIdList: action.payload,
            };
        },
        deposit_studentIds(state, action) {
            return {
                ...state,
                studentIdList: action.payload,
            };
        },
    },
};
