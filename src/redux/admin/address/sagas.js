import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
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
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* get_areamanagement(params) {
  try {
    const response = yield call(() =>
      getRequest("admin/addressarea/getAll", params.payload)
    );
    yield put({
      type: actions.GET_AREA_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AREA_MANAGEMENT_FAILURE });
  }
}

export function* areamanagement_iud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/addressarea/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/addressarea/update", params.payload)
      );
    }
    yield put({
      type: actions.AREA_MANAGEMENT_IUD_SUCCESS,
      payload: response.data.data,
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("Area created successfully"))
      : message.success(getLocaleMessages("Area updated successfully"));
  } catch (error) {
    message.error(error);
    yield put({ type: actions.AREA_MANAGEMENT_IUD_FAILURE });
  }
}

export function* change_areamanagement_status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/addressarea/status", params.payload)
    );
    yield put({
      type: actions.CHANGE_AREA_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Area status changed successfully"));
  } catch (error) {
    yield put({ type: actions.CHANGE_AREA_MANAGEMENT_FAILURE });
  }
}

export function* remove_areamanagement_details(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/addressarea/delete", params.payload)
    );
    yield put({
      type: actions.REMOVE_AREA_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Area removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_AREA_MANAGEMENT_FAILURE });
  }
}

export function* get_citymanagement(params) {
  try {
    const response = yield call(() => getRequest("admin/addresscity/getAll"));
    yield put({
      type: actions.GET_CITY_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CITY_MANAGEMENT_FAILURE });
  }
}

export function* change_citymanagement_status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/addresscity/status", params.payload)
    );
    yield put({
      type: actions.CHANGE_CITY_MANAGEMENT_STATUS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("City status has been changed"));
  } catch (error) {
    yield put({ type: actions.CHANGE_CITY_MANAGEMENT_STATUS_FAILURE });
  }
}

export function* change_cityDashboard_Status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/addresscity/dashboardstatus", params.payload)
    );
    yield put({
      type: actions.CHANGE_CITY_MANAGEMENT_DASHBOARD_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("City status has been changed"));
  } catch (error) {
    yield put({ type: actions.CHANGE_CITY_MANAGEMENT_DASHBOARD_FAILURE });
  }
}

export function* remove_citymanagement_details(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/addresscity/delete", params.payload)
    );
    if (response?.status < 400) {
      yield put({
        type: actions.REMOVE_CITY_MANAGEMENT_SUCCESS,
        payload: response.data.data,
      });
      message.success(getLocaleMessages("City has been remove successfully"));
      params?.callBackAction();
    }
  } catch (error) {
    yield put({ type: actions.REMOVE_CITY_MANAGEMENT_FAILURE });
  }
}
export function* citymanagement_iud(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/addresscity/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/addresscity/update", params.payload)
      );
    }
    yield put({
      type: actions.CITY_MANAGEMENT_IUD_SUCCESS,
      payload: response.data.data,
    });
    params.payload.action == "I"
      ? message.success(getLocaleMessages("City created successfully"))
      : message.success(getLocaleMessages("City updated successfully"));
  } catch (error) {
    message.error(error?.message);
    yield put({ type: actions.CITY_MANAGEMENT_IUD_FAILURE });
  }
}
export function* addresstypemanagement_IUD(params) {
  try {
    var response;
    if (params.payload.action == "I") {
      response = yield call(() =>
        postRequest("admin/addresstype/create", params.payload)
      );
    } else {
      response = yield call(() =>
        putRequest("admin/addresstype/update", params.payload)
      );
    }
    yield put({
      type: actions.ADDRESSTYPE_MANAGEMENT_IUD_SUCCESS,
      payload: response.data.data,
    });
    params.payload.action == "I"
      ? message.success(
          getLocaleMessages("New address type created successfully")
        )
      : message.success(
          getLocaleMessages("Address type has been updated successfully")
        );
    history.push("/admin/addresstype");
  } catch (error) {
    yield put({ type: actions.ADDRESSTYPE_MANAGEMENT_IUD_FAILURE });
  }
}

export function* get_addresstypemanagement() {
  try {
    const response = yield call(() => getRequest("admin/addresstype/getAll"));
    yield put({
      type: actions.GET_ADDRESSTYPE_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ADDRESSTYPE_MANAGEMENT_FAILURE });
  }
}

export function* get_addresstype_byid(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/addresstype/getById", params.payload)
    );
    yield put({
      type: actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID_SUCCESS,
      payload: response.data.data[0],
    });
  } catch (error) {
    yield put({ type: actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID_FAILURE });
  }
}

export function* change_addresstypemanagement_status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/addresstype/status", params.payload)
    );
    yield put({
      type: actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Address type status changed"));
  } catch (error) {
    yield put({ type: actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS_FAILURE });
  }
}

export function* remove_addresstypemanagement_details(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/addresstype/delete", params.payload)
    );
    yield put({
      type: actions.REMOVE_ADDRESSTYPE_MANAGEMENT_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Request type has been removed"));
  } catch (error) {
    yield put({ type: actions.REMOVE_ADDRESSTYPE_MANAGEMENT_FAILURE });
  }
}
export function* get_countrylist() {
  try {
    const response = yield call(() => getRequest("admin/country/getAll"));
    yield put({
      type: actions.GET_COUNTRY_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_COUNTRY_LIST_FAILURE });
  }
}

export function* get_currencylist() {
  try {
    const response = yield call(() => getRequest("admin/currency/getAll"));
    yield put({
      type: actions.GET_CURRENCY_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CURRENCY_LIST_FAILURE });
  }
}

export function* change_currency_status(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/currency/status", params.payload)
    );
    yield put({
      type: actions.CHANGE_CURRENCY_STATUS_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Currency status has been changed"));
  } catch (error) {
    yield put({ type: actions.CHANGE_CURRENCY_STATUS_FAILURE });
  }
}

export function* update_currency(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/currency/update", params.payload)
    );
    yield put({
      type: actions.UPDATE_CURRENCY_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Currency has been updated."));
  } catch (error) {
    yield put({ type: actions.UPDATE_CURRENCY_FAILURE });
  }
}

export function* get_currencyconversionlist() {
  try {
    const response = yield call(() => getRequest("admin/currency/conversions/getAll"));
    yield put({
      type: actions.GET_CURRENCY_CONVERSION_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CURRENCY_CONVERSION_LIST_FAILURE });
  }
}

export function* country_iud(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/country/create", params.payload)
    );
    if (response?.status < 400) {
      message.success(getLocaleMessages("Country created successfully"));
      yield put({
        type: actions.CREATE_NEW_COUNTRY_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.CREATE_NEW_COUNTRY_FAILURE });
  }
}

export function* create_currency(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/currency/create", params.payload)
    );
    if (response?.status < 400) {
      message.success(getLocaleMessages("Currency created successfully"));
      yield put({
        type: actions.CREATE_NEW_CURRENCY_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.CREATE_NEW_CURRENCY_FAILURE });
  }
}
export function* create_currency_conversion(params) {
  try {
    const response = yield call(() =>
      postRequest("admin/currency/conversions/create", params.payload)
    );
    if (response?.status < 400) {
      message.success(getLocaleMessages("Currency Conversion created successfully"));
      yield put({
        type: actions.CREATE_NEW_CURRENCY_CONVERSION_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.CREATE_NEW_CURRENCY_CONVERSION_FAILURE });
  }
}
export function* update_currency_conversion(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/currency/conversions/update", params.payload)
    );
    if (response?.status < 400) {
      message.success(getLocaleMessages("Currency Conversion updated successfully"));
      yield put({
        type: actions.UPDATE_CURRENCY_CONVERSION_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.UPDATE_CURRENCY_CONVERSION_FAILURE });
  }
}
export function* country_edit(params) {
  try {
    const response = yield call(() =>
      putRequest("admin/country/update", params.payload)
    );
    if (response?.status < 400) {
      message.success(getLocaleMessages("Country Updated successfully"));
      yield put({
        type: actions.CREATE_NEW_COUNTRY_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.CREATE_NEW_COUNTRY_FAILURE });
  }
}

export function* country_delete(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/country/delete?id=${Number(params.payload.id)}`)
    );
    if (response?.status < 400) {
      params?.callBackAction(response);
      message.success(getLocaleMessages("Country deleted successfully"));
    }
    // yield put({
    //   type: actions.CREATE_NEW_COUNTRY_SUCCESS,
    //   payload: response.data.data,
    // });
  } catch (error) {
    yield put({ type: actions.CREATE_NEW_COUNTRY_FAILURE });
    message.error(error?.message);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AREA_MANAGEMENT, get_areamanagement),
    takeEvery(actions.AREA_MANAGEMENT_IUD, areamanagement_iud),
    takeEvery(actions.CHANGE_AREA_MANAGEMENT, change_areamanagement_status),
    takeEvery(actions.REMOVE_AREA_MANAGEMENT, remove_areamanagement_details),

    takeEvery(actions.CITY_MANAGEMENT_IUD, citymanagement_iud),
    takeEvery(actions.GET_CITY_MANAGEMENT, get_citymanagement),
    takeEvery(
      actions.CHANGE_CITY_MANAGEMENT_STATUS,
      change_citymanagement_status
    ),
    takeEvery(
      actions.CHANGE_CITY_MANAGEMENT_DASHBOARD,
      change_cityDashboard_Status
    ),
    takeEvery(actions.REMOVE_CITY_MANAGEMENT, remove_citymanagement_details),

    takeEvery(actions.ADDRESSTYPE_MANAGEMENT_IUD, addresstypemanagement_IUD),
    takeEvery(
      actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID,
      get_addresstype_byid
    ),
    takeEvery(actions.GET_ADDRESSTYPE_MANAGEMENT, get_addresstypemanagement),
    takeEvery(
      actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS,
      change_addresstypemanagement_status
    ),
    takeEvery(
      actions.REMOVE_ADDRESSTYPE_MANAGEMENT,
      remove_addresstypemanagement_details
    ),

    takeEvery(actions.GET_COUNTRY_LIST, get_countrylist),
    takeEvery(actions.GET_CURRENCY_LIST, get_currencylist),
    takeEvery(actions.GET_CURRENCY_CONVERSION_LIST, get_currencyconversionlist),

    takeEvery(actions.CREATE_NEW_COUNTRY, country_iud),
    takeEvery(actions.UPDATE_CURRENCY, update_currency),
    takeEvery(actions.CREATE_NEW_CURRENCY, create_currency),
    takeEvery(actions.CHANGE_CURRENCY_STATUS, change_currency_status),

    takeEvery(actions.CREATE_NEW_CURRENCY_CONVERSION, create_currency_conversion),
    takeEvery(actions.UPDATE_CURRENCY_CONVERSION, update_currency_conversion),

    takeEvery(actions.UPDATE_COUNTRY, country_edit),
    takeEvery(actions.DELETE_COUNTRY, country_delete),
  ]);
}
