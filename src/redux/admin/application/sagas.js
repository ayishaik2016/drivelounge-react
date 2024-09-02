import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { history } from 'redux/store';
import actions from './actions';
import {
    putRequest,
    deleteRequest,
    postRequest
} from './../../../helpers/axiosClient';
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* get_application_info(params) {
    try {
        const response = yield call(() =>
            postRequest('admin/application/getAll', params.payload),
        );
        yield put({
            type: actions.GET_APPLICATION_INFO_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({ type: actions.GET_APPLICATION_INFO_FAILURE });
    }
}

export function* change_application_status(params) {
    try {
        const response = yield call(() =>
            putRequest('admin/application/update', params.payload),
        );
        
    } catch (error) {
        yield put({ type: actions.CHANGE_APPLICATION_STATUS_FAILURE });
    }
}

export function* remove_application_details(params) {
    try {
        const response = yield call(() =>
            deleteRequest('admin/application/remove', params.payload),
        );
        yield put({
            type: actions.REMOVE_APPLICATION_DETAILS_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({ type: actions.REMOVE_APPLICATION_DETAILS_FAILURE });
    }
}
export default function* rootSaga() {
    yield all([
        takeEvery(actions.GET_APPLICATION_INFO, get_application_info),
        takeEvery(actions.CHANGE_APPLICATION_STATUS, change_application_status),
        takeEvery(actions.REMOVE_APPLICATION_DETAILS, remove_application_details),
    ]);
}