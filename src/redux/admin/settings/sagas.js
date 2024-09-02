import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import { getRequest, putRequest } from "./../../../helpers/axiosClient";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";
// import { history, store } from 'redux/store';
// import { message } from 'antd';

// export function* getwebconfig(params) {
//   try {
//     const { latitude, longitude } = params.payload;
//     const response = yield call(() =>
//       getRequest(`public/website/instant_sallon?status=1&latitude=${'11.129224'}&longitude=${'77.341568'}`),
//     );
//     yield put({
//       type: actions.GET_LOGIN_LISTING_SALOON_SUCCESS,
//       payload: response.data.data,
//     });
//   } catch (error) {
//     // message.error(error.response)
//     yield put({ type: actions.GET_LISTING_SALOON_FAILURE });
//   }
// }

// export function* loginListingSaloon(params) {
//   try {
//     const { latitude, longitude } = params.payload;
//     const response = yield call(() =>
//       getRequest(`user/vendor/getvendors?status=1&latitude=${latitude}&longitude=${longitude}`),
//     );
//     yield put({
//       type: actions.GET_LISTING_SALOON_SUCCESS,
//       payload: response.data.data,
//     });
//   } catch (error) {
//     // message.error(error.response)
//     yield put({ type: actions.GET_LOGIN_LISTING_SALOON_FAILURE });
//   }
// }

export function* getwebconfig() {
  try {
    const response = yield call(() => getRequest(`admin/appconfig/get`));
    yield put({
      type: actions.GET_WEB_SETTINGS_CONFIG_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_WEB_SETTINGS_CONFIG_FAILURE });
  }
}

export function* setwebconfig(params) {
  try {
    const response = yield call(() =>
      putRequest(`admin/appconfig/update`, params.payload)
    );
    yield put({
      type: actions.UPDATE_WEB_SETTINGS_CONFIG_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Web Settings updated successfully"));
  } catch (error) {
    yield put({ type: actions.UPDATE_WEB_SETTINGS_CONFIG_FAILURE });
  }
}

export function* getsocialmediaconfig() {
  try {
    const response = yield call(() => getRequest(`public/socialmedia/get`));
    if (response.data.data?.length > 0) {
      yield put({
        type: actions.GET_SOCIAL_MEDIA_SUCCESS,
        payload: response.data.data[0],
      });
    }
  } catch (error) {
    yield put({ type: actions.GET_SOCIAL_MEDIA_FAILURE });
  }
}

export function* setsocialmediaconfig(params) {
  try {
    const response = yield call(() =>
      putRequest(`common/socialmedia/update`, params.payload)
    );
    yield put({
      type: actions.UPDATE_SOCIAL_MEDIA_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("Social Media updated successfully"));
  } catch (error) {
    yield put({ type: actions.UPDATE_SOCIAL_MEDIA_FAILURE });
  }
}

// smtp
export function* getsmtpsettings() {
  try {
    const response = yield call(() => getRequest(`common/smtp/get`));
    yield put({
      type: actions.GET_SMTP_SETTINGS_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_SMTP_SETTINGS_FAILURE });
  }
}

export function* setsmtpsettings(params) {
  try {
    const response = yield call(() =>
      putRequest(`common/smtp/update`, params.payload)
    );
    yield put({
      type: actions.UPDATE_SMTP_SETTINGS_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("SMTP updated successfully"));
  } catch (error) {
    yield put({ type: actions.UPDATE_SMTP_SETTINGS_FAILURE });
  }
}

// sms
export function* getsmssettings() {
  try {
    const response = yield call(() => getRequest(`common/sms/get`));
    yield put({
      type: actions.GET_SMS_SETTINGS_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_SMS_SETTINGS_FAILURE });
  }
}

export function* setsmssettings(params) {
  try {
    const response = yield call(() =>
      putRequest(`common/sms/update`, params.payload)
    );
    yield put({
      type: actions.UPDATE_SMS_SETTINGS_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("SMS Settings updated successfully"));
  } catch (error) {
    yield put({ type: actions.UPDATE_SMS_SETTINGS_FAILURE });
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
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_USER_PROFILE_FAILURE });
  }
}

export function* updateUserProfile(params) {
  try {
    // const response = yield call(() =>
    //   putRequest(`user/user/changeinfo`, params.payload)
    // );
    // yield put({
    //   type: actions.UPDATE_USER_PROFILE_SUCCESS,
    //   payload: response.data.data[0],
    // });
    // message.success(getLocaleMessages("Profile updated"));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_USER_PROFILE_FAILURE });
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

export function* updateAdminProfile(params) {
  try {
    const response = yield call(() =>
      putRequest(`user/user/changeinfo`, params.payload)
    );
    yield put({
      type: actions.UPDATE_ADMIN_PROFILE_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("Admin profile updated"));
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_ADMIN_PROFILE_FAILURE });
  }
}

export function* updateAdminPassword(params) {
  try {
    const response = yield call(() =>
      putRequest(`admin/change/password`, params.payload)
    );
    yield put({
      type: actions.UPDATE_ADMIN_PASSWORD_SUCCESS,
      payload: response.data.data[0],
    });
    message.success(getLocaleMessages("Admin password has changed"));
  } catch (error) {
    yield put({ type: actions.UPDATE_ADMIN_PASSWORD_FALIURE });
  }
}

export function* getAdminProfile(params) {
  try {
    const response = yield call(() =>
      getRequest(`user/user/getuserbyid?id=${params.payload}&usertypeid=1`)
    );
    yield put({
      type: actions.GET_ADMIN_PROFILE_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_ADMIN_PROFILE_FAILURE });
  }
}

export function* getAgentProfile(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/agent/getone?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_AGENT_PROFILE_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_AGENT_PROFILE_FAILURE });
  }
}

export function* updateAgentPassword(params) {
  try {
    const response = yield call(() =>
      putRequest(`agent/agent/changepassword`, params.payload)
    );
    yield put({
      type: actions.UPDATE_AGENT_PASSWORD_SUCCESS,
    });
    message.success(getLocaleMessages("Password has been changed"));
  } catch (error) {
    yield put({ type: actions.UPDATE_AGENT_PASSWORD_FALIURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_WEB_SETTINGS_CONFIG, getwebconfig),
    takeEvery(actions.UPDATE_WEB_SETTINGS_CONFIG, setwebconfig),
    takeEvery(actions.GET_SOCIAL_MEDIA, getsocialmediaconfig),
    takeEvery(actions.UPDATE_SOCIAL_MEDIA, setsocialmediaconfig),

    takeEvery(actions.GET_SMTP_SETTINGS, getsmtpsettings),
    takeEvery(actions.UPDATE_SMTP_SETTINGS, setsmtpsettings),

    takeEvery(actions.GET_SMS_SETTINGS, getsmssettings),
    takeEvery(actions.UPDATE_SMS_SETTINGS, setsmssettings),

    takeEvery(actions.GET_USER_PROFILE, getUserProfile),
    takeEvery(actions.UPDATE_USER_PROFILE, updateUserProfile),
    takeEvery(actions.UPDATE_USER_PASSWORD, updateUserPassword),

    takeEvery(actions.GET_ADMIN_PROFILE, getAdminProfile),
    takeEvery(actions.UPDATE_ADMIN_PROFILE, updateAdminProfile),
    takeEvery(actions.UPDATE_ADMIN_PASSWORD, updateAdminPassword),

    takeEvery(actions.GET_AGENT_PROFILE, getAgentProfile),
    takeEvery(actions.UPDATE_AGENT_PASSWORD, updateAgentPassword),
  ]);
}
