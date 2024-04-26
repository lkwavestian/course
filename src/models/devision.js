import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    getCardMsg,
    getAllGrade,
    getDetail,
    getResult,
    getAllSemester,
    addClass,
    importStudentColunteer,
    importStudentExcel,
    importStudentScoreList,
    importStudentScoreExcel,
    getclaPro,
    adjustToadmin,
    allClasses,
    allCourses,
    adjustTolayer,
    getPos,
    importStudentClassList,
    importStudentClassExcel,
    handleOkAdjust,
    importStudentResultExcel,
    studentCombinationImport,
    importStudentResultList,
    getAdminScore,
    getAdminPos,
    exportDivideResultAdminClassView,
    exportDivideResultAdminClassScoreView,
    exportDivideResultTeachingClassView,
    exportDivideResultStudentView,
    divideResultStudentView,
    studentCourseCombinationView,
    divideResultCombinationView,
    showCombinationDetail,
    updateCombination,
    choiceSelectList,
    studentConfirm,
    confirmSync,
    confirmSyncText,
    dividePlanDetail,
    weekVersionList,
    saveDividePlanSyncSchduleResult,
    importStudentClassSettingExcel,
    editClassPlan,
    checkDivideResultClass,
} from '../services/devision';

export default {
    namespace: 'devision',
    state: {
        devisionList: [], //分班列表
        cards: [],
        allGrades: [],
        detail: [],
        classList: [],
        importStudentColunteer: '',
        importStudentExcel: [],
        importStudentScoreList: '',
        importStudentScoreExcel: [],
        classPro: [],
        toAdmin: [],
        allCLasses: [],
        allCOurses: [],
        allAdjustPos: [],
        importStudentClassList: [],
        importStudentClassExcel: [],
        importStudentResultExcel: [],
        studentCombinationImport: [],
        importStudentResultList: [],
        allAdminScore: [],
        allAdminPos: [],
        gradename: '',
        studentInfo: [],
        stuComView: [],
        divideResultCombinationView: [],
        combinationDetail: [],
        combinationUpdated: [],
        choiceSelectList: [],
        studentConfirm: [],
        confirmSync: [],
        confirmSyncText: [],
        dividePlanDetail: {},
        weekVersionList: [],
        saveDividePlanSyncSchduleResult: [],
        importStudentClassSettingExcel: [],
        editClassPlan: [],
        checkDivideResultClass: [],
    },
    effects: {
        //查询学期
        *getDevisionList({ payload }, { call, put }) {
            const response = yield call(getAllSemester, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'toDivision',
                payload: response.content,
            });
        },
        *setGradeName({ payload }, { call, put }) {
            /* const response = yield call(getAllSemester, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect()); */
            yield put({
                type: 'setGrade',
                // payload: response.content,
                payload: payload,
            });
        },
        *getCardMsg({ payload }, { call, put }) {
            const response = yield call(getCardMsg, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getCards',
                payload: response.content,
            });
        },
        *studentCourseCombinationView({ payload }, { call, put }) {
            const response = yield call(studentCourseCombinationView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getStuComView',
                payload: response.content,
            });
        },
        *getAllGrade({ payload }, { call, put }) {
            const response = yield call(getAllGrade, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getGrade',
                payload: response.content,
            });
        },
        *getDetail({ payload }, { call, put }) {
            const response = yield call(getDetail, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'saveDetail',
                payload: response.content,
            });
        },
        *getDivResult({ payload }, { call, put }) {
            const response = yield call(getResult, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getRes',
                payload: response.content,
            });
        },
        *addDivision({ payload }, { call, put }) {
            const response = yield call(addClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'addDivi',
                payload: response.content,
            });
        },
        *divideResultStudentView({ payload }, { call, put }) {
            const response = yield call(divideResultStudentView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'studentView',
                payload: response.content,
            });
        },
        *importStudentColunteer({ payload }, { call, put }) {
            const response = yield call(importStudentColunteer, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                yield put({
                    type: 'setImportStudentColunteer',
                    payload: '',
                });
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportStudentColunteer',
                payload: response.content,
            });
        },
        *importStudentExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentExcel, payload);
            // debugger;
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentExcel',
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
        *importStudentClassSettingExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentClassSettingExcel, payload);
            // debugger;
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentClassSettingExcel',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                    message.success('导入成功');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *importStudentScoreList({ payload }, { call, put }) {
            const response = yield call(importStudentScoreList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                yield put({
                    type: 'setImportStudentScoreList',
                    payload: '',
                });
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportStudentScoreList',
                payload: response.content,
            });
        },
        *importStudentScoreExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentScoreExcel, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentScoreExcel',
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
        *importStudentClassList({ payload }, { call, put }) {
            const response = yield call(importStudentClassList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportStudentClassList',
                payload: response.content,
            });
        },
        *importStudentColunteerNull({ payload }, { call, put }) {
            yield put({
                type: 'setImportStudentColunteer',
                payload,
            });
        },
        *importStudentScoreListNull({ payload }, { call, put }) {
            yield put({
                type: 'setImportStudentScoreList',
                payload,
            });
        },
        *importStudentClassExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentClassExcel, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentClassExcel',
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
        *importStudentResultList({ payload }, { call, put }) {
            const response = yield call(importStudentResultList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportStudentResultList',
                payload: response.content,
            });
        },
        *importStudentResultExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentResultExcel, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentResultExcel',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                    message.success('导入成功');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *studentCombinationImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentCombinationImport, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentCombinationExcel',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                    message.success('导入成功');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getClassProgram({ payload }, { call, put }) {
            const response = yield call(getclaPro, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getPro',
                payload: response.content,
            });
        },
        *adjustToAdmin({ payload }, { call, put }) {
            const response = yield call(adjustToadmin, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'adjustAdmin',
                payload: response.content,
            });
        },
        *adjustToLayered({ payload }, { call, put }) {
            const response = yield call(adjustTolayer, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'adjustLayer',
                payload: response.content,
            });
        },
        *getAllClass({ payload }, { call, put }) {
            const response = yield call(allClasses, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'allCLass',
                payload: response.content,
            });
        },
        *getAllCourse({ payload }, { call, put }) {
            const response = yield call(allCourses, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'allCOurse',
                payload: response.content,
            });
        },
        *adjustPos({ payload }, { call, put }) {
            const response = yield call(getPos, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'allPos',
                payload: response.content,
            });
        },
        *handleOkAdjust({ payload }, { call, put }) {
            const response = yield call(handleOkAdjust, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'submitAdjust',
                payload: response.content,
            });
        },
        *getAdminScore({ payload }, { call, put }) {
            const response = yield call(getAdminScore, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'adminScore',
                payload: response.content,
            });
        },
        *getAdminPos({ payload }, { call, put }) {
            const response = yield call(getAdminPos, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'adminPos',
                payload: response.content,
            });
        },
        //导出课时计划
        *exportDivideResultAdminClassView({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportDivideResultAdminClassView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },
        *exportDivideResultAdminClassScoreView({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportDivideResultAdminClassScoreView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },
        *exportDivideResultTeachingClassView({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportDivideResultTeachingClassView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },
        *exportDivideResultStudentView({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportDivideResultStudentView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            onSuccess && onSuccess(response.content);
        },
        *divideResultCombinationView({ payload }, { call, put }) {
            const response = yield call(divideResultCombinationView, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'comView',
                payload: response.content,
            });
        },
        *choiceSelectList({ payload, onSuccess }, { call, put }) {
            const response = yield call(choiceSelectList, payload);
            // console.log('response', response);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            onSuccess && onSuccess(response);
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setChoiceSelectList',
                payload: response.content,
            });
        },
        *studentConfirm({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentConfirm, payload);
            // console.log('response', response);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            onSuccess && onSuccess(response);
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setStudentConfirm',
                payload: response.content,
            });
        },
        *showCombinationDetail({ payload }, { call, put }) {
            const response = yield call(showCombinationDetail, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'comDetail',
                payload: response.content,
            });
        },
        *updateCombination({ payload }, { call, put }) {
            const response = yield call(updateCombination, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'undateCom',
                payload: response.content,
            });
        },
        *confirmSync({ payload, onSuccess }, { call, put }) {
            const response = yield call(confirmSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setConfirmSync',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    yield put({
                        type: 'setConfirmSync',
                        payload: response,
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *confirmSyncText({ payload, onSuccess }, { call, put }) {
            const response = yield call(confirmSyncText, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setConfirmSyncText',
                        payload: response,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    yield put({
                        type: 'setConfirmSyncText',
                        payload: response,
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *dividePlanDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(dividePlanDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setDividePlanDetail',
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
        *weekVersionList({ payload, onSuccess }, { call, put }) {
            const response = yield call(weekVersionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setWeekVersionList',
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
        *saveDividePlanSyncSchduleResult({ payload, onSuccess }, { call, put }) {
            const response = yield call(saveDividePlanSyncSchduleResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setSaveDividePlanSyncSchduleResult',
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
        *editClassPlan({ payload, onSuccess }, { call, put }) {
            const response = yield call(editClassPlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setEditClassPlan',
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
        *checkDivideResultClass({ payload }, { call, put }) {
            const response = yield call(checkDivideResultClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'getCheckDivideResultClass',
                payload: response.content,
            });
        },
    },
    reducers: {
        toDivision(state, { payload }) {
            return {
                ...state,
                devisionList: payload,
            };
        },
        getCards(state, { payload }) {
            return {
                ...state,
                cards: payload,
            };
        },
        getStuComView(state, { payload }) {
            return {
                ...state,
                stuComView: payload,
            };
        },
        getGrade(state, { payload }) {
            return {
                ...state,
                allGrades: payload,
            };
        },
        saveDetail(state, { payload }) {
            return {
                ...state,
                detail: payload,
            };
        },
        getRes(state, { payload }) {
            return {
                ...state,
                divisionRes: payload,
            };
        },
        addDivi(state, { payload }) {
            return {
                ...state,
                classList: payload,
            };
        },
        setImportStudentColunteer(state, { payload }) {
            return {
                ...state,
                importStudentColunteer: payload,
            };
        },
        setImportStudentExcel(state, { payload }) {
            return {
                ...state,
                importStudentExcel: payload,
            };
        },
        setImportStudentScoreList(state, { payload }) {
            return {
                ...state,
                importStudentScoreList: payload,
            };
        },
        setImportStudentScoreExcel(state, { payload }) {
            return {
                ...state,
                importStudentScoreExcel: payload,
            };
        },
        setImportStudentClassList(state, { payload }) {
            return {
                ...state,
                importStudentClassList: payload,
            };
        },
        setImportStudentClassExcel(state, { payload }) {
            return {
                ...state,
                importStudentClassExcel: payload,
            };
        },
        setImportStudentResultList(state, { payload }) {
            return {
                ...state,
                importStudentResultList: payload,
            };
        },
        setImportStudentResultExcel(state, { payload }) {
            return {
                ...state,
                importStudentResultExcel: payload,
            };
        },
        setImportStudentCombinationExcel(state, { payload }) {
            return {
                ...state,
                studentCombinationImport: payload,
            };
        },
        getPro(state, { payload }) {
            return {
                ...state,
                classPro: payload,
            };
        },
        adjustAdmin(state, { payload }) {
            return {
                ...state,
                toAdmin: payload,
            };
        },
        adjustLayer(state, { payload }) {
            return {
                ...state,
                toLayer: payload,
            };
        },
        allCLass(state, { payload }) {
            return {
                ...state,
                allCLasses: payload,
            };
        },
        allCOurse(state, { payload }) {
            return {
                ...state,
                allCOurses: payload,
            };
        },
        allPos(state, { payload }) {
            return {
                ...state,
                allAdjustPos: payload,
            };
        },
        submitAdjust(state, { payload }) {
            return {
                ...state,
                submitOk: payload,
            };
        },
        adminScore(state, { payload }) {
            return {
                ...state,
                allAdminScore: payload,
            };
        },
        adminPos(state, { payload }) {
            return {
                ...state,
                allAdminPos: payload,
            };
        },
        setGrade(state, { payload }) {
            return {
                ...state,
                gradename: payload,
            };
        },
        studentView(state, { payload }) {
            return {
                ...state,
                studentInfo: payload,
            };
        },
        comView(state, { payload }) {
            return {
                ...state,
                divideResultCombinationView: payload,
            };
        },
        setChoiceSelectList(state, { payload }) {
            return {
                ...state,
                choiceSelectList: payload,
            };
        },
        setStudentConfirm(state, { payload }) {
            return {
                ...state,
                studentConfirm: payload,
            };
        },
        comDetail(state, { payload }) {
            return {
                ...state,
                combinationDetail: payload,
            };
        },
        undateCom(state, { payload }) {
            return {
                ...state,
                combinationUpdated: payload,
            };
        },
        setConfirmSync(state, { payload }) {
            return {
                ...state,
                confirmSync: payload,
            };
        },
        setConfirmSyncText(state, { payload }) {
            return {
                ...state,
                confirmSyncText: payload,
            };
        },
        setDividePlanDetail(state, { payload }) {
            return {
                ...state,
                dividePlanDetail: payload,
            };
        },
        setWeekVersionList(state, { payload }) {
            return {
                ...state,
                weekVersionList: payload,
            };
        },
        setSaveDividePlanSyncSchduleResult(state, { payload }) {
            return {
                ...state,
                saveDividePlanSyncSchduleResult: payload,
            };
        },
        setImportStudentClassSettingExcel(state, { payload }) {
            return {
                ...state,
                importStudentClassSettingExcel: payload,
            };
        },
        setEditClassPlan(state, { payload }) {
            return {
                ...state,
                editClassPlan: payload,
            };
        },
        getCheckDivideResultClass(state, { payload }) {
            return {
                ...state,
                checkDivideResultClass: payload,
            };
        },
    },
};
