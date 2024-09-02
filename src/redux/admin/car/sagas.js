import { all, put, call, takeEvery } from "redux-saga/effects";
import { history } from "redux/store";
import { useHistory } from "react-router-dom";
import actions from "./actions";
import {
  getRequest,
  putRequest,
  postRequest,
  deleteRequest,
} from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import { get } from "lodash";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* getcarinformation(params) {
  try {
    const response = yield call(() => getRequest(`public/car/specification`));
    yield put({
      type: actions.GET_CAR_INFO_SUCCESS,
      payload: response.data.data,
    });
    params.callBackAction(response);
  } catch (error) {
    //params.callBackAction(error);
    yield put({ type: actions.GET_CAR_INFO_FAILURE });
  }
}

export function* getagencyinformation() {
  try {
    const response = yield call(() => getRequest(`admin/agent/getApprovedAll`));
    yield put({
      type: actions.GET_AGENCY_INFO_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AGENCY_INFO_FAILURE });
  }
}
export function* get_carinformation_byid(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/car/get_carbyid", { carid: params.payload })
    );
    yield put({
      type: actions.GET_CAR_INFO_BYCARID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CAR_INFO_BYCARID_FAILURE });
  }
}
export function* get_carmanagement_data(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/car/carmanagement", { status: params.payload })
    );
    yield put({
      type: actions.GET_CAR_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    message.error(error.response.data.message);
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
    yield put({ type: actions.GET_CAR_MANAGEMENT_FAILURE });
  }
}

export function* get_carmanagement_filterdata(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/car/carmanagement_filter", params.payload)
    );
    yield put({
      type: actions.GET_CAR_FILTER_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CAR_FILTER_MANAGEMENT_FAILURE });
  }
}

export function* remove_carinformation_byid(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/car/remove?id=${params.payload}`)
    );
    if (response.status < 400) {
      yield put({
        type: actions.GET_CAR_MANAGEMENT_INFO,
        payload: true,
      });
      yield put({
        type: actions.REMOVE_CAR_BYID_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_CAR_BYID_FAILURE });
  }
}

export function* setCarStatus(params) {
  try {
    const response = yield call(() =>
      putRequest(`admin/car/setcarstatus`, params.payload)
    );
    yield put({
      type: actions.SET_PUBLISH_STATUS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.SET_PUBLISH_STATUS_FAILURE });
  }
}

export function* carinformationIUD(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/car/create", params.payload)
      );
    } else {
      response = yield call(() =>
        postRequest("admin/car/update", params.payload)
      );
    }
    if (response?.status < 400) {
      yield put({
        type: actions.CAR_INFORMATION_IUD_SUCCESS,
        payload: response.data.data,
      });
      yield get({
        type: actions?.GET_CAR_INFO,
        payload: false,
      });
      params.payload.action == "I"
        ? message.success(getLocaleMessages("New Car created successfully"))
        : message.success(
            getLocaleMessages("Car information updated successfully")
          );
      getLocalDataType() == "admin"
        ? history.push("/admin/cars")
        : history.push("/agency/cars");
      params.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.CAR_INFORMATION_IUD_FAILURE });
  }
}

export function* carbrandiud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/car/brand/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/car/brand/update", params.payload)
      );
    }
    if (response?.status < 400) {
      yield put({
        type: actions.BRAND_MANAGEMENT_IUD_SUCCESS,
        payload: response.data.data,
      });
      params.payload.action == "I"
        ? message.success(getLocaleMessages("New brand created successfully"))
        : message.success(
            getLocaleMessages("Selected brand has updated successfully")
          );
    }
  } catch (error) {
    yield put({ type: actions.BRAND_MANAGEMENT_IUD_FAILURE });
  }
}

export function* removebrand(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/car/brand/remove?id=${params.payload}`)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_CAR_BRAND_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("Selected brand has been removed."));
      params?.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_CAR_BRAND_FAILURE });
  }
}

export function* getbrandinfo() {
  try {
    const response = yield call(() => getRequest(`admin/car/brand/get`));
    yield put({
      type: actions.GET_BRAND_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_BRAND_MANAGEMENT_FAILURE });
  }
}

// CAR TYPE MANAGEMENT
export function* cartypeiud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/car/type/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/car/type/update", params.payload)
      );
    }
    yield put({
      type: actions.CARTYPE_MANAGEMENT_IUD_SUCCESS,
      payload: response.data.data,
    });

    params.payload.action == "I"
      ? message.success(getLocaleMessages("New type created successfully"))
      : message.success(
          getLocaleMessages("Selected type has updated successfully")
        );
  } catch (error) {
    yield put({ type: actions.CARTYPE_MANAGEMENT_IUD_FAILURE });
  }
}

export function* removetype(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/car/type/remove?id=${params.payload}`)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_CAR_TYPE_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("Selected type has been removed"));
      params.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_CAR_TYPE_FAILURE });
  }
}

export function* gettypeinfo() {
  try {
    const response = yield call(() => getRequest(`admin/car/type/get`));
    yield put({
      type: actions.GET_CARTYPE_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CARTYPE_MANAGEMENT_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CAR_INFO, getcarinformation),
    takeEvery(actions.GET_AGENCY_INFO, getagencyinformation),
    takeEvery(actions.GET_CAR_INFO_BYCARID, get_carinformation_byid),
    takeEvery(actions.CAR_INFORMATION_IUD, carinformationIUD),
    takeEvery(actions.GET_CAR_MANAGEMENT_INFO, get_carmanagement_data),
    takeEvery(
      actions.GET_CAR_FILTER_MANAGEMENT_INFO,
      get_carmanagement_filterdata
    ),
    takeEvery(actions.REMOVE_CAR_BYID, remove_carinformation_byid),

    takeEvery(actions.SET_PUBLISH_STATUS, setCarStatus), // Published / Unpublished

    takeEvery(actions.BRAND_MANAGEMENT_IUD, carbrandiud),
    takeEvery(actions.REMOVE_CAR_BRAND, removebrand),
    takeEvery(actions.GET_BRAND_MANAGEMENT, getbrandinfo),

    takeEvery(actions.CARTYPE_MANAGEMENT_IUD, cartypeiud),
    takeEvery(actions.REMOVE_CAR_TYPE, removetype),
    takeEvery(actions.GET_CARTYPE_MANAGEMENT, gettypeinfo),
  ]);
}
