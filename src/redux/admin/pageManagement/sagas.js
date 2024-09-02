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
import { store } from "./../../store";
import { getLocaleMessages } from "redux/helper";

export function* get_CMS_info(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/cms/getAll?languageid=${params.payload}`)
    );
    yield put({
      type: actions.GET_CMS_INFO_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CMS_INFO_FAILURE });
  }
}

export function* get_CMS_infobyid(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/cms/get?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_CMS_INFO_BYID_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CMS_INFO_BYID_FAILURE });
  }
}

export function* cmsinfo_iud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/cms/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/cms/update", params.payload)
      );
    }
    yield put({
      type: actions.CMSIUD_STATUS_SUCCESS,
      payload: response.data.data,
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("CMS created successfully"))
      : message.success(getLocaleMessages("CMS updated successfully"));
    history.push("/admin/cms");
  } catch (error) {
    yield put({ type: actions.CMSIUD_STATUS_FAILURE });
  }
}

export function* change_CMS_status(params) {
  try {
    yield call(() => putRequest("admin/cms/cmsstatus", params.payload));
    yield put({
      type: actions.CHANGE_CMS_STATUS_SUCCESS,
    });
    message.success(getLocaleMessages("CMS status has been successfully"));
  } catch (error) {
    yield put({ type: actions.CHANGE_CMS_STATUS_FAILURE });
  }
}
export function* remove_CMS_details(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const { cmsid } = params.payload;
    const response = yield call(() =>
      deleteRequest(`admin/cms/delete?id=${cmsid}&subLang=${locale}`)
    );
    yield put({
      type: actions.REMOVE_CMS_DETAILS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("CMS has removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_CMS_DETAILS_FAILURE });
  }
}
export function* get_FAQ_info(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      getRequest(`admin/faq/getAll?languageid=${locale}`)
    );
    yield put({
      type: actions.GET_FAQ_INFO_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_FAQ_INFO_FAILURE });
  }
}

export function* get_FAQ_infobyid(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/faq/get?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_FAQ_INFO_BYID_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_FAQ_INFO_BYID_FAILURE });
  }
}

export function* faqinfo_iud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/faq/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/faq/update", params.payload)
      );
    }
    yield put({
      type: actions.FAQIUD_STATUS_SUCCESS,
      // payload: response.data.data
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("FAQ created successfully"))
      : message.success(getLocaleMessages("FAQ updated successfully"));
    setTimeout(() => {
      history.push("/admin/faq");
    }, 500);
  } catch (error) {
    yield put({ type: actions.FAQIUD_STATUS_FAILURE });
  }
}

export function* change_FAQ_status(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      putRequest("admin/faq/faqstatus", { subLang: locale, ...params.payload })
    );
    yield put({
      type: actions.CHANGE_FAQ_STATUS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("FAQ status has changed successfully"));
  } catch (error) {
    yield put({ type: actions.CHANGE_FAQ_STATUS_FAILURE });
  }
}
export function* remove_FAQ_details(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const { faqid } = params.payload;
    const response = yield call(() =>
      deleteRequest(
        `admin/faq/delete?id=${faqid}&subLang=${locale}`,
        params.payload
      )
    );
    yield put({
      type: actions.REMOVE_FAQ_DETAILS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("FAQ has removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_FAQ_DETAILS_FAILURE });
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CMS_INFO, get_CMS_info),
    takeEvery(actions.GET_CMS_INFO_BYID, get_CMS_infobyid),
    takeEvery(actions.CMSIUD_STATUS, cmsinfo_iud),
    takeEvery(actions.CHANGE_CMS_STATUS, change_CMS_status),
    takeEvery(actions.REMOVE_CMS_DETAILS, remove_CMS_details),

    // //faq
    takeEvery(actions.GET_FAQ_INFO, get_FAQ_info),
    takeEvery(actions.GET_FAQ_INFO_BYID, get_FAQ_infobyid),
    takeEvery(actions.FAQIUD_STATUS, faqinfo_iud),
    takeEvery(actions.CHANGE_FAQ_STATUS, change_FAQ_status),
    takeEvery(actions.REMOVE_FAQ_DETAILS, remove_FAQ_details),
  ]);
}
