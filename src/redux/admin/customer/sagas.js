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
import { getLocaleMessages } from "redux/helper";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* GetCustomerList(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/customer/getAll?status=${params.payload}`)
    );
    yield put({
      type: actions.GET_CUSTOMER_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CUSTOMER_LIST_FAILURE });
  }
}

export function* GetCardList(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/customer/getCardList?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_CARD_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CARD_LIST_FAILURE });
  }
}

export function* SetCustomerStatuByID(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/customer/status", params.payload)
    );
    yield put({
      type: actions.SET_CUSTOMER_STATUS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Customer status changed successfully"));
  } catch (error) {
    yield put({ type: actions.SET_CUSTOMER_STATUS_FAILURE });
  }
}

// export function* GetCarList() {
//     try {
//         const response = yield call(() =>
//             postRequest('admin/car/carmanagement', { carstatus: 1 }),
//         );
//         yield put({
//             type: actions.GET_DASHBOARD_CARLIST_SUCCESS,
//             payload: response.data.data
//         });
//     } catch (error) {
//         yield put({ type: actions.GET_DASHBOARD_CARLIST_FAILURE });
//     }
// }

export function* SetupNewCustomer(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/user/admin_user_create", { ...params.payload })
      );
    } else {
      response = yield call(() =>
        putRequest("admin/user/admin_user_update", { ...params.payload })
      );
    }
    if (response?.status < 400) {
      params.callBackAction();
    }
    yield put({
      type: actions.SETUP_NEW_CUSTOMER_SUCCESS,
      payload: response.data.data,
    });

    if (params.payload.action == "I") {
      message.success(getLocaleMessages("User has created successfully"));
    } else {
      message.success(getLocaleMessages("User has updated successfully"));
    }
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.SETUP_NEW_CUSTOMER_FAILURE });
  }
}

export function* RemoveCustomer(params) {
  try {
    const response = yield call(() =>
      deleteRequest(
        `admin/customer/delete?id=${params.payload.id}&type=${params.payload.type}`
      )
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_CUSTOMER_DETAILS_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("Customer removed successfully"));
      params?.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_CUSTOMER_DETAILS_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CUSTOMER_LIST, GetCustomerList),
    takeEvery(actions.GET_CARD_LIST, GetCardList),
    takeEvery(actions.SET_CUSTOMER_STATUS, SetCustomerStatuByID),
    takeEvery(actions.SETUP_NEW_CUSTOMER, SetupNewCustomer),
    takeEvery(actions.REMOVE_CUSTOMER_DETAILS, RemoveCustomer),
  ]);
}
