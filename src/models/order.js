import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    batchOrderQuery,
    getTransactionsDetail,
    personalArrangements,
    disciplineManagement,
    subjectChief,
    gradeDetails,
    sectionList,
    currentSemesterSubjectAsync,
    createStageSubject,
    stageSubject,
    updateStageSubject,
    personalSubjectTemplate,
    changeViewConfig,
} from '../services/order';

export default {
    namespace: 'order',
    state: {
        batchOrderQueryList: '',
        transactionsDetailList: '',
        personalArrangements: [],
        disciplineManagement: [],
        subjectChief: [],
        gradeDetails: [],
        sectionList: [],
        currentSemesterSubject: [],
        createStageSubject: [],
        stageSubject: [],
        updateStageSubject: [],
        personalSubjectTemplate: [],
    },
    effects: {
        // 账户收入明细查询
        *batchOrderQuery({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(batchOrderQuery, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'batch',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 查询交易流水
        *getTransactionsDetail({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getTransactionsDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'trade',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *currentSemesterSubject({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(personalSubjectTemplate, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'savePerson',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *disciplineManagement({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(disciplineManagement, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'disciplineManagementList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *subjectChief({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(subjectChief, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'subjectChiefList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *gradeDetails({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(gradeDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'gradeDetailList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *sectionList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(sectionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getSectionList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *stageSubject({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(stageSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getStageSubject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCurrentSemesterSubject({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(currentSemesterSubjectAsync, payload);
            console.log(response, 'response1');
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'currentSemesterSubjectList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *createStageSubject({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(createStageSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getCreateStageSubject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateStageSubject({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(updateStageSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getUpdateStageSubject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //个人工作安排
        *personalArrangements({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(personalArrangements, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'personalArrangementsList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //报表显示设置
        *changeViewConfig({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(changeViewConfig, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message)
                    onSuccess && onSuccess()
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        batch(state, action) {
            return {
                ...state,
                batchOrderQueryList: action.payload,
            };
        },
        trade(state, action) {
            return {
                ...state,
                transactionsDetailList: action.payload,
            };
        },
        getStageSubject(state, action) {
            return {
                ...state,
                stageSubject: action.payload,
            };
        },
        disciplineManagementList(state, action) {
            return {
                ...state,
                disciplineManagement: action.payload,
            };
        },
        subjectChiefList(state, action) {
            return {
                ...state,
                subjectChief: action.payload,
            };
        },
        gradeDetailList(state, action) {
            return {
                ...state,
                gradeDetails: action.payload,
            };
        },
        getSectionList(state, action) {
            return {
                ...state,
                sectionList: action.payload,
            };
        },
        currentSemesterSubjectList(state, action) {
            return {
                ...state,
                currentSemesterSubject: action.payload,
            };
        },
        getCreateStageSubject(state, action) {
            return {
                ...state,
                createStageSubject: action.payload,
            };
        },
        getUpdateStageSubject(state, action) {
            return {
                ...state,
                updateStageSubject: action.payload,
            };
        },
        savePerson(state, action) {
            return {
                ...state,
                personalSubjectTemplate: action.payload,
            };
        },

        personalArrangementsList(state, action) {
            return {
                ...state,
                personalArrangements: action.payload,
            };
        },
    },
};
