import { loginRedirect } from '../utils/utils';
import { message } from 'antd';

import { addBorder, removableColor, updateACToBuffer } from '../services/exchangeCourse';
import { newExchangeClass } from '../services/timeTable';
export default {
    namespace: 'exchangeCourse',
    state: {
        border: [],
        move: {},
        reason: [],
        exchangeResult: {},
    },
    effects: {
        // 判断边框
        *getBorder({ payload }, { call, put }) {
            // const response = yield call(addBorder, payload);
            // yield put ({
            //     type: 'getBorder',
            //     payload: response.content
            // })
            const response = yield call(addBorder, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getBorder',
                        payload: response.content,
                    });
                    //   onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 判断可否移动
        *getMove({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(removableColor, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveMove',
                        payload: response.content || [],
                    });
                    onSuccess && onSuccess();
                } else {
                    onError && onError();
                    if (response.code === 1416) return;
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchRemovableColor({ payload, onSuccess, onError }, { call, put }) {
            const moveResponse = yield call(removableColor, payload);
            if (moveResponse.ifLogin) {
                if (moveResponse.status || moveResponse.code == 1416) {
                    if (moveResponse.status || moveResponse.code == 1416) {
                        yield put({
                            type: 'saveMove',
                            payload: moveResponse,
                        });
                    }
                } else {
                    onError && onError();
                    if (moveResponse.code === 1416) return;
                    message.error(moveResponse.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchNewExchangeClass({ payload, onSuccess, onError }, { call, put }) {
            const exchangeResponse = yield call(newExchangeClass, payload);
            if (exchangeResponse.ifLogin) {
                if (exchangeResponse.status || exchangeResponse.code == 1416) {
                    if (exchangeResponse.status || exchangeResponse.code == 1416) {
                        yield put({
                            type: 'saveExchange',
                            payload: exchangeResponse,
                        });
                    }
                } else {
                    onError && onError();
                    if (exchangeResponse.code === 1416) return;
                }
            } else {
                loginRedirect();
            }
        },
        // 清空可移动
        *clearMoveList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'clearMove',
            });
        },
        *conflictReason({ payload }, { call, put }) {
            const response = yield call(removableColor, payload);
            yield put({
                type: 'saveReason',
                payload: response.content.changeClassList,
            });
        },

        *updateACToBuffer({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateACToBuffer, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('移动成功');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },

    reducers: {
        clearMove(state, action) {
            return {
                ...state,
                move: [],
            };
        },
        getBorder(state, action) {
            return {
                ...state,
                border: action.payload,
            };
        },
        saveMove(state, action) {
            return {
                ...state,
                move: action.payload,
            };
        },
        saveExchange(state, action) {
            return {
                ...state,
                exchangeResult: action.payload,
            };
        },
        saveReason(state, action) {
            return {
                ...state,
                reason: action.payload,
            };
        },
    },
};
