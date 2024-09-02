import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { history } from 'redux/store';
import actions from './actions';
import {
    getRequest,
    deleteRequest,
    postRequest
} from '../../../helpers/axiosClient';
// import { history, store } from 'redux/store';
import { message } from 'antd';

export function* GetUserList(params) {
    try {
        const response = yield call(() =>
            getRequest(`admin/user/getAll`),
        );
        yield put({
            type: actions.GET_USERS_LIST_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({ type: actions.GET_USERS_LIST_FAILURE });
    }
}

export function* GetUserRoleList(params) {
    try {
        const response = yield call(() =>
            getRequest(`admin/role/getall`),
        );
        yield put({
            type: actions.GET_USEROLES_LIST_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({ type: actions.GET_USEROLES_LIST_FAILURE });
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.GET_USERS_LIST, GetUserList),
        takeEvery(actions.GET_USEROLES_LIST, GetUserRoleList),
    ]);
}