import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    getSubjectList,
    getLotSubjects,
    getNewSubjectList,
    getCourseList,
    getCoursePlan,
    getTeacherList,
    getCoursePlanning,
    getStudentGroup,
    getStudentGroup1,
    getPublishResult,
    getCheckPayTuitionPlan,
    getReCreatePayTuitionPlan,
    getCreatePayTuitionPlan,
    createPayTuitionPlanResult,
    fetchDeletePlan,
    confirmImport,
    confirmImportSub,
    updatCoursePlanning,
    updateCoursePlanning,
    deleteCoursePlanning,
    saveDefaultPlan,
    fetchOnlyClass,
    fetchPlanById,
    schoolList,
    chooseCourseDelete,
    choosePlanList,
    addedOrEditChoosePlan,
    listCourse,
    listKeywordSubject,
    allAddress,
    addedCourse,
    updateCourse,
    addedSubject,
    updateSubject,
    deleteSubject,
    courseEnableAndDisable,
    getIsDisableNum,
    getGradeByCoursePlanning,
    coursePlanningGroupInfo,
    getAllClasses,
    getAllSemester,
    getCouserPlanningSchoolList,
    importHistorySemester,
    getByConditionTeacher,
    saveCoursePlanning,
    newGetTeacherList,
    courseImport,
    subjectImport,
    importByTypeCalendar,
    checkByTypeCalendar,
    batchUpdateCourse,
    importClass,
    checkClass,
    importStudent,
    checkStudent,
    getCoursesList,
    getGradeDetail,
    suitGrades,
    getLinkClass,
    importTeacher,
    checkTeacher,
    updateClassInfo,
    queryStuLists,
    createClass,
    transferStudent,
    removeStudent,
    deleteClass,
    addStudent,
    exportCoursePlanning,
    initializeCourseId,
    getLinkCourse,
    getCourseDetail,
    uploadMainImgs,
    showCoursePlanningDetail,
    newListCourse,
    listSyncRecord,
    setCurrent,
    selectionsyncToSchedule,
    showDetail,
    editCourseFee,
    importFee,
    getAsyncVersion,
    showCoursePlanningDetailMobile,
    grabSignUp,
    getPayChargeItemList,
    fetchSuitStage, //查询适用学段
    listDomainSubjectTree,
    insertDomainSubject,
    updateDomainSubject,
    getSubjectLists,
    searchXlsxTeacherPlan,
} from '../services/course';
import lodash from 'lodash';
import openLocalFile$ from 'dingtalk-jsapi/api/biz/util/openLocalFile';

//格式化教师列表
function formatTeacherList(teacherList) {
    if (!teacherList || teacherList.length < 0) return [];
    let teacherResult = [];

    teacherList.map((item, index) => {
        let obj = {
            title:
                item.englishName && item.englishName != item.name
                    ? `${item.name}(${item.englishName})`
                    : `${item.name}`,
            key: index,
            value: item.teacherId,
        };
        teacherResult.push(obj);
    });
    return teacherResult;
}

export default {
    namespace: 'course',
    state: {
        subjectList: [], //科目列表
        getLotSubjects: [],
        modalSubject: [],
        newListCourse: [],
        newSubjectList: [],
        courseList: [], //课程列表
        coursePlanList: {}, //课程计划列表
        coursePlanListkb: {},
        finalPlanList: [],
        teacherList: [], //教师列表
        newTeacherLists: [],
        getCoursePlanning: {}, //课程设置详情
        showCoursePlanningDetail: {}, //课程设置详情
        publishResult: undefined,
        studentGroupList: [], //班级列表
        onlyHaveClass: [], //只有班级的列表
        saveDefaultSuccess: {}, //保存默认课时计划
        schoolList: [], // 所有校区
        chooseCourseDelete: [],
        choosePlanList: [], //选课管理list
        allchoosePlanLists: [], //选课管理list
        addedOrEditChoosePlan: {},
        allAddress: [], // 获取所有校区
        listCourse: {}, // 课程管理--课程列表
        listKeywordSubject: {}, // 课程管理--学科列表
        getIsDisableNum: {}, // 获取课程启用禁用数量
        getCourseList: [],
        coursePlanningGreadListInfo: [],
        planningGroupForAdd: [],
        planningSemesterInfo: [],
        planningSchoolListInfo: [],
        checkSemesterClassType: '',
        newGetCoursePlanning: {},
        importHistorySemesterList: [],
        teacherByDeparment: [],
        teacherByRole: [],
        importByTypeCalendar: {},
        checkByTypeCalendar: {},
        batchUpdateCourse: {},
        importClass: {},
        checkClass: {},
        importStudent: {},
        checkStudent: {},
        getCourseLists: [],
        gradeDetail: [],
        linkClass: [],
        allSuitGrades: [],
        checkTeacher: {},
        importTeacher: {},
        updateInfo: [],
        stuLists: [],
        createClassInfo: [],
        delClassInfo: [],
        coursePlanningGreadListInfoForSelect: [],
        getClasses: [],
        getLinkCourse: [],
        getCourseDetail: [],
        setCurrent: undefined,
        selectionsyncToSchedule: undefined,
        uploadImages: [],
        listSyncRecord: [],
        showDetail: [],
        getPayChargeItemList: [],
        editCourseFee: undefined,
        importFeeMessage: undefined,
        courseImportMessage: undefined,
        getAsyncVersion: [],
        CreatePayTuitionPlan: false,
        createPayTuitionPlanResult: true, //收费单生成状态 false生成中 true生成完成
        suitStageList: [], //适用年段
        PayTuitionPlan: undefined,
        tempObj: {},
        listTree: [],
        listSubjects: [],
        teacherPlanData: {},
    },
    effects: {
        //导出课时计划
        *initializeCourseId({ payload, onSuccess }, { call, put }) {
            const response = yield call(initializeCourseId, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },

        //导出课时计划
        *exportCoursePlanning({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportCoursePlanning, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },

        //移除学生
        *removeStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(removeStudent, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            message.success('移除学生成功');
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },

        //转移学生
        *transferStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(transferStudent, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            message.success('转移学生成功');
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },

        //添加学生
        *addStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(addStudent, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            message.success('添加学生成功');
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setStudent',
                payload: response.content,
            });
            onSuccess && onSuccess(response.content);
        },
        *clearCourse({ payload }, { call, put }) {
            yield put({
                type: 'delCourseDetail',
            });
        },
        //删除班级
        *deleteClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(deleteClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'delClass',
                payload: response.content,
            });
            onSuccess && onSuccess(response.content);
        },

        //新建班级
        *createClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(createClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setClass',
                payload: response.content,
            });
            onSuccess && onSuccess(response.content);
        },
        //新建班级
        *listSyncRecord({ payload, onSuccess }, { call, put }) {
            const response = yield call(listSyncRecord, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getListSyncRecord',
                payload: response.content,
            });
            onSuccess && onSuccess(response.content);
        },

        //查询学生列表
        *queryStuLists({ payload }, { call, put }) {
            const response = yield call(queryStuLists, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setStuLists',
                payload: response.content,
            });
        },

        //修改班级信息
        *updateClassInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateClassInfo, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setClassInfo',
                payload: response.content,
            });
            onSuccess && onSuccess(response.content);
        },

        //获取关联班级
        *getLinkClass({ payload }, { call, put }) {
            const response = yield call(getLinkClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setLinkClass',
                payload: response.content,
            });
        },

        //获取班级详情
        *getGradeDetail({ payload }, { call, put }) {
            const response = yield call(getGradeDetail, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setGradeDetail',
                payload: response.content,
            });
        },

        //获取全部年级
        *suitGrades({ payload }, { call, put }) {
            const response = yield call(suitGrades, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setSuitGrade',
                payload: response.content,
            });
        },

        //获取课程列表
        *getCoursesList({ payload }, { call, put }) {
            const response = yield call(getCoursesList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setCourseLists',
                payload: response.content,
            });
        },

        //导入学生
        *importTeacher({ payload }, { call, put }) {
            const response = yield call(importTeacher, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportTeacher',
                payload: response.content,
            });
        },

        //检查学生
        *checkTeacher({ payload }, { call, put }) {
            const response = yield call(checkTeacher, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setCheckTeacher',
                payload: response.content,
            });
        },

        //导入学生
        *importStudent({ payload }, { call, put }) {
            const response = yield call(importStudent, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportStudent',
                payload: response.content,
            });
        },

        //检查学生
        *checkStudent({ payload }, { call, put }) {
            const response = yield call(checkStudent, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setCheckStudent',
                payload: response.content,
            });
        },

        //导入分层班
        *importClass({ payload }, { call, put }) {
            const response = yield call(importClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportClass',
                payload: response.content,
            });
        },

        //检查分层班
        *checkClass({ payload }, { call, put }) {
            const response = yield call(checkClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setCheckClass',
                payload: response.content,
            });
        },

        //导入课时计划
        *importByTypeCalendar({ payload }, { call, put }) {
            const response = yield call(importByTypeCalendar, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportByTypeCalendar',
                payload: response.content,
            });
        },

        //检查课时计划
        *checkByTypeCalendar({ payload }, { call, put }) {
            const response = yield call(checkByTypeCalendar, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setCheckByTypeCalendar',
                payload: response.content,
            });
        },
        *batchUpdateCourse({ payload }, { call, put }) {
            const response = yield call(batchUpdateCourse, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setbatchUpdateCourse',
                payload: response.content,
            });
        },
        //导入学科
        *subjectImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(subjectImport, payload);
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
        //导入课程
        *courseImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(courseImport, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'courseImportReducer',
                payload: response.content,
            });
        },

        *saveCoursePlanning({ payload, onSuccess }, { call, put }) {
            const response = yield call(saveCoursePlanning, payload);
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
        *getByConditionTeacher({ payload, onSuccess }, { call, put }) {
            const response = yield call(getByConditionTeacher, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'conditionTeacherInfo',
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
        *getImportHistorySemester({ payload, onSuccess }, { call, put }) {
            const response = yield call(importHistorySemester, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getHistorySemester',
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
        *checkSemesterClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkSemesterClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getCorrectType',
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
        *getCouserPlanningSchoolList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCouserPlanningSchoolList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'planningSchoolList',
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
        *selectBySchoolIdAllSemester({ payload, onSuccess }, { call, put }) {
            const response = yield call(getAllSemester, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getAllSemesterInfo',
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
        *getAllClasses({ payload, onSuccess }, { call, put }) {
            const response = yield call(getAllClasses, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setAllClasses',
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
        *coursePlanningGroupInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(coursePlanningGroupInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'planningGroupInfo',
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
        *getGradeByCoursePlanning({ payload, onSuccess }, { call, put }) {
            const response = yield call(getGradeByCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'coursePlanningList',
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
        *getGradeByCoursePlanningForSelect({ payload, onSuccess }, { call, put }) {
            const response = yield call(getGradeByCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'coursePlanningListForSelect',
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
        *allAddress({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(allAddress, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allAddressReducer',
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
        *schoolList({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(schoolList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'schoolListReducer',
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
        *chooseCourseDelete({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(chooseCourseDelete, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'chooseCourseDeleteReducer',
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
        *choosePlanList({ payload, onSuccess }, { call, put }) {
            //获取选课管理list
            const response = yield call(choosePlanList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'choosePlanListReducer',
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
        *allChoosePlanList({ payload, onSuccess }, { call, put }) {
            //获取选课管理list
            const response = yield call(choosePlanList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getChoosePlanList',
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
        *addedOrEditChoosePlan({ payload, onSuccess }, { call, put }) {
            //选课管理CHUANGJIAN
            const response = yield call(addedOrEditChoosePlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'addedOrEditChoosePlanReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess((response.content && response.content.id) || null);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getSubjectList({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(getSubjectList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateSubjectList',
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
        *getLotSubjects({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(getLotSubjects, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'lotSubjects',
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
        *modalSubject({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(getLotSubjects, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'modalSubjects',
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
        *newListCourse({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(newListCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newlistCourse',
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

        *getCourseIndexSubjectList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateSubjectList',
                payload: payload,
            });
            onSuccess && onSuccess();
        },

        *getNewSubjectList({ payload, onSuccess }, { call, put }) {
            //获取科目列表
            const response = yield call(getNewSubjectList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNewSubjectList',
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

        *getCourseList({ payload, onSuccess }, { call, put }) {
            //获取课程列表
            const response = yield call(getCourseList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseList',
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
        *getCourseIndexCourseList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateCourseList',
                payload: payload,
            });
        },

        *getCoursePlan({ payload }, { call, put }) {
            //查询课程计划列表
            const response = yield call(getCoursePlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCoursePlan',
                        payload: response.content,
                        coursePlanListkb: response.content,
                    });
                    yield put({
                        type: 'storageLists',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *newGetTeacherList({ payload, onSuccess }, { call, put }) {
            const response = yield call(newGetTeacherList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNewTeacherList',
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

        *getTeacherList({ payload, onSuccess }, { call, put }) {
            //获取教师列表
            const response = yield call(getTeacherList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateTeacherList',
                        payload: response.content,
                    });
                    yield put({
                        type: 'formatTeacherList',
                        payload: formatTeacherList(response.content),
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCourseIndexTeacherList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'updateTeacherList',
                payload: payload,
            });
        },

        *getCoursePlanning({ payload }, { call, put }) {
            //获取教师列表
            const response = yield call(getCoursePlanning, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCoursePlannings',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *showCoursePlanningDetailMobile({ payload }, { call, put }) {
            //获取教师列表
            const response = yield call(showCoursePlanningDetailMobile, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'showCoursePlanning',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *grabSignUp({ payload, onSuccess, onFail }, { call, put }) {
            //获取教师列表
            const response = yield call(grabSignUp, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // yield put({
                    //     type: 'showCoursePlanning',
                    //     payload: response.content,
                    // });
                    message.success();
                    onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                onFail();
            }
        },
        *showCoursePlanningDetail({ payload }, { call, put }) {
            //获取教师列表
            const response = yield call(showCoursePlanningDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'showCoursePlanning',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *uploadImages({ payload }, { call, put }) {
            //获取教师列表
            const response = yield call(uploadMainImgs, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'uploadCourseImg',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getPublishResult({ payload }, { call, put }) {
            //查询是否显示发布
            const response = yield call(getPublishResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatePublishResult',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCheckPayTuitionPlan({ payload, onSuccess }, { call, put }) {
            //查询收费单
            const response = yield call(getCheckPayTuitionPlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatePayTuitionPlan',
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
        *getCreatePayTuitionPlan({ payload, onSuccess, onError }, { call, put }) {
            //第一次生成收费单
            const response = yield call(getCreatePayTuitionPlan, payload);

            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onError && onError(response.content);
                }
            } else {
                loginRedirect();
            }
        },
        *getReCreatePayTuitionPlan({ payload, onSuccess, onError }, { call, put }) {
            //重新创建收费单
            const response = yield call(getReCreatePayTuitionPlan, payload);

            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onError && onError(response.content);
                }
            } else {
                loginRedirect();
            }
        },
        *createPayTuitionPlanResult({ payload, onSuccess }, { call, put }) {
            //缴费单是否生成中
            const response = yield call(createPayTuitionPlanResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCreatePayTuitionPlanResult',
                        payload: response.content,
                    });
                    localStorage.setItem('createPayTuitionPlanResult', response.content ? 1 : 0);
                } else {
                    // message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getStudentGroup({ payload }, { call, put }) {
            //获取班级列表
            const response = yield call(getStudentGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateStudentGroup',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getStudentGroup1({ payload }, { call, put }) {
            //获取班级列表
            const response = yield call(getStudentGroup1, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateStudentGroup1',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addRowCourse({ payload }, { call, put }) {
            //添加课程的子行
            yield put({
                type: 'updateAddRowList',
                payload: payload,
            });
        },
        *deleteRowCourse({ payload }, { call, put }) {
            //删除自己添加的课程子行
            yield put({
                type: 'updateDeleteRowList',
                payload: payload,
            });
        },

        *fetchDeletePlan({ payload, onSuccess }, { call, put }) {
            //删除数据库的课程子行
            const response = yield call(fetchDeletePlan, payload);
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
        *addCourseGroup({ payload }, { call, put }) {
            //添加课程的父组
            yield put({
                type: 'updateCourseGroup',
                payload: payload,
            });
        },
        *applyOtherClass({ payload }, { call, put }) {
            //应用到其他教学班
            yield put({
                type: 'updateOtherClass',
                payload: payload,
            });
        },
        *importHistoryData({ payload, onSuccess }, { call, put }) {
            //导入历史计划
            const response = yield call(confirmImport, payload);
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
        *importHistory({ payload, onSuccess }, { call, put }) {
            //导入计划
            const response = yield call(confirmImportSub, payload);
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

        *updatCoursePlanning({ payload, onSuccess }, { call, put }) {
            //设置开课
            const response = yield call(updatCoursePlanning, payload);
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
        *updateCoursePlanning({ payload, onSuccess }, { call, put }) {
            //设置开课
            const response = yield call(updateCoursePlanning, payload);
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

        *deleteCoursePlanning({ payload, onSuccess }, { call, put }) {
            //设置开课
            const response = yield call(deleteCoursePlanning, payload);
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
        *saveDefaultPlan({ payload, onSuccess }, { call, put }) {
            //保存默认课时计划
            const response = yield call(saveDefaultPlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'storageObj',
                        payload,
                    });
                    yield put({
                        type: 'updateSavePlan',
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
        *getOnlyClass({ payload }, { call, put }) {
            //获取只有班级的列表--表格中使用
            const response = yield call(fetchOnlyClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchOnlyClass',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getPlanById({ payload, onSuccess }, { call, put }) {
            //根据某一课程id查询该计划
            const response = yield call(fetchPlanById, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatePlanById',
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
        *listCourse({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(listCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    if (!response.content) {
                        response.content = {};
                    }
                    let { orgCourseList } = response.content;
                    orgCourseList =
                        orgCourseList &&
                        orgCourseList.map((el, i) => ({ ...el, key: i, index: i }));
                    response.content.orgCourseList = orgCourseList || [];
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                    onError && onError();
                }
            } else {
                loginRedirect();
            }
        },
        *listKeywordSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(listKeywordSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    let { orgSubjectList } = response.content;
                    orgSubjectList =
                        orgSubjectList &&
                        orgSubjectList.map((el, i) => ({ ...el, key: i, index: i }));
                    response.content.orgSubjectList = orgSubjectList || [];
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addedCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(addedCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addedSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(addedSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(deleteSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *courseEnableAndDisable({ payload, onSuccess }, { call, put }) {
            const response = yield call(courseEnableAndDisable, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getIsDisableNum({ payload, onSuccess }, { call, put }) {
            const response = yield call(getIsDisableNum, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'getIsDisableNumReducer',
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
        *getLinkCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(getLinkCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'getLinkCourseReducer',
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
        *getCourseDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCourseDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'getCourseDetailReducer',
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
        *setCurrent({ payload, onSuccess }, { call, put }) {
            const response = yield call(setCurrent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'setCurrentReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *selectionsyncToSchedule({ payload, onSuccess }, { call, put }) {
            const response = yield call(selectionsyncToSchedule, payload);
            if (response.ifLogin) {
                yield put({
                    type: 'selectionsyncToScheduleReducer',
                    payload: response.content,
                });
                if (response.status) {
                    // message.success(response.message);
                    /* yield put({
                        type: 'selectionsyncToScheduleReducer',
                        payload: response.content,
                    }); */
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *showDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(showDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'showDetailReducer',
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
        *getPayChargeItemList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getPayChargeItemList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'getPayChargeItemListReducer',
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
        *editCourseFee({ payload, onSuccess }, { call, put }) {
            const response = yield call(editCourseFee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'editCourseFeeReducer',
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
        *getAsyncVersion({ payload, onSuccess }, { call, put }) {
            const response = yield call(getAsyncVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'getAsyncVersionReducer',
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
        *listDomainSubjectTree({ payload, onSuccess }, { call, put }) {
            const response = yield call(listDomainSubjectTree, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'listTreeReducer',
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
        *getSubjectLists({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSubjectLists, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'subjectListReducer',
                        payload: response.content.orgSubjectList,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *searchXlsxTeacherPlan({ payload, onSuccess }, { call, put }) {
            const response = yield call(searchXlsxTeacherPlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    yield put({
                        type: 'teacherPlanReducer',
                        payload: response.content
                            ? response.content
                            : {
                                  xlsxTeachingPlanCourseDTOList: [],
                                  xlsxTeachingPlanGroupDTOList: [],
                              },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *importFee({ payload }, { call, put }) {
            const response = yield call(importFee, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'importFeeReducer',
                payload: response.content,
            });
        },
        *insertDomainSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(insertDomainSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateDomainSubject({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateDomainSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        //查询适用年级
        *fetchSuitStage({ payload }, { call, put }) {
            const response = yield call(fetchSuitStage, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveSuitStage',
                        payload: response.content || [],
                    });
                } else {
                    yield put({
                        type: 'saveSuitStage',
                        payload: [],
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        updateCreatePayTuitionPlanResult(state, { payload }) {
            return {
                ...state,
                createPayTuitionPlanResult: payload,
            };
        },

        getAsyncVersionReducer(state, { payload }) {
            return {
                ...state,
                getAsyncVersion: payload,
            };
        },
        listTreeReducer(state, { payload }) {
            function arrayFlagLevel(array, level, parentId) {
                if (!array || !array.length) return;
                array.forEach((item) => {
                    item.level = level;
                    item.parentId = parentId;
                    if (item.children && item.children.length) {
                        arrayFlagLevel(item.children, level + 1, item.id);
                    }
                });
            }

            arrayFlagLevel(payload, 0); // 每一项添加level 和 parentId属性
            return {
                ...state,
                listTree: payload,
            };
        },
        subjectListReducer(state, { payload }) {
            return {
                ...state,
                listSubjects: payload,
            };
        },
        teacherPlanReducer(state, { payload }) {
            return {
                ...state,
                teacherPlanData: payload,
            };
        },
        setStudent(state, { payload }) {
            return {
                ...state,
                addStudentLists: payload,
            };
        },

        delClass(state, { payload }) {
            return {
                ...state,
                delClassInfo: payload,
            };
        },

        setClass(state, { payload }) {
            return {
                ...state,
                createClassInfo: payload,
            };
        },
        getListSyncRecord(state, { payload }) {
            return {
                ...state,
                listSyncRecord: payload,
            };
        },

        setStuLists(state, { payload }) {
            return {
                ...state,
                stuLists: payload,
            };
        },

        setClassInfo(state, { payload }) {
            return {
                ...state,
                updateInfo: payload,
            };
        },

        setLinkClass(state, { payload }) {
            return {
                ...state,
                linkClass: payload,
            };
        },

        setSuitGrade(state, { payload }) {
            return {
                ...state,
                allSuitGrades: payload,
            };
        },

        setGradeDetail(state, { payload }) {
            return {
                ...state,
                gradeDetail: payload,
            };
        },

        setCourseLists(state, { payload }) {
            return {
                ...state,
                getCourseLists: payload,
            };
        },

        setImportTeacher(state, { payload }) {
            return {
                ...state,
                importTeacher: payload,
            };
        },

        setCheckTeacher(state, { payload }) {
            return {
                ...state,
                checkTeacher: payload,
            };
        },

        setImportStudent(state, { payload }) {
            return {
                ...state,
                importStudent: payload,
            };
        },

        setCheckStudent(state, { payload }) {
            return {
                ...state,
                checkStudent: payload,
            };
        },

        setImportClass(state, { payload }) {
            return {
                ...state,
                importClass: payload,
            };
        },

        setCheckClass(state, { payload }) {
            return {
                ...state,
                checkClass: payload,
            };
        },

        setImportByTypeCalendar(state, { payload }) {
            return {
                ...state,
                importByTypeCalendar: payload,
            };
        },
        setCheckByTypeCalendar(state, { payload }) {
            return {
                ...state,
                checkByTypeCalendar: payload,
            };
        },
        setbatchUpdateCourse(state, { payload }) {
            return {
                ...state,
                batchUpdateCourse: payload,
            };
        },
        conditionTeacherInfo(state, action) {
            return {
                ...state,
                teacherByDeparment:
                    action.payload.organizationAndUserNodeOutputModel.getDepartmentList,
                teacherByRole: action.payload.orgRoleList,
            };
        },
        getHistorySemester(state, action) {
            return {
                ...state,
                importHistorySemesterList: action.payload,
            };
        },
        getCorrectType(state, action) {
            return {
                ...state,
                checkSemesterClassType: action.payload,
            };
        },
        planningSchoolList(state, action) {
            return {
                ...state,
                planningSchoolListInfo: action.payload,
            };
        },
        getAllSemesterInfo(state, action) {
            return {
                ...state,
                planningSemesterInfo: action.payload,
            };
        },
        setAllClasses(state, action) {
            return {
                ...state,
                getClasses: action.payload,
            };
        },
        planningGroupInfo(state, action) {
            return {
                ...state,
                planningGroupForAdd: action.payload,
            };
        },
        coursePlanningList(state, action) {
            return {
                ...state,
                coursePlanningGreadListInfo: action.payload,
            };
        },
        coursePlanningListForSelect(state, action) {
            return {
                ...state,
                coursePlanningGreadListInfoForSelect: action.payload,
            };
        },
        allAddressReducer(state, action) {
            return {
                ...state,
                allAddress: action.payload,
            };
        },
        schoolListReducer(state, action) {
            return {
                ...state,
                schoolList: action.payload,
            };
        },
        updateSubjectList(state, action) {
            return {
                ...state,
                subjectList: action.payload,
            };
        },
        lotSubjects(state, action) {
            return {
                ...state,
                getLotSubjects: action.payload,
            };
        },
        modalSubjects(state, action) {
            return {
                ...state,
                modalSubject: action.payload,
            };
        },
        newlistCourse(state, action) {
            return {
                ...state,
                newListCourse: action.payload,
            };
        },
        updateNewSubjectList(state, action) {
            return {
                ...state,
                newSubjectList: action.payload,
            };
        },
        updateCourseList(state, action) {
            return {
                ...state,
                courseList: action.payload,
            };
        },
        updateCoursePlan(state, action) {
            return {
                ...state,
                coursePlanList: action.payload,
                coursePlanListkb: action.coursePlanListkb,
            };
        },
        storageLists(state, action) {
            return {
                ...state,
                finalPlanList: (action.payload && action.payload.data) || [],
            };
        },
        updateNewTeacherList(state, action) {
            return {
                ...state,
                newTeacherLists: action.payload,
            };
        },
        updateTeacherList(state, action) {
            return {
                ...state,
                teacherList: action.payload,
            };
        },
        formatTeacherList(state, action) {
            return {
                ...state,
                teacherListFormated: action.payload,
            };
        },
        updateCoursePlannings(state, action) {
            return {
                ...state,
                getCoursePlanning: action.payload,
            };
        },
        showCoursePlanning(state, action) {
            return {
                ...state,
                showCoursePlanningDetail: action.payload,
            };
        },
        uploadCourseImg(state, action) {
            return {
                ...state,
                uploadImages: action.payload,
            };
        },
        addCoursePlanning(state, action) {
            let newCoursePlanning = Object.assign({}, state.getCoursePlanning);
            let copyResult = action.payload.rowDetail;
            newCoursePlanning.weeklyClassInfoList.push(copyResult);
            return {
                ...state,
                getCoursePlanning: newCoursePlanning,
                newGetCoursePlanning: newCoursePlanning,
            };
        },
        deleteCoursePlanningRow(state, action) {
            let newCoursePlanning = Object.assign({}, state.getCoursePlanning);
            let rowIndex = action.payload.rowIndex;
            newCoursePlanning.weeklyClassInfoList.map((el, order) => {
                if (order == rowIndex) {
                    newCoursePlanning.weeklyClassInfoList.splice(order, 1);
                }
            });
            return {
                ...state,
                getCoursePlanning: newCoursePlanning,
            };
        },
        saveUserChange(state, action) {
            let newCoursePlanning = Object.assign({}, state.getCoursePlanning);
            let rowIndex = action.payload.rowIndex;
            let editItem = action.payload.editItem;
            let newWeekLessons = action.payload.newWeekLessons;
            let newUnitDuration = action.payload.newUnitDuration;
            let newOnceLessons = action.payload.newOnceLessons;
            newCoursePlanning.weeklyClassInfoList.map((el, order) => {
                if (order == rowIndex) {
                    switch (editItem) {
                        case 'weekLessons':
                            el.weekLessons = newWeekLessons;
                            break;
                        case 'unitDuration':
                            el.unitDuration = newUnitDuration;
                            break;
                        case 'onceLessons':
                            el.onceLessons = newOnceLessons;
                            break;
                    }
                }
            });
            return {
                ...state,
                getCoursePlanning: newCoursePlanning,
            };
        },
        updateStudentGroup(state, action) {
            return {
                ...state,
                studentGroupList: action.payload,
            };
        },
        updateStudentGroup1(state, action) {
            return {
                ...state,
                studentGroupList1: action.payload,
            };
        },
        updatePublishResult(state, action) {
            return {
                ...state,
                publishResult: action.payload,
            };
        },
        updatePayTuitionPlan(state, action) {
            return {
                ...state,
                PayTuitionPlan: action.payload,
            };
        },
        updateAddRowList(state, action) {
            let newRowList = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newRowList['data'].concat();
            let fatherId = action.payload.faterId;
            let itemDetail = action.payload.addRowDetail;
            let groupOrder = action.payload.groupOrder;
            rowData.map((item) => {
                if (item.id == fatherId) {
                    item.groups.map((el, index) => {
                        if (index == groupOrder) {
                            el.defaultCoursePlanningList.push(itemDetail);
                        }
                    });
                }
            });
            return {
                ...state,
                coursePlanList: newRowList,
            };
        },
        deleteSelfPlanning(state, action) {
            let newRowList = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newRowList['data'].concat();
            let fatherId = action.payload.fatherId;
            let courseId = action.payload.courseId;
            let deleteType = action.payload.deleteType;
            for (let i = 0; i < rowData.length; i++) {
                let rowDataItem = rowData[i] || {};
                if (rowDataItem['id'] == fatherId) {
                    let groups = rowDataItem['groups'];
                    for (let j = 0; j < groups.length; j++) {
                        let groupItem = groups[j] || {};
                        if (
                            groupItem['studentGroupList'] &&
                            groupItem['studentGroupList'][0] &&
                            groupItem['studentGroupList'][0]['id'] == courseId
                        ) {
                            groups.splice(j, 1);
                        }
                        if (deleteType == 'system') {
                            if (groupItem['studentGroupList'][0]['name'] == '系统创建选修班') {
                                groups.splice(j, 1);
                            }
                            if (groupItem['studentGroupList'][0]['name'] == '系统创建分层班') {
                                groups.splice(j, 1);
                            }
                        }
                    }
                }
            }
            newRowList['data'] = rowData;
            return {
                ...state,
                coursePlanList: newRowList,
            };
        },
        updateDeleteRowList(state, action) {
            let newRowList = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newRowList['data'].concat();
            let fatherId = action.payload.fatherId;
            let deleteIndex = action.payload.deleteIndex;
            let groupOrder = action.payload.groupOrder;
            rowData.map((item, index) => {
                if (item.id == fatherId) {
                    item.groups.map((el, order) => {
                        if (order == groupOrder) {
                            if (el.defaultCoursePlanningList.length > 1) {
                                el.defaultCoursePlanningList.splice(deleteIndex, 1);
                            } else {
                                if (item.groups && item.groups.length == 1) {
                                    item.groups = [];
                                } else {
                                    item.groups.splice(order, 1);
                                }
                            }
                        }
                    });
                }
            });
            return {
                ...state,
                coursePlanList: newRowList,
            };
        },
        setGroupForAdd(state, action) {
            let newPlanningGroupForAdd = JSON.parse(JSON.stringify(state.planningGroupForAdd));
            let groupId = action.payload.groupId;
            newPlanningGroupForAdd.map((item) => {
                let groupInfo = item.studentGroupList;
                groupInfo &&
                    groupInfo.length > 0 &&
                    groupInfo.map((el) => {
                        if (el.id == groupId) {
                            el.ifDisplay = false;
                        }
                    });
            });
            return {
                ...state,
                planningGroupForAdd: newPlanningGroupForAdd,
            };
        },
        updateCourseGroup(state, action) {
            let newCourseGroup = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseGroup['data'].concat();
            let callOff = action.payload.callOff;
            let fatherId = action.payload.fatherId;
            let groups = action.payload.groups;
            let hasSave = action.payload.hasSave;
            rowData.map((item) => {
                item.groups = item.groups || [];
                if (item.id == fatherId) {
                    item.groups.push(groups);
                    var obj = {};
                    item.groups = item.groups.reduce((cur, next) => {
                        let type = next.studentGroupType;
                        let id = next.studentGroupList && next.studentGroupList[0]['id'];
                        obj[id] ? '' : (obj[id] = true && cur.push(next));
                        return cur;
                    }, []);
                }
            });
            return {
                ...state,
                coursePlanList: callOff ? state.coursePlanListkb : newCourseGroup,
            };
        },
        updateOtherClass(state, action) {
            let newCourseGroup = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseGroup['data'].concat();
            let fatherId = action.payload.fatherId;
            let copyGroupDetail = action.payload.copyGroupDetail;
            rowData.map((item) => {
                if (item.id == fatherId) {
                    item.groups = item.groups.concat(copyGroupDetail);
                    var obj = {};
                    item.groups = item.groups.reduce((cur, next) => {
                        let id = next.studentGroupList && next.studentGroupList[0]['id'];
                        obj[id] ? '' : (obj[id] = true && cur.push(next));
                        return cur;
                    }, []);
                }
            });
            return {
                ...state,
                coursePlanList: newCourseGroup,
            };
        },
        updateSavePlan(state, action) {
            let objIndex = lodash.findIndex(state.finalPlanList, function (arr) {
                return arr.id == state.tempObj.id;
            });
            let tempPlanLists = JSON.parse(JSON.stringify(state.finalPlanList));
            tempPlanLists.splice(objIndex, 1, state.tempObj);
            return {
                ...state,
                saveDefaultSuccess: action.payload,
                finalPlanList: tempPlanLists,
            };
        },
        storageObj(state, action) {
            return {
                ...state,
                tempObj: action.payload,
            };
        },
        saveChangeClass(state, action) {
            //修改班级
            let newCourseData = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseData['data'].concat();
            let fatherId = action.payload && action.payload.fatherId;
            let studentGroupList = action.payload && action.payload.studentGroups;
            let groupOrder = action.payload && action.payload.groupOrder;
            let studentGroupType = action.payload && action.payload.studentGroupType;
            let deleteId = action.payload && action.payload.deleteId;
            rowData.map((item) => {
                if (item.id == fatherId) {
                    item.groups.map((el, index) => {
                        if (index == groupOrder) {
                            if (deleteId) {
                                el.studentGroupList &&
                                    el.studentGroupList.length &&
                                    el.studentGroupList.map((group, num) => {
                                        if (group.id == deleteId) {
                                            el.studentGroupList &&
                                                el.studentGroupList.splice(num, 1);
                                        }
                                    });
                            }
                            for (let i = 0; i < studentGroupList.length; i++) {
                                let isPush = true;
                                el.studentGroupList &&
                                    el.studentGroupList.length &&
                                    el.studentGroupList.map((group, num) => {
                                        if (group.id === studentGroupList[i].id) {
                                            isPush = false;
                                        }
                                    });
                                if (isPush) {
                                    el.studentGroupList &&
                                        el.studentGroupList.push(studentGroupList[i]);
                                }
                            }
                            el.studentGroupType =
                                studentGroupType == 3
                                    ? studentGroupType
                                    : studentGroupList &&
                                      studentGroupList[0] &&
                                      studentGroupList[0].type;
                        }
                    });
                }
            });
            return {
                ...state,
                coursePlanList: newCourseData,
            };
        },
        deleteClassChange(state, action) {
            let newCourseData = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseData['data'].concat();
            let fatherId = action.payload && action.payload.fatherId;
            let studentGroupList = action.payload && action.payload.studentGroups;
            let groupOrder = action.payload && action.payload.groupOrder;
            let studentGroupType = action.payload && action.payload.studentGroupType;
            rowData.map((item) => {
                if (item.id == fatherId) {
                    item.groups.map((el, index) => {
                        if (index == groupOrder) {
                            el.studentGroupType =
                                studentGroupType == 3
                                    ? studentGroupType
                                    : studentGroupList &&
                                      studentGroupList[0] &&
                                      studentGroupList[0].type;
                            el.studentGroupList = studentGroupList;
                        }
                    });
                }
            });
            return {
                ...state,
                coursePlanList: newCourseData,
            };
        },
        saveChangeSubCourse(state, action) {
            //保存子行的修改
            let newCourseData = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseData['data'].concat();
            let fatherId = action.payload.fatherId; //课程id
            let groupOrder = action.payload.groupOrder; //小组的index
            let order = action.payload.order; //子行的index
            let saveType = action.payload.saveType;
            let mainTeacherInfoList,
                assistTeacherInfoList,
                frequency,
                weekLessons,
                onceLessons,
                unitDuration,
                effectiveTime,
                failureTime;
            switch (saveType) {
                case 'mainTeacher':
                    //保存主课老师
                    mainTeacherInfoList = action.payload.mainTeacherInfoList;
                    break;
                case 'assistTeacher':
                    //保存辅助老师
                    assistTeacherInfoList = action.payload.assistTeacherInfoList;
                    break;
                case 'frequency':
                    //保存频率
                    frequency = action.payload.frequency;
                    break;
                case 'weekLessons':
                    //保存周节课
                    weekLessons = action.payload.weekLessons;
                    break;
                case 'onceLessons':
                    //保存单节次数
                    onceLessons = action.payload.onceLessons;
                    break;
                case 'unitDuration':
                    //保存单节时长
                    unitDuration = action.payload.unitDuration;
                    break;
                case 'effectiveTime':
                    //保存学期时间
                    effectiveTime = action.payload.effectiveTime;
                    failureTime = action.payload.failureTime;
                    break;
            }
            rowData.map((item) => {
                if (item.id == fatherId) {
                    item.groups.map((el, index) => {
                        if (index === groupOrder) {
                            el.defaultCoursePlanningList.map((list, listIndex) => {
                                if (listIndex === order) {
                                    switch (saveType) {
                                        case 'mainTeacher':
                                            list.mainTeacherInfoList = mainTeacherInfoList;
                                            break;
                                        case 'assistTeacher':
                                            list.assistTeacherInfoList = assistTeacherInfoList;
                                            break;
                                        case 'frequency':
                                            list.frequency = frequency;
                                            break;
                                        case 'weekLessons':
                                            list.weekLessons = weekLessons;
                                            break;
                                        case 'onceLessons':
                                            list.onceLessons = onceLessons;
                                            break;
                                        case 'unitDuration':
                                            list.unitDuration = unitDuration;
                                            break;
                                        case 'effectiveTime':
                                            list.effectiveTime = effectiveTime;
                                            list.failureTime = failureTime;
                                            break;
                                    }
                                }
                            });
                        }
                    });
                }
            });
            return {
                ...state,
                coursePlanList: newCourseData,
            };
        },
        fetchOnlyClass(state, action) {
            return {
                ...state,
                onlyHaveClass: action.payload,
            };
        },
        updatePlanById(state, action) {
            //数据库plan替换本地props
            let newCourseData = JSON.parse(JSON.stringify(state.coursePlanList));
            let rowData = newCourseData['data'].concat();
            let fatherId = action.payload.id;
            for (let i = 0; i < rowData.length; i++) {
                if (rowData[i].id == fatherId) {
                    rowData[i] = action.payload;
                    break;
                }
            }
            newCourseData['data'] = rowData;
            return {
                ...state,
                coursePlanList: newCourseData,
            };
        },
        listCourse(state, action) {
            return {
                ...state,
                listCourse: action.payload,
            };
        },
        listKeywordSubject(state, action) {
            return {
                ...state,
                listKeywordSubject: action.payload,
            };
        },
        getIsDisableNumReducer(state, action) {
            return {
                ...state,
                getIsDisableNum: action.payload,
            };
        },
        chooseCourseDeleteReducer(state, action) {
            return {
                ...state,
                chooseCourseDelete: action.payload,
            };
        },
        choosePlanListReducer(state, action) {
            return {
                ...state,
                choosePlanList: action.payload,
            };
        },
        getChoosePlanList(state, action) {
            return {
                ...state,
                allchoosePlanLists: action.payload,
            };
        },
        addedOrEditChoosePlanReducer(state, action) {
            return {
                ...state,
                addedOrEditChoosePlan: action.payload,
            };
        },
        getLinkCourseReducer(state, action) {
            return {
                ...state,
                getLinkCourse: action.payload,
            };
        },
        getCourseDetailReducer(state, action) {
            return {
                ...state,
                getCourseDetail: action.payload,
            };
        },
        setCurrentReducer(state, action) {
            return {
                ...state,
                setCurrent: action.payload,
            };
        },
        selectionsyncToScheduleReducer(state, action) {
            return {
                ...state,
                selectionsyncToSchedule: action.payload,
            };
        },
        delCourseDetail(state, action) {
            return {
                ...state,
                showCoursePlanningDetail: {},
            };
        },
        showDetailReducer(state, action) {
            return {
                ...state,
                showDetail: action.payload,
            };
        },
        getPayChargeItemListReducer(state, action) {
            return {
                ...state,
                getPayChargeItemList: action.payload,
            };
        },

        editCourseFeeReducer(state, action) {
            return {
                ...state,
                editCourseFee: action.payload,
            };
        },
        importFeeReducer(state, action) {
            return {
                ...state,
                importFeeMessage: action.payload,
            };
        },
        courseImportReducer(state, action) {
            return {
                ...state,
                courseImportMessage: action.payload,
            };
        },
        saveSuitStage(state, action) {
            return {
                ...state,
                suitStageList: action.payload,
            };
        },
    },
};
