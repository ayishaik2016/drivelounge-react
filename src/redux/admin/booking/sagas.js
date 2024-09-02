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
      history.push(
        getLocalDataType() === "agency" ? "/agency/bookings" : "/admin/bookings"
      );
    }

    // if(usertype == 2)
    //     history.push('/agnecy/bookings')
    // else if(usertype == 1)
    //     history.push('/admin/bookings')
    // else
    //     history.push("/booking")
  } catch (error) {
    yield put({ type: actions.CHANGE_BOOKING_STATUS_FAILURE });
    message.error(error.message);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CARBOOKING_INFO, get_booking_information),
    takeEvery(actions.CHANGE_BOOKING_STATUS, change_booking_status),
  ]);
}
