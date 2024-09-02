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

export function* getcouponlist() {
  try {
    const response = yield call(() => getRequest("admin/coupon/getAll"));
    yield put({
      type: actions.GET_COUPON_LIST_SUCCESS,
      payload: response.data ? response.data.data : [],
    });
  } catch (error) {
    yield put({ type: actions.GET_COUPON_LIST_FAILURE });
  }
}

export function* getcouponById(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/coupon/getcoupon?couponid=${params.payload.id}`)
    );
    yield put({
      type: actions.GET_COUPON_BY_ID_SUCCESS,
      payload: response.data ? response.data.data : [],
    });
    if (response?.status < 400) {
      params.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.GET_COUPON_BY_ID__FAILURE });
  }
}

export function* get_useragency_list() {
  try {
    const response = yield call(() =>
      getRequest("common/coupon/get_useragency_list")
    );
    yield put({
      type: actions.GET_USERS_AGENCY_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_USERS_AGENCY_LIST_FAILURE });
  }
}
export function* generate_couponcode(params) {
  try {
    const response = yield call(() =>
      getRequest("admin/coupon/generate_couponcode")
    );
    yield put({
      type: actions.GENERATE_COUPON_CODE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GENERATE_COUPON_CODE_FAILURE });
  }
}

export function* create_newcoupon(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/coupon/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/coupon/update", params.payload)
      );
    }
    if (response?.status < 400) {
      params.callBackAction(response);
    }
    yield put({
      type: actions.CREATE_NEW_COUPON_SUCCESS,
      payload: response.data.data.data,
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("New coupon created successfully"))
      : message.success(getLocaleMessages("Coupon updated successfully"));
  } catch (error) {
	message.error(error.response && error.response.data && error.response.data.message);
    yield put({ type: actions.CREATE_NEW_COUPON_FAILURE });
  }
}

export function* removeCoupon(params) {
  try {
    const response = yield call(() =>
      putRequest(`admin/coupon/delete`, params.payload)
    );
    if (response?.status < 400) {
      params?.callBackAction(response);
    }
    yield put({
      type: actions.REMOVE_COUPON_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Coupon removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_COUPON_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_COUPON_LIST, getcouponlist),
    takeEvery(actions.GET_COPON_BY_ID, getcouponById),
    takeEvery(actions.GENERATE_COUPON_CODE, generate_couponcode),
    takeEvery(actions.CREATE_NEW_COUPON, create_newcoupon),
    takeEvery(actions.GET_USERS_AGENCY_LIST, get_useragency_list),
    takeEvery(actions.REMOVE_COUPON, removeCoupon),
    // takeEvery(actions.GET_CAR_FILTER_MANAGEMENT_INFO, get_carmanagement_filterdata),
  ]);
}
