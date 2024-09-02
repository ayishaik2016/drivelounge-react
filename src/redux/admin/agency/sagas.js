import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import { store } from "./../../store";

export function* get_agency_info(params) {
  try {
    const locale = store.getState().Auth.subLang;
    const response = yield call(() =>
      getRequest(
        `admin/agent/getAll?status=${params.payload.status}&lang=${locale}`
      )
    );
    if (response?.status < 400) {
      yield put({
        type: actions.GET_AGENCY_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    yield put({ type: actions.GET_AGENCY_FAILURE });
  }
}

export function* get_agency_bylang(params) {
  try {
    const locale = store.getState().Auth.subLang;
    const response = yield call(() =>
      getRequest(
        `admin/agent/getByAllLang?status=${params.payload.status}&lang=${
          locale == "en" ? 1 : 2
        }`
      )
    );
    yield put({
      type: actions.GET_AGENCY_BYLANG_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AGENCY_BYLANG_FAILURE });
  }
}

export function* agency_iud(params) {
  try {
    if (params.payload.action == "I") {
      yield call(() => postRequest("admin/agent/create", params.payload));
    } else {
      yield call(() => postRequest("admin/agent/update", params.payload));
    }
    yield put({
      type: actions.AGENCY_INFORMATION_IUD_SUCCESS,
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("Agency created successfully"))
      : message.success(getLocaleMessages("Agency updated successfully"))(
          getLocalDataType() == "admin"
        )
      ? history.push("/admin/application")
      : history.goBack();
    // history.push('/admin/application');
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.AGENCY_INFORMATION_IUD_FAILURE });
  }
}

export function* agency_getbyid(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/agent/getone?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_AGENCY_INFO_BYID_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    message.error(error.response.data.message);
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
    yield put({ type: actions.GET_AGENCY_INFO_BYID_FAILURE });
  }
}

export function* change_agency_status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/agent/status", params.payload)
    );
    yield put({
      type: actions.CHANGE_AGENCY_STATUS_SUCCESS,
      payload: response.data.data,
    });
    if (response?.status < 400) {
      params.callBackAction();
    }
    message.success(getLocaleMessages("Agency status changed"));
  } catch (error) {
    yield put({ type: actions.CHANGE_AGENCY_STATUS_FAILURE });
  }
}

export function* remove_agency(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/agent/delete?id=${params.payload.id}`)
    );
    if (response?.status < 400) {
      params.callBackAction();
    }
    yield put({
      type: actions.REMOVE_AGENCY_DETAILS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Application removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_AGENCY_DETAILS_FAILURE });
  }
}

export function* remove_admin(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`public/user/admin_remove?id=${params.payload.id}`)
    );

    yield put({
      type: actions.REMOVE_ADMIN_DETAILS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Application removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_ADMIN_DETAILS_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AGENCY_INFO, get_agency_info),
    takeEvery(actions.GET_AGENCY_BYLANG, get_agency_bylang),
    takeEvery(actions.AGENCY_INFORMATION_IUD, agency_iud),
    takeEvery(actions.GET_AGENCY_INFO_BYID, agency_getbyid),
    takeEvery(actions.CHANGE_AGENCY_STATUS, change_agency_status),
    takeEvery(actions.REMOVE_AGENCY_DETAILS, remove_agency),
    takeEvery(actions.REMOVE_ADMIN_DETAILS, remove_admin),
  ]);
}
