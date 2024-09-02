import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import { postRequest, getRequest, putRequest } from "helpers/axiosClient";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* getAgencyList(params) {
  try {
    const response = yield call(() =>
      getRequest(`public/agent/getAll?status=${params.payload.status}`)
    );
    yield put({
      type: actions.GET_AGENCY_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AGENCY_LIST_FAILURE });
  }
}

export function* setFavorites(params) {
  try {
    const response = yield call(() =>
      postRequest(`user/favorite/create`, params.payload)
    );
    if (response?.status < 400) {
      params.callBackAction(response);
    }
    yield put({
      type: actions.SET_FAVORITE_SUCCESS,
      payload: response,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.SET_FAVORITE_FAILURE });
  }
}

export function* removeFavorites(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/favorite/remove`, params.payload)
    );
    yield put({
      type: actions.SET_FAVORITE_SUCCESS,
      payload: response.data.data,
    });
    if (response?.status < 400) {
      message.success(
        getLocaleMessages("Your favorites has successfully removed.")
      );
    }
  } catch (error) {
    message.error(error.response);
    yield put({ type: actions.SET_FAVORITE_FAILURE });
  }
}

export function* getFavorites(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/favorite/get?userid=${params.payload.userid}`)
    );
    yield put({
      type: actions.GET_FAVORITE_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_FAVORITE_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AGENCY_LIST, getAgencyList),
    takeEvery(actions.SET_FAVORITE, setFavorites),
    takeEvery(actions.REMOVE_FAVORITE, removeFavorites),
    takeEvery(actions.GET_FAVORITE, getFavorites),
    // takeEvery(actions.GET_LOGIN_LISTING_SALOON, loginListingSaloon),
  ]);
}
