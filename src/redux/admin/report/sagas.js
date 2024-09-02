import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history, store } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  deleteRequest,
  postRequest,
} from "../../../helpers/axiosClient";
import {
  // handleException,
  getLocaleMessages,
  getLocalDataType,
  checkValid,
  getLocalData,
} from "redux/helper";
import { message } from "antd";

export function* GetAgencyReport(params) {
  try {
    const id = JSON.parse(localStorage.getItem("user_data"))["id"] | 0;
    const { fdate, ldate, bookingno, carno } = { ...params.payload };
    const response = yield call(() =>
      getRequest(
        `admin/reports/agency?agentid=${id}&fromdate=${fdate}&todate=${ldate}&bookingno=${bookingno}&carno=${carno}`
      )
    );
    yield put({
      type: actions.GET_AGENCY_REPORT_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    message.error(error.response.data.message);
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
    yield put({ type: actions.GET_AGENCY_REPORT_FAILURE });
  }
}

export function* GetAdminReport(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/admin?agentid=${params.payload.agency}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_ADMIN_REPORT_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_ADMIN_REPORT_FAILURE });
  }
}

export function* GetZatvatreptList(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/report1?fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    const result =
      response.data.data[0].length > 0 ? response.data.data[0] : [];
    yield put({
      type: actions.GET_ZATVATREPT_LIST_SUCCESS,
      payload: result,
    });
  } catch (error) {
    yield put({ type: actions.GET_ZATVATREPT_LIST_FAILURE });
  }
}

export function* GetBillreptList(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/report2?agentid=${params.payload.agency}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_BILLREPT_LIST_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_BILLREPT_LIST_FAILURE });
  }
}

export function* GetBookingreptList(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      getRequest(
        `admin/reports/report3?agentid=${params.payload.agency}&lang=${locale}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_BOOKINGREPT_LIST_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_BOOKINGREPT_LIST_FAILURE });
  }
}

export function* GetCanceledBookingrept1List(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/report4?agentid=${params.payload.agency}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_CANCELEDBOOKINGREPT1_LIST_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_CANCELEDBOOKINGREPT1_LIST_FAILURE });
  }
}

export function* GetCanceledBookingrept2List(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/report5?agentid=${params.payload.agency}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_CANCELEDBOOKINGREPT2_LIST_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_CANCELEDBOOKINGREPT2_LIST_FAILURE });
  }
}

export function* GetTotalBookingreptList(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `admin/reports/report6?cityid=${params.payload.city}&fromdate=${params.payload.fdate}&todate=${params.payload.ldate}`
      )
    );
    yield put({
      type: actions.GET_TOTALBOOKINGREPT_LIST_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_TOTALBOOKINGREPT_LIST_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AGENCY_REPORT, GetAgencyReport),
    takeEvery(actions.GET_ADMIN_REPORT, GetAdminReport),

    takeEvery(actions.GET_ZATVATREPT_LIST, GetZatvatreptList),
    takeEvery(actions.GET_BILLREPT_LIST, GetBillreptList),
    takeEvery(actions.GET_BOOKINGREPT_LIST, GetBookingreptList),
    takeEvery(
      actions.GET_CANCELEDBOOKINGREPT1_LIST,
      GetCanceledBookingrept1List
    ),
    takeEvery(
      actions.GET_CANCELEDBOOKINGREPT2_LIST,
      GetCanceledBookingrept2List
    ),
    takeEvery(actions.GET_TOTALBOOKINGREPT_LIST, GetTotalBookingreptList),
  ]);
}
