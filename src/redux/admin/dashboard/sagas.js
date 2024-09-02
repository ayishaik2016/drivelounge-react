import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from "./../../../helpers/axiosClient";
import { getLocalDataType } from "redux/helper";
import { message } from "antd";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* GetDashboardCount(params) {
  try {
    const id =
      getLocalDataType() == "agency"
        ? JSON.parse(localStorage.getItem("user_data"))["id"]
        : 0;
    const response = yield call(() =>
      getRequest(
        `admin/dashboard/getcounts?id=${id}&hasdate=${params.payload.hasDate}&from=${params.payload._fromdate}&to=${params.payload._todate}`
      )
    );
    yield put({
      type: actions.GET_DASHBOARD_COUNTS_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    message.error(error.response.data.message);
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
    yield put({ type: actions.GET_DASHBOARD_COUNTS_FAILURE });
  }
}

export function* GetDashboardBarCount(params) {
  try {
    const id =
      getLocalDataType() == "agency"
        ? JSON.parse(localStorage.getItem("user_data"))["id"]
        : 0;
    const response = yield call(() =>
      getRequest(
        `admin/dashboard/getbarcounts?id=${id}&type=${params.payload.type}&hasdate=${params.payload.hasDate}&from=${params.payload._fromdate}&to=${params.payload._todate}`
      )
    );
    yield put({
      type: actions.GET_DASHBOARD_BAR_COUNTS_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_DASHBOARD_BAR_COUNTS_FAILURE });
  }
}

export function* GetDashboardPieCount(params) {
  try {
    const id =
      getLocalDataType() == "agency"
        ? JSON.parse(localStorage.getItem("user_data"))["id"]
        : 0;
    const response = yield call(() =>
      getRequest(
        `admin/dashboard/getpiecounts?id=${id}&type=${params.payload.type}&hasdate=${params.payload.hasDate}&from=${params.payload._fromdate}&to=${params.payload._todate}`
      )
    );
    yield put({
      type: actions.GET_DASHBOARD_PIE_COUNTS_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_DASHBOARD_PIE_COUNTS_FAILURE });
  }
}

export function* GetBookingList(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/booking/booking", params.payload)
    );
    yield put({
      type: actions.GET_DASHBOARD_BOOKINGS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_DASHBOARD_BOOKINGS_FAILURE });
  }
}

export function* GetCarList() {
  try {
    const response = yield call(() =>
      postRequest("admin/car/carmanagement", { carstatus: 1 })
    );
    yield put({
      type: actions.GET_DASHBOARD_CARLIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_DASHBOARD_CARLIST_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DASHBOARD_COUNTS, GetDashboardCount),
    //bar chart
    takeEvery(actions.GET_DASHBOARD_BAR_COUNTS, GetDashboardBarCount),
    //pie chart
    takeEvery(actions.GET_DASHBOARD_PIE_COUNTS, GetDashboardPieCount),
    takeEvery(actions.GET_DASHBOARD_BOOKINGS, GetBookingList),
    takeEvery(actions.GET_DASHBOARD_CARLIST, GetCarList),
  ]);
}
