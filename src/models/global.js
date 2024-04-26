import { loginRedirect } from '../utils/utils';
import { locale } from '../utils/i18n';
import { message } from 'antd';
import {
    // getPayCurrentUser,
    getCurrentUser,
    queryLang, //切换语言
    queryNoticeList, //消息列表
    queryNoticeNumber, //消息条数
    queryNoticeRead, //标为已读
    havePower, //是否有权限
    havePayPower, // 是否有收费管理入口权限
    fetchTeacherAndOrg, //查找全部组织和人员接口
    getOssAssume,
    uploadFileNew,
    getNewCurrentUser,
    queryLangNew,
    listRolePermission,
} from '../services/global';

export default {
    namespace: 'global',
    state: {
        currentUser: {}, //当前用户信息
        // currentPayUser:{},
        collapsed: true,
        menuVisible: true,
        readNoticeList: [], //已读消息列表
        noReadNoticeList: [], //未读消息列表
        totalRead: 0, //已读消息条数
        unreadTotal: 0, //未读消息条数
        powerStatus: {}, //获取是否有权限的数据
        powerPayStatus: {}, // 获取收费管理模块权限
        teacherAndOrgList: [], //全部人员和组织
        ossAssumeResult: {}, //oss授权地址参数
        uploadFileResponse: {}, //上传附件
        userSchoolId: false,
        courseCur: '',
        currentLang: 'cn',
        rolePermissionobj: {}
    },
    subscriptions: {
        setup: ({ history, dispatch }) =>
            history.listen(({ pathname }) => {
                let _url = new URL(window.location);
                //   const isScore = pathToRegexp('/AddScore/:id/:planId/:studentId').exec(pathname);
                if (pathname == '/' && window.location.search.indexOf('/mobilePay/index') != -1) {
                    console.log(window.location.search, 'search');
                    window.location.hash = '#/mobilePay/index';
                } else if (pathname == '/' && _url.searchParams && _url.searchParams.get('hash')) {
                    window.location.hash = `#/${_url.searchParams.get('hash')}`;
                }
            }),
    },
    effects: {
        // *getPayCurrentUser({ payload }, { call, put }) {
        //     const response = yield call(getPayCurrentUser, payload);
        //     if(response.ifLogin) {
        //         if(response.status) {
        //             yield put({
        //                 type: 'currentUserReducersPay',
        //                 payload: response.content
        //             })
        //         }else {
        //             message.error(response.message);
        //         }
        //     }else {
        //         loginRedirect();
        //     }
        // },
        *payloadUploadFile({ payload, onSuccess }, { call, put }) {
            //上传文件到服务器
            const response = yield call(uploadFileNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveFileList',
                        responseContent: response.content,
                        requestSource: payload,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCurrentUser({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCurrentUser, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'currentUserReducers',
                        payload: response.content,
                    });
                    yield put({
                        type: 'getUserSchoolId',
                        payload:
                            /* response.content.schoolId == '1000001000' ||
                            response.content.schoolId == '1000001001', */
                            [1000001000, 1000001001].includes(response.content.schoolId),
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getNewCurrentUser({ payload, onSuccess, onFail }, { call, put }) {
            const response = yield call(getNewCurrentUser, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'currentUserReducers',
                        payload: response.content,
                    });

                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                // loginRedirect();
                onFail && onFail();
            }
        },

        *checkLange(_, { call, put }) {
            //切换语言
            const response = yield call(queryLang, _.payload);
            if (response.ifLogin) {
                if (response.status) {
                    window.location.reload();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *checkLangeNew(_, { call, put }) {
            //切换语言
            const response = yield call(queryLangNew, _.payload);
            // if (response.ifLogin) {
            if (response.status) {
                window.location.reload();
            } else {
                message.error(response.message);
            }
            // } else {
            //     loginRedirect();
            // }
        },

        *getNoticeList({ payload }, { call, put }) {
            yield put({ type: 'getNoticeNumber' });
            const response = yield call(queryNoticeList, payload);

            if (!response.status) {
                message.error(response.message);
                return;
            }

            if (payload.read) {
                yield put({
                    type: 'saveReadNoticeList',
                    payload: response,
                });
            } else {
                yield put({
                    type: 'saveNoReadNoticeList',
                    payload: response,
                });
            }
        },
        *getNoticeNumber({ payload }, { call, put }) {
            const response = yield call(queryNoticeNumber, payload);

            if (!response.status) {
                message.error(response.message);
                return;
            }

            yield put({
                type: 'saveNoticeNumber',
                payload: response,
            });
        },
        *noticeRead({ payload, onSuccess }, { call, put }) {
            //标为已读
            const response = yield call(queryNoticeRead, payload);

            if (response.status) {
                onSuccess();
            } else {
                message.error(response.message);
            }
        },
        *getOssAssume({ payload, onSuccess }, { call, put }) {
            //获取oss授权地址
            const response = yield call(getOssAssume, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'ossAssumeResponse',
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
        *havePower({ payload, onSuccess }, { call, put }) {
            const response = yield call(havePower, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'isHavePower',
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
        *havePayPower({ payload }, { call, put }) {
            const response = yield call(havePayPower, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'isHavePayPower',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getCourseIndexTeacherAndOrg({ payload }, { call, put }) {
            yield put({
                type: 'saveTeacherOrg',
                payload: payload,
            });
        },

        *clearData({ payload }, { call, put }) {
            yield put({
                type: 'clearRoleList',
                payload: payload,
            });
        },

        *fetchTeacherAndOrg({ payload }, { call, put }) {
            const response = yield call(fetchTeacherAndOrg, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveTeacherOrg',
                        payload: response.content || [],
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listRolePermission({ payload }, { call, put }) {
            const response = yield call(listRolePermission, payload);
            if (response.status) {
                yield put({
                    type: 'rolePermissonReducer',
                    payload: response.content || {},
                });
            } else {
                message.error(response.message);
            }
        },
    },
    reducers: {
        clearRoleList(state, action){
            return {
                ...state,
                rolePermissionobj: {},
            };
        },
        setCurrentLang(state, action) {
            return {
                ...state,
                currentLang: locale(),
            };
        },
        setCourseCur(state, action) {
            return {
                ...state,
                courseCur: action.payload,
            };
        },
        currentUserReducers(state, action) {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        // currentUserReducersPay(state, action) {
        //     return {
        //         ...state,
        //         currentPayUser: action.payload
        //     }
        // },
        changeMenuVisible(state, { payload }) {
            return {
                ...state,
                menuVisible: payload,
            };
        },
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveReadNoticeList(state, action) {
            return {
                ...state,
                readNoticeList: action.payload.content,
            };
        },
        saveNoReadNoticeList(state, action) {
            return {
                ...state,
                noReadNoticeList: action.payload.content,
            };
        },
        saveNoticeNumber(state, action) {
            return {
                ...state,
                totalRead: action.payload.content.totalRead,
                unreadTotal: action.payload.content.unreadTotal,
            };
        },
        isHavePower(state, action) {
            return {
                ...state,
                powerStatus: action.payload,
            };
        },
        isHavePayPower(state, action) {
            return {
                ...state,
                powerPayStatus: action.payload,
            };
        },
        saveFileList(state, action) {
            //上传附件
            let uuid = action.requestSource && action.requestSource.uuid;
            let response = JSON.parse(JSON.stringify(action.responseContent));
            if (response) {
                response.uuid = uuid;
                response.status = 'done';
            }
            return {
                ...state,
                uploadFileResponse: response,
            };
        },
        saveTeacherOrg(state, action) {
            return {
                ...state,
                fetchTeacherAndOrg: action.payload,
            };
        },
        rolePermissonReducer(state, action) {
            console.log('state: ', state, action);
            return {
                ...state,
                rolePermissionobj: action.payload,
            };
        },
        ossAssumeResponse(state, action) {
            return {
                ...state,
                ossAssumeResult: action.payload,
            };
        },

        getUserSchoolId(state, action) {
            return {
                ...state,
                userSchoolId: action.payload,
            };
        },
    },
};
