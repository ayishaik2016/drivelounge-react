import { all, put, call, takeEvery } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  putRequest,
  postRequest,
  deleteRequest,
} from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";

export function* getAllRating() {
  try {
    const response = yield call(() => getRequest("admin/review/getAll"));
    yield put({
      type: actions.GET_RATING_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // handleException(error);
    yield put({ type: actions.GET_RATING_LIST_FAILURE });
  }
}

export function* createrating(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/review/create", params.payload)
    );
    yield put({
      type: actions.CREATE_RATING_LIST_SUCCESS,
      payload: response.data.data,
    });
    if (response?.status < 400) {
      params.callBackAction(response);
      message.success(
        response?.data?.name !== undefined && response?.data?.name !== ""
          ? response.data?.name
          : getLocaleMessages("Rating added successfully")
      );
    }
  } catch (error) {
    // handleException(error);
    yield put({ type: actions.CREATE_RATING_LIST_FAILURE });
    message.error(getLocaleMessages("Error occurred"));
  }
}

export function* removerating(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/review/delete?id=${params.payload}`)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_RATING_LIST_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("Review removed successfully"));
      params.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_RATING_LIST_FAILURE });
  }
}

export function* changeratingstatus(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/review/status", params.payload)
    );
    yield put({
      type: actions.STATUS_RATING_LIST_SUCCESS,
      payload: response.data.data,
    });
    message.info(getLocaleMessages("Review status has changed successfully"));
  } catch (error) {
    // handleException(error);
    yield put({ type: actions.STATUS_RATING_LIST_FAILURE });
  }
}

export function* getAdminRating(params) {
  try {
    const response = yield call(() =>
      getRequest("public/review/getall?status=1&vendorid=1")
    );
    yield put({
      type: actions.GET_ADMIN_RATING_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ADMIN_RATING_LIST_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_RATING_LIST, getAllRating),
    takeEvery(actions.CREATE_RATING_LIST, createrating),
    takeEvery(actions.REMOVE_RATING_LIST, removerating),
    takeEvery(actions.STATUS_RATING_LIST, changeratingstatus),
  ]);
}
