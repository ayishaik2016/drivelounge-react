import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  deleteRequest,
  postRequest,
} from "./../../../helpers/axiosClient";
// import { history, store } from 'redux/store';
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";

export function* GetEnquiryList(params) {
  try {
    const response = yield call(() => getRequest(`admin/enquiry/getAll`));
    yield put({
      type: actions.GET_ENQUIRY_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ENQUIRY_LIST_FAILURE });
  }
}

export function* RemoveEnquiry(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/enquiry/delete?id=${params.payload}`)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.CHANGE_ENQUIRY_STATUS_SUCCESS,
        payload: response.data.data !== undefined ? response.data.data : [],
      });
      message.success(
        getLocaleMessages("Request enquiry detail deleted successfully")
      );
      params?.callBackAction();
    }
  } catch (error) {
    yield put({ type: actions.CHANGE_ENQUIRY_STATUS_FAILURE });
  }
}

export function* CreateEnquiry(params) {
  try {
    yield call(() => postRequest("public/enquiry/create", params.values));
    yield put({
      type: actions.CREATE_ENQUIRY_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.CREATE_ENQUIRY_FAILURE });
  }
  message.success(getLocaleMessages("Thanks for contacting us"));
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ENQUIRY_LIST, GetEnquiryList),
    takeEvery(actions.CHANGE_ENQUIRY_STATUS, RemoveEnquiry),
    takeEvery(actions.CREATE_ENQUIRY, CreateEnquiry),
  ]);
}
