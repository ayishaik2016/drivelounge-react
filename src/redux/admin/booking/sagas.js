import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import { putRequest, postRequest } from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocalDataType, getLocaleMessages } from "redux/helper";

export function* get_booking_information(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/booking/booking", params.payload)
    );
    yield put({
      type: actions.GET_CARBOOKING_INFO_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    message.error(error.response.data.message);
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
    yield put({ type: actions.GET_CARBOOKING_INFO_FAILURE });
  }
}

export function* change_booking_status(params) {
  try {
    yield put({
      type: actions.CHANGE_BOOKING_STATUS_SUCCESS,
    });
    let usertype = 1;
    if (getLocalDataType() === "agency") {
      usertype = 2;
    } else if (getLocalDataType() === "user") {
      usertype = 3;
    }
    const response = yield call(() =>
      putRequest("admin/booking/booking_status", {
        ...params.payload,
        usertype,
      })
    );
    if (response?.status < 400) {
      yield put({
        type: actions.CHANGE_BOOKING_STATUS_SUCCESS,
      });
      message.success(getLocaleMessages("Booking status changed"));
      yield put({
        type: actions.CHANGE_BOOKING_STATUS_SUCCESS,
      });
    } else {
      message.error(getLocaleMessages("Booking status changed failed"));
    }

    let bookingUrl = '/agency/bookings';
    if(getLocalDataType() == 'admin') {
      bookingUrl = '/admin/bookings'
    } else if(getLocalDataType() == 'user') {
      bookingUrl = 'booking';
    }

    history.push(bookingUrl);
  } catch (error) {
    yield put({ type: actions.CHANGE_BOOKING_STATUS_FAILURE });
    message.error(getLocaleMessages("Booking status changed failed"));
    let bookingUrl = '/agency/bookings';
    if(getLocalDataType() == 'admin') {
      bookingUrl = '/admin/bookings'
    } else if(getLocalDataType() == 'user') {
      bookingUrl = 'booking';
    }
    history.push(bookingUrl);
    // message.error(error.message);
  }
}

export function* change_booking_payment(params) {
  try {
    yield put({
      type: actions.CHANGE_BOOKING_PAYMENT_SUCCESS,
    });

    const response = yield call(() =>
      postRequest("user/booking/booking_payment", params.payload)
    );
    
    const result = response.data.data;
    if (response?.status < 400) {
      if (result.data?.length > 0) {
        const paymenttransactionjson = JSON.parse(result.data[0].paymenttransactionjson);
        if(paymenttransactionjson) {
          let payId = paymenttransactionjson.payid;
          const targetUrl = paymenttransactionjson.targetUrl + '?paymentid=' + payId;

          window.location.href = targetUrl;
        } else {
          message.error('somethong went wrong! Please try again');
        }
      } else {
        message.error('somethong went wrong! Please try again');
      }
    }
  } catch (error) {
    yield put({ type: actions.CHANGE_BOOKING_PAYMENT_FAILURE });
    message.error(error.message);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CARBOOKING_INFO, get_booking_information),
    takeEvery(actions.CHANGE_BOOKING_STATUS, change_booking_status),
    takeEvery(actions.CHANGE_BOOKING_PAYMENT, change_booking_payment),
  ]);
}
