import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import { getRequest, patchRequest } from "helpers/axiosClient";

export function* ChangeCurrency(params) {
  console.log(params, "gsgfd");
  try {
    const response = yield call(() =>
      patchRequest(`change-preference?prefcurrency=${params.payload}`)
    );
    yield put({
      type: actions.CHANGE_CURRENCY_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.CHANGE_CURRENCY_FAILURE });
  }
}

export function* getAllCurrencies(params) {
  try {
    const response = yield call(() => getRequest("public/currencies/getAll"));
    if (response.status < 400) {
      yield put({
        type: actions.GET_CURRENCIES_LIST_SUCCESS,
        payload: response.data.data,
      });
    }
  } catch (error) {
    yield put({ type: actions.GET_CURRENCIES_LIST_FAILURE });
  }
}

export function* getCurrencyConversion(params) {
  try {
    const response = yield call(() => getRequest(`public/currencies/conversion?code=${params.payload.code}`));
    console.log('response.data.data[0].equalto--', response.data.data[0].equalto);
    if (response.status < 400) {
      yield put({
        type: actions.GET_CURRENCY_CONVERSION_SUCCESS,
        payload: response.data.data[0].equalto,
      });
    }
  } catch (error) {
    yield put({ type: actions.GET_CURRENCY_CONVERSION_FAILURE });
  }
}

export function* getCurrency(params) {
  try {
    const response = yield call(() =>
      getRequest(`get-preference?prefcurrency`)
    );
    if (response.status < 400) {
      params.callBackAction();
    }
    yield put({
      type: actions.GET_CURRENCY_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_CURRENCY_FAILURE });
  }
}
export default function* rootSaga() {
  yield all([
    // takeEvery(actions.CHANGE_CURRENCY, ChangeCurrency),
    takeEvery(actions.GET_CURRENCY, getCurrency),
    takeEvery(actions.GET_CURRENCIES_LIST, getAllCurrencies),
    takeEvery(actions.GET_CURRENCY_CONVERSION, getCurrencyConversion),
  ]);
}
