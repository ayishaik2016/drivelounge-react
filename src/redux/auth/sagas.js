import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "redux/auth/actions";
import dataaction from "redux/admin/users/actions";
import {
  deleteRequest,
  postRequest,
  putRequest,
  getRequest,
} from "helpers/axiosClient";
import { history, store } from "redux/store";
import {
  // handleException,
  getLocaleMessages,
  getLocalDataType,
  checkValid,
  getLocalData,
} from "redux/helper";
import { message } from "antd";
import { channelLogin, channelLogout } from "Auth";
const localLang = localStorage.getItem("language");

export function* userAuth(params) {
  try {
    const response = yield call(() =>
      postRequest("public/user/login", { ...params.payload })
    );
    localStorage.setItem("jwtToken", response.data.data);
    localStorage.setItem(
      "user_data",
      JSON.stringify(response.data.user_data[0])
    );
    localStorage.setItem("login_type", "user");
    localStorage.setItem(
      "language",
      localLang !== undefined && localLang !== null
        ? localLang
        : store.getState().Auth.subLang
    );
    params.callBackAction();
    yield put({
      type: actions.AUTHENTICATE_USER_SUCCESS,
    });
    message.success(getLocaleMessages("User Login Successfully"));
    channelLogin();
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.AUTHENTICATE_USER_FAILURE });
  }
}

export function* createAdminUser(params) {
  try {
    let response;
    const { action, data } = params.payload;
    if (action == "I") {
      response = yield call(() =>
        postRequest("public/user/admin_create", { ...data })
      );
    } else {
      response = yield call(() =>
        putRequest("public/user/admin_update", { ...data })
      );
    }
    store.dispatch({
      type: dataaction.GET_USERS_LIST_SUCCESS,
      payload: response.data.data,
    });
    yield put({
      type: actions.ADMIN_USER_IUD_SUCCESS,
    });

    action == "I"
      ? message.success(getLocaleMessages("User created Successfully"))
      : message.success(getLocaleMessages("User updated Successfully"));
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_USER_IUD_FAILURE });
  }
}

export function* createUserAuth(params) {
  try {
    const response = yield call(() =>
      postRequest("public/user/create", { ...params.payload })
    );
    yield put({
      type: actions.CREATE_AUTHENTICATE_USER_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.CREATE_AUTHENTICATE_USER_FAILURE });
  }
}

export function* createVendorAuth(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      postRequest("public/agency/create", {
        ...params.payload,
        subLang: locale,
      })
    );
    params.callBackAction(response);
    if (response?.status < 400) {
      yield put({
        type: actions.CREATE_AUTHENTICATE_VENDOR_SUCCESS,
        payload: params.payload.email,
      });
      history.push({ pathname: "/registerconfirmation" });
      message.success(
        getLocaleMessages("Agency application submitted successfully")
      );
    }
  } catch (error) {
    params.callBackAction({ status: 501 });
    message.error(
      error.response && error.response.data && getLocaleMessages(error.response.data.message)
    );
    yield put({ type: actions.CREATE_AUTHENTICATE_VENDOR_FAILURE });
  }
}
export function* verifyOTP(params) {
  try {
    const response = yield call(() =>
      putRequest("public/user/otp_verify", { ...params.payload })
    );
    yield put({
      type: actions.VERIFY_OTP_SUCCESS,
    });
    message.success(getLocaleMessages("OTP Verified"));
    if (response?.status < 400 && params.callBackAction() !== undefined) {
      params.callBackAction();
    }
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.VERIFY_OTP_FAILURE });
  }
}

export function* sendPasswordReset(params) {
  try {
    const { usertypeid } = params.payload;
    var response;
    if (usertypeid !== undefined && usertypeid == 3) {
      response = yield call(() =>
        putRequest("public/user/user_resetPassword", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("public/user/agent_resetPassword", params.payload)
      );
    }
    message.success(
      getLocaleMessages("Password reset link sent successfully.")
    );
    params.callBackAction();
    yield put({ type: actions.SEND_PASSWORD_RESET_LINK_SUCCESS });
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.SEND_PASSWORD_RESET_LINK_FAILURE });
  }
}

export function* logout() {
  try {
    const { isurl } = store.getState().Auth;
    let response = yield call(() => deleteRequest("common/logout"));
    if (response?.status < 400) {
      let url = "/";
      if (isurl === "/admin") {
        message.success(getLocaleMessages("Admin Logout Successfully."));
        url = "/admin/login";
      } else if (isurl === "/agency") {
        message.success(getLocaleMessages("Vendor Logout Successfully."));
        url = "/agency/login";
      } else if (isurl === "/") {
        message.success(getLocaleMessages("User Logout successfully"));
      }
      window.location.href = url;
      channelLogout();
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        "language",
        localLang !== null && localLang !== undefined ? localLang : "en"
      );
      localStorage.setItem("showmap", 0);
    }
  } catch (error) {
    yield put({ type: actions.LOGOUT_USER_FAILURE });
  }
}

export function* sendPasswordResetLinkAdmin(params) {
  try {
    yield call(() =>
      putRequest("public/auth/reset/admin_reset", params.payload)
    );
    message.success(getLocaleMessages("Admin Reset Password link sended."));
    yield put({ type: actions.ADMIN_SEND_PASSWORD_RESET_LINK_SUCCESS });
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_SEND_PASSWORD_RESET_LINK_FAILURE });
  }
}

export function* sendPasswordResetLinkVendor(params) {
  try {
    yield call(() =>
      putRequest("public/agency/forgetpassword", params.payload)
    );
    message.success(getLocaleMessages("Vendor Reset Password link sended."));
    yield put({ type: actions.VENDOR_SEND_PASSWORD_RESET_LINK_SUCCESS });
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.VENDOR_SEND_PASSWORD_RESET_LINK_FAILURE });
  }
}

export function* adminAuthOtp(params) {
  try {
      const response = yield call(() =>
        postRequest("public/loginOtp", { ...params.payload })
      );
      localStorage.setItem("jwtToken", response.data.data);
      localStorage.setItem(
        "user_data",
        JSON.stringify(response.data.user_data[0])
      );
      localStorage.setItem("login_type", "admin");
      localStorage.setItem(
        "language",
        localLang !== undefined && localLang !== null
          ? localLang
          : store.getState().Auth.subLang
      );
      yield put({
        type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
        payload: response.data.user_data[0],
      });
      yield put({
        type: actions.SET_USER_PERMISSION,
        payload: response.data.user_data[1],
      });

      message.success(getLocaleMessages("Admin Logged in Successfully"));
      history.push({ pathname: "/admin/dashboard" });
    } catch (error) {
      message.error(
        error.response && error.response.data && error.response.data.message
      );
      yield put({ type: actions.ADMIN_AUTHENTICATE_USER_FAILURE });
  }
}

export function* adminResendAuthOtp(params) {
  try {
    const response = yield call(() =>
      postRequest("public/loginOtpResend", { ...params.payload })
    );
    yield put({
	    type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_SUCCESS,
	    payload: [],
    });

    message.success(getLocaleMessages("OTP resent successfully."));
    params?.callBackAction(response);
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_FAILURE });
  }
}

export function* adminAuth(params) {
  try {
    const response = yield call(() =>
      postRequest("public/login", { ...params.payload })
    );

    message.success(getLocaleMessages("Admin Logged in Successfully. Please enter the OTP"));
    params?.callBackAction(response);
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_FAILURE });
  }
}

export function* vendorAuth(params) {
  try {
    const response = yield call(() =>
      postRequest("public/agency/login", { ...params.payload })
    );
    if (response.data.user_data[0].language.length > 0) {
      localStorage.setItem(
        "english_hotelDetails",
        JSON.stringify(
          response.data.user_data[0].language[0].languageid === 1
            ? response.data.user_data[0].language[0]
            : response.data.user_data[0].language[1]
        )
      );
      localStorage.setItem(
        "arabic_hotelDetails",
        JSON.stringify(
          response.data.user_data[0].language[0].languageid === 2
            ? response.data.user_data[0].language[0]
            : response.data.user_data[0].language[1]
        )
      );
    } else {
      localStorage.setItem("english_hotelDetails", "en");
      localStorage.setItem("arabic_hotelDetails", "ar");
    }
    localStorage.setItem("jwtToken", response.data.data);
    localStorage.setItem(
      "user_data",
      JSON.stringify(response.data.user_data[0])
    );
    localStorage.setItem("login_type", "agency");
    localStorage.setItem(
      "language",
      localLang !== undefined && localLang !== null
        ? localLang
        : store.getState().Auth.subLang
    );
    yield put({
      type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
      payload: response.data.user_data[0],
    });
    history.push({
      pathname: "/agency/dashboard",
    });
    message.success(getLocaleMessages("Vendor Login Successfully"));
  } catch (error) {
    message.error(
      error.response && error.response.data && getLocaleMessages(error.response.data.message)
    );
    yield put({ type: actions.VENDOR_AUTHENTICATE_USER_FAILURE });
  }
}

export function* vendorReset(params) {
  try {
    const key = history.location.pathname.split("/");
    const response = yield call(() =>
      postRequest("public/agency/reset", { ...params.payload, key: key[3] })
    );

    yield put({
      type: actions.VENDOR_RESET_PASSWORD_SUCCESS,
    });
    history.push({
      pathname: "/agency/login",
    });
    message.success(getLocaleMessages("Vendor Password Reset Successfully"));
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
  }
}

export function* userReset(params) {
  try {
    const key = history.location.pathname.split("/");
    const response = yield call(() =>
      postRequest("public/user/reset", { ...params.payload, key: key[2] })
    );

    yield put({
      type: actions.USER_RESET_PASSWORD_SUCCESS,
    });
    message.success(getLocaleMessages("Password changed Successfully"));
    history.push("/");
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
  }
}

export function* adminProfile(params) {
  try {
    const response = yield call(() =>
      putRequest("common/admin_profile", { ...params.payload })
    );
    yield put({
      type: actions.ADMIN_EDIT_PROFILE_SUCCESS,
    });
    message.success(getLocaleMessages("Admin profile edited successfully"));
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_EDIT_PROFILE_FAILURE });
  }
}

export function* adminPassword(params) {
  try {
    const response = yield call(() =>
      putRequest("common/admin/change/password", {
        id: getLocalData("id"),
        ...params.payload,
      })
    );
    yield put({
      type: actions.ADMIN_CHANGE_PASSWORD_SUCCESS,
    });
    message.success(getLocaleMessages("Admin Password Successfully"));
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.ADMIN_CHANGE_PASSWORD_FAILURE });
  }
}

export function* validateAuthToken() {
  try {
    if (
      !history.location.pathname.startsWith("/admin") &&
      !history.location.pathname.startsWith("/agency")
    ) {
      if (checkValid()) {
        let data = JSON.parse(localStorage.getItem("user_data"));
        if (getLocalDataType() === "agency") {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: data,
          });
          history.push("/agency/dashboard");
        } else if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: data,
          });
          history.push("/admin/dashboard");
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: data,
          });
        }
      } else {
        yield put({
          type: actions.AUTHENTICATE_USER_FAILURE,
        });
        // history.push('/')
      }
    } else if (
      ["/", "/listing", "/reservation", "/terms-of-use", "/contactus"].includes(
        history.location.pathname
      ) &&
      !history.location.pathname.startsWith("/admin") &&
      !history.location.pathname.startsWith("/agency")
    ) {
      if (checkValid()) {
        if (getLocalDataType() === "agency") {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
        } else if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
        }
      } else {
        yield put({
          type: actions.AUTHENTICATE_USER_FAILURE,
        });
      }
    } else if (
      history.location.pathname === "/admin" ||
      history.location.pathname === "/admin/login"
    ) {
      if (checkValid()) {
        if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/admin/dashboard");
        } else if (getLocalDataType() === "agency") {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/agency/dashboard");
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/");
        }
      } else if (
        !checkValid() &&
        history.location.pathname !== "/admin/login"
      ) {
        yield put({
          type: actions.ADMIN_AUTHENTICATE_USER_FAILURE,
        });
        history.push("/admin/login");
      } else if (
        !checkValid() &&
        history.location.pathname === "/admin/login"
      ) {
        yield put({
          type: actions.ADMIN_AUTHENTICATE_USER_FAILURE,
        });
      }
    } else if (
      history.location.pathname !== "/admin/login" &&
      history.location.pathname !== "/admin" &&
      history.location.pathname.startsWith("/admin/")
    ) {
      if (checkValid()) {
        if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
        } else if (getLocalDataType() === "agency") {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/agency/dashboard");
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/");
        }
      } else {
        yield put({
          type: actions.ADMIN_AUTHENTICATE_USER_FAILURE,
        });
        history.push("/admin/login");
      }
    } else if (
      history.location.pathname.startsWith("/agency/") ||
      history.location.pathname === "/agency/login"
    ) {
      if (checkValid()) {
        if (getLocalDataType() === "agency") {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          //history.push("/agency/dashboard");
        } else if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/admin/dashboard");
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/");
        }
      } else if (
        !checkValid() &&
        history.location.pathname !== "/agency/login"
      ) {
        yield put({
          type: actions.VENDOR_AUTHENTICATE_USER_FAILURE,
        });
        history.push("/agency/login");
      } else if (
        !checkValid() &&
        history.location.pathname === "/agency/login"
      ) {
        yield put({
          type: actions.VENDOR_AUTHENTICATE_USER_FAILURE,
        });
      }
    } else if (
      history.location.pathname !== "/agency/login" &&
      history.location.pathname !== "/agency" &&
      history.location.pathname.startsWith("/agency/")
    ) {
      if (checkValid()) {
        if (
          getLocalDataType() === "agency" &&
          !history.location.pathname.startsWith("/agency/reset/")
        ) {
          yield put({
            type: actions.VENDOR_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/agency/dashboard");
        } else if (getLocalDataType() === "admin") {
          yield put({
            type: actions.ADMIN_AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/admin/dashboard");
        } else if (getLocalDataType() === "user") {
          yield put({
            type: actions.AUTHENTICATE_USER_SUCCESS,
            payload: JSON.parse(localStorage.getItem("user_data")),
          });
          history.push("/");
        }
      } else {
        yield put({
          type: actions.VENDOR_AUTHENTICATE_USER_FAILURE,
        });
        history.push("/agency/login");
      }
    } else {
      yield put({
        type: actions.ADMIN_AUTHENTICATE_USER_FAILURE,
      });
    }
  } catch (error) {
    yield put({ type: actions.AUTHENTICATE_USER_FAILURE });
  }
}

export function* getUserRolesRights(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/role/getrolerights?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_USER_ROLERIGHTS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    message.error(
      error.response && error.response.data && error.response.data.message
    );
    yield put({ type: actions.GET_USER_ROLERIGHTS_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.ADMIN_AUTHENTICATE_USER, adminAuth),
    takeEvery(actions.ADMIN_AUTHENTICATE_USER_PRE_OTP, adminAuthOtp),
    takeEvery(actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND, adminResendAuthOtp),
    takeEvery(actions.VENDOR_AUTHENTICATE_USER, vendorAuth),
    takeEvery(actions.VENDOR_RESET_PASSWORD, vendorReset),
    takeEvery(actions.USER_RESET_PASSWORD, userReset),
    takeEvery(actions.AUTHENTICATE_USER, userAuth),
    takeEvery(actions.LOGOUT_USER, logout),
    takeEvery(actions.VALIDATE_AUTH_TOKEN, validateAuthToken),
    takeEvery(
      actions.ADMIN_SEND_PASSWORD_RESET_LINK,
      sendPasswordResetLinkAdmin
    ),
    takeEvery(
      actions.VENDOR_SEND_PASSWORD_RESET_LINK,
      sendPasswordResetLinkVendor
    ),
    takeEvery(actions.ADMIN_EDIT_PROFILE, adminProfile),
    takeEvery(actions.ADMIN_CHANGE_PASSWORD, adminPassword),
    takeEvery(actions.ADMIN_USER_IUD, createAdminUser),
    takeEvery(actions.CREATE_AUTHENTICATE_USER, createUserAuth),
    takeEvery(actions.CREATE_AUTHENTICATE_VENDOR, createVendorAuth),
    takeEvery(actions.VERIFY_OTP, verifyOTP),
    takeEvery(actions.SEND_PASSWORD_RESET_LINK, sendPasswordReset),
    takeEvery(actions.GET_USER_ROLERIGHTS, getUserRolesRights),
  ]);
}
