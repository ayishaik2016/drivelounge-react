import { all, put, call, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import { getRequest } from "helpers/axiosClient";
import { history, store } from "redux/store";
// import { message } from 'antd';

export function* getCarModelList() {
  try {
    const response = yield call(() =>
      getRequest("public/car/get_cardisplayinfo")
    );
    yield put({
      type: actions.GET_CAR_MODEL_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CAR_MODEL_LIST_FAILURE });
  }
}

export function* getCarFullInforamtionList() {
  try {
    const response = yield call(() => getRequest("public/car/carfullinfo"));
    yield put({
      type: actions.GET_CARFULLINFORMATION_DISPLAY_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CARFULLINFORMATION_DISPLAY_FAILURE });
  }
}
export function* getFullSpecList(params) {
  try {
    const locale = store.getState().Auth.subLang == "en" ? 1 : 2;
    const response = yield call(() =>
      getRequest(`public/car/get_carfullinfo?Lang=${locale}`)
    );
    yield put({
      type: actions.GET_CAR_FULL_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CAR_FULL_LIST_FAILURE });
  }
}

export function* geCarInterriorList(params) {
  try {
    const response = yield call(() =>
      getRequest(`public/car/get_carinterrior?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_CAR_INTERIOR_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CAR_INTERIOR_LIST_FAILURE });
  }
}
export function* getCarReviewList(params) {
  try {
    const response = yield call(() =>
      getRequest(
        `public/car/get_carreview?id=${params.payload.carid}&agentid=${params.payload.agentid}`
      )
    );
    yield put({
      type: actions.GET_CAR_REVIEW_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CAR_REVIEW_LIST_FAILURE });
  }
}

export function* getBrandList() {
  try {
    const response = yield call(() => getRequest("public/car/get_brand"));
    yield put({
      type: actions.GET_CARBRAND_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CARBRAND_LIST_FAILURE });
  }
}

export function* getCarTypeList() {
  try {
    const response = yield call(() => getRequest("public/car/type/get"));
    yield put({
      type: actions.GET_CARTYPE_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CARTYPE_LIST_FAILURE });
  }
}

export function* getCarYearList() {
  try {
    const response = yield call(() => getRequest("public/car/year/get"));
    yield put({
      type: actions.GET_CARYEAR_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_CARYEAR_LIST_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CAR_MODEL_LIST, getCarModelList),
    takeEvery(actions.GET_CAR_FULL_LIST, getFullSpecList),
    takeEvery(actions.GET_CAR_INTERIOR_LIST, geCarInterriorList),
    takeEvery(actions.GET_CAR_REVIEW_LIST, getCarReviewList),
    takeEvery(actions.GET_CARBRAND_LIST, getBrandList),
    takeEvery(actions.GET_CARTYPE_LIST, getCarTypeList),
    takeEvery(actions.GET_CARYEAR_LIST, getCarYearList),
  ]);
}
