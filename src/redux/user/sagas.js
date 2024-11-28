import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import { getRequest, postRequest, putRequest } from "helpers/axiosClient";
import { history, store } from "redux/store";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";

export function* createCarReservation(params) {
  try {
    const response = yield call(() =>
      postRequest("user/booking/reservation", params.payload)
    );
    const result = response.data.data;
    if (response?.status < 400) {
      params.callBackAction(response);
      //window.location.href = result;

      yield put({
        type: actions.CREATE_CAR_RESERVATION_SUCCESS,
        payload: result.data,
      });
      history.push({
        pathname: "/confirmation",
        state: { id: result.data.bookingid, paymentStatus: 0 },
      });
    } else {
      yield put({ type: actions.CREATE_CAR_RESERVATION_FAILURE });
    }
  } catch (error) {
    yield put({ type: actions.CREATE_CAR_RESERVATION_FAILURE });
  }
}

export function* updateCarReservation(params) {
  try {
    const response = yield call(() =>
      putRequest("user/booking/confirmation", params.payload)
    );
    yield put({
      type: actions.UPDATE_CAR_RESERVATION_SUCCESS,
      // payload: result.data,
    });
    history.push({
      pathname: "/confirmation",
      state: { id: response.data.data, paymentStatus: 0 },
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_CAR_RESERVATION_FAILURE });
  }
}

export function* updateBookingInformation(params) {
  try {
    const response = yield call(() =>
      putRequest("user/booking/changes", params.payload)
    );
    yield put({
      type: actions.UPDATE_BOOKING_INFORMATION_SUCCESS,
      // payload: result.data,
    });
    if (response?.status < 400) {
      message.success(getLocaleMessages("Booking information udpated."));
      history.push("/admin/bookings");
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_CAR_RESERVATION_FAILURE });
  }
}

export function* updateUserBookingInformation(params) {
  try {
    const response = yield call(() =>
      putRequest("user/booking/userChanges", params.payload)
    );
    yield put({
      type: actions.UPDATE_USER_BOOKING_INFORMATION_SUCCESS,
      // payload: result.data,
    });
    if (response?.status < 400) {
      message.success(getLocaleMessages("Booking information udpated."));
      history.push("/user/bookings");
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_CAR_RESERVATION_FAILURE });
  }
}

export function* makeAdminPayment(params) {
  try {
    const response = yield call(() =>
      putRequest("user/booking/payment", params.payload)
    );
    yield put({
      type: actions.MAKE_ADMIN_PAYMENT_SUCCESS,
    });
    message.success(getLocaleMessages("Payment made successfully"));
  } catch (error) {
    message.error(error.response);
    yield put({ type: actions.MAKE_ADMIN_PAYMENT_FAILURE });
  }
}

export function* getReservationDetail(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/booking/getreservation?id=${params.payload}`)
    );
    const result = response.data.data;
    yield put({
      type: actions.GET_CAR_RESERVATION_BYID_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CAR_RESERVATION_BYID_FAILURE });
  }
}

export function* getPaymentOption(params) {
  try {
    const response = yield call(() =>
      getRequest("public/booking/getpayoption")
    );
    yield put({
      type: actions.GET_PAYMENT_OPTION_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_PAYMENT_OPTION_FAILURE });
  }
}

export function* getUserInfo(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/booking/getuserinfo?id=${params.payload.id}`)
    );
    yield put({
      type: actions.GET_USER_INFO_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_USER_INFO_FAILURE });
  }
}

export function* getBookingConfirmation(params) {
  try {
    const lang = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      getRequest(
        `user/booking/getbookinginfo?id=${params.payload.id}&lang=${lang}`
      )
    );
    yield put({
      type: actions.GET_BOOKING_CONFIRMATION_SUCCESS,
      payload: response.data.data[0],
      });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_BOOKING_CONFIRMATION_FAILURE });
  }
}

export function* getPaymentConfirmation(params) {
  try {
    const response = yield call(() =>
      postRequest("user/booking/paymentconfirmation", params.payload)
    );
    const result = response.data.data;
    if (response?.status < 400) {
      if (result.data?.length > 0) {
        if(result.data[0].paymentstatus == 1) {
          history.push({
            pathname: "/confirmation",
            state: { id: result.data[0].id, paymentStatus: 1 }
          });
        } else if(result.data[0].paymentstatus == 2) {
          message.warn(getLocaleMessages("Your payment has been failed! Please try again"));

          history.push({
            pathname: "bookingdetails",
            state: result.data[0].id,
          });
        } else if(result.data[0].paymentstatus == 3) {
          message.warn(getLocaleMessages("Your booking has been cancelled already"));

          history.push({
            pathname: "bookingdetails",
            state: result.data[0].id,
          });
        } else if(result.data[0].paymentstatus == 4) {
          message.warn(getLocaleMessages("Your booking has been cancelled already"));

          history.push({
            pathname: "bookingdetails",
            state: result.data[0].id,
          });
        } else {
          message.warn(getLocaleMessages("Invalid payment transaction. Please contact your agent"));

          history.push({
            pathname: "/booking",
            state: {},
          });
        }
      } else {
        message.warn(getLocaleMessages("Invalid payment transaction. Please contact your agent"));
        
        history.push({
          pathname: "/booking",
          state: {},
        });
      }
    } else {
      message.warn(getLocaleMessages("Your payment has been failed"));
        
      history.push({
        pathname: "/booking",
        state: {},
      });
    }
  } catch (error) {
    message.warn(getLocaleMessages("Your payment has been failed"));
        
    history.push({
      pathname: "/booking",
      state: {},
    });
  }
}

export function* getMyBookingInformation(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/booking/getmybookinginfo?id=${params.payload.id}`)
    );
    yield put({
      type: actions.GET_MYBOOKING_INFORMATION_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_MYBOOKING_INFORMATION_FAILURE });
  }
}

export function* getUserProfile(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/user/getuserbyid?id=${params.payload}&usertypeid=3`)
    );
    yield put({
      type: actions.GET_USER_PROFILE_SUCCESS,
      payload: response.data.data[0],
    });
    if (response.data.data?.length > 0) {
      localStorage.setItem(
        "user_data",
        JSON.stringify(response?.data?.data[0])
      );
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_USER_PROFILE_FAILURE });
  }
}

export function* getUserReviewList(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/user/getuserreview?id=${params.payload}&usertypeid=3`)
    );
    yield put({
      type: actions.GET_USER_REVIEW_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_USER_REVIEW_FALIURE });
  }
}

export function* updateUserProfile(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/user/changeinfo`, params.payload)
    );
    if (response?.status < 400) {
      params?.callBackAction(response);
    }
    if (response.data.data?.length > 0) {
      yield put({
        type: actions.UPDATE_USER_PROFILE_SUCCESS,
        payload: response.data.data[0],
      });
    }
    //message.success(getLocaleMessages("Profile updated"));
  } catch (error) {
    params?.callBackAction(error);
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.UPDATE_USER_PROFILE_FAILURE });
  }
}

export function* updateUserEmail(params) {
  try {
    const response = yield call(() =>
      postRequest(`user/user/changeemail`, params.payload)
    );
    if (response) {
      params?.callBackAction(response);
    }
  } catch (error) {
    yield put({ type: actions.UPDATE_USER_PROFILE_FAILURE });
    if (error) {
      params?.callBackAction(error);
    }
  }
}

export function* updateAgentPassword(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/user/changepassword`, params.payload)
    );
    yield put({
      type: actions.UPDATE_AGENCY_PASSWORD_SUCCESS,
    });
    message.success(getLocaleMessages("Password has been changed"));
  } catch (error) {
    yield put({ type: actions.UPDATE_AGENCY_PASSWORD_FALIURE });
  }
}

export function* updateUserPassword(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/user/changepassword`, params.payload)
    );
    yield put({
      type: actions.UPDATE_USER_PASSWORD_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("Password has been changed"));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_USER_PASSWORD_FALIURE });
  }
}

export function* cancelMyBooking(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/booking/booking_cancel`, {
        ...params.payload,
        usertype: 3,
      })
    );
    yield put({
      type: actions.CANCEL_BOOKING_SUCCESS,
      payload: response.data.data,
    });
    history.push({
      pathname: "/booking",
    });
    message.success(getLocaleMessages("Booking cancelled successfully"));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.CANCEL_BOOKING_FAILURE });
  }
}

export function* EditBookingRequest(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/booking/change_request`, {
        ...params.payload,
        usertype: 3,
      })
    );
    yield put({
      type: actions.EDIT_BOOKING_REQUEST_SUCCESS,
      payload: response.data.data,
    });
    history.push({
      pathname: "/booking",
    });
    message.success(
      getLocaleMessages("Booking change request sent successfully")
    );
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.EDIT_BOOKING_REQUEST_FAILURE });
  }
}

export function* GetBookingDetails(params) {
  try {
    const lang = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      getRequest(
        `common/booking/getbookingbyid?id=${params.payload}&lang=${lang}`
      )
    );
    yield put({
      type: actions.GET_BOOKING_INFOBYID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_BOOKING_INFOBYID_FAILURE });
  }
}

export function* setBookingTripStart(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/booking/tripstart", params.payload)
    );
    if (response?.data !== "") {
      yield put({
        type: actions.SET_BOOKING_START_SUCCESS,
        payload: response.data.data[0],
      });
    } else {
      yield put({
        type: actions.SET_BOOKING_START_FAILURE,
      });
    }
    message.success(getLocaleMessages("Trip started successfully."));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.SET_BOOKING_START_FAILURE });
  }
}

export function* uploadDropoffImages(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/booking/dropoffimages", params.payload)
    );
    yield put({
      type: actions.UPLOAD_DROPOFF_IMAGES_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Dropoff images updated successfully."));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPLOAD_DROPOFF_IMAGES_FAILURE });
  }
}

export function* uploadPickupImages(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/booking/pickupimages", params.payload)
    );
    yield put({
      type: actions.UPLOAD_PICKUP_IMAGES_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Pickup images updated successfully"));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPLOAD_PICKUP_IMAGES_FAILURE });
  }
}

export function* setBookingTripEnd(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/booking/tripend", params.payload)
    );
    if (response?.data !== "") {
      yield put({
        type: actions.SET_BOOKING_STOP_SUCCESS,
        payload: response.data.data[0],
      });
    }
    message.success(getLocaleMessages("Trip ended successfully."));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.SET_BOOKING_STOP_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_CAR_RESERVATION, createCarReservation),
    takeEvery(actions.UPDATE_CAR_RESERVATION, updateCarReservation),
    takeEvery(actions.GET_CAR_RESERVATION_BYID, getReservationDetail),
    takeEvery(actions.GET_PAYMENT_OPTION, getPaymentOption),
    takeEvery(actions.GET_USER_INFO, getUserInfo),
    takeEvery(actions.GET_BOOKING_CONFIRMATION, getBookingConfirmation),
    takeEvery(actions.GET_PAYMENT_CONFIRMATION, getPaymentConfirmation),
    takeEvery(actions.GET_MYBOOKING_INFORMATION, getMyBookingInformation),

    takeEvery(actions.GET_USER_PROFILE, getUserProfile),
    takeEvery(actions.UPDATE_USER_PROFILE, updateUserProfile),
    takeEvery(actions.UPDATE_USER_PASSWORD, updateUserPassword),
    takeEvery(actions.UPDATE_AGENCY_PASSWORD, updateAgentPassword),
    takeEvery(actions.GET_USER_REVIEW, getUserReviewList),

    takeEvery(actions.CANCEL_BOOKING, cancelMyBooking),
    takeEvery(actions.EDIT_BOOKING_REQUEST, EditBookingRequest),

    takeEvery(actions.GET_BOOKING_INFOBYID, GetBookingDetails),
    takeEvery(actions.UPDATE_BOOKING_INFORMATION, updateBookingInformation),
    takeEvery(actions.UPDATE_USER_BOOKING_INFORMATION, updateUserBookingInformation),
    takeEvery(actions.MAKE_ADMIN_PAYMENT, makeAdminPayment),

    takeEvery(actions.SET_BOOKING_START, setBookingTripStart),
    takeEvery(actions.SET_BOOKING_STOP, setBookingTripEnd),
    takeEvery(actions.UPLOAD_PICKUP_IMAGES, uploadPickupImages),
    takeEvery(actions.UPLOAD_DROPOFF_IMAGES, uploadDropoffImages),
    takeEvery(actions.UPDATE_USER_EMAIL, updateUserEmail),
  ]);
}
