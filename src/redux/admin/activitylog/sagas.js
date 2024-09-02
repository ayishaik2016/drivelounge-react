import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import actions from "./actions";
import { postRequest, deleteRequest } from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* get_activitylog_info(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/activitylog/getAll", params.payload)
    );
    yield put({
      type: actions.GET_ACTIVITYLOG_INFO_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ACTIVITYLOG_INFO_FAILURE });
  }
}

export function* remove_activitylog_details(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/activitylog/delete?id=${params.payload.id}`)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_ACTIVITYLOG_INFO_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("Activity log removed successfully"));
      params?.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_ACTIVITYLOG_INFO_FAILURE });
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ACTIVITYLOG_INFO, get_activitylog_info),
    takeEvery(actions.REMOVE_ACTIVITYLOG_INFO, remove_activitylog_details),
  ]);
}
