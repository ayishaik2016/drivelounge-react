import { all, put, call, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import {
  getRequest
} from 'helpers/axiosClient';
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* layoutCategory() {
  try {
    const response = yield call(() =>
      getRequest('public/website/category_getall?status=1'),
    );
    yield put({
      type: actions.GET_LAYOUT_CATEGORIES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // message.error(error.response)
    yield put({ type: actions.GET_LAYOUT_CATEGORIES_FAILURE });
  }
}

export function* layoutSaloon() {
  try {
    const response = yield call(() =>
      getRequest('public/website/saloon_getall?status=1&isfeatured=1'),
    );
    yield put({
      type: actions.GET_LAYOUT_SALOON_SUCCESS,
      payload: response.data.data
    });
  } catch (error) {
    // message.error(error.response && error.response.data && error.response.data.message)
    yield put({ type: actions.GET_LAYOUT_SALOON_FAILURE });
  }
}

export function* layoutTopRating() {
  try {
    const response = yield call(() =>
      getRequest('public/website/toprating_getall?status=1&isfeatured=1'),
    );
    yield put({
      type: actions.GET_LAYOUT_TOP_RATING_SUCCESS,
      payload: response.data.data
    });
  } catch (error) {
    // message.error(error.response && error.response.data && error.response.data.message)
    yield put({ type: actions.GET_LAYOUT_SALOON_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_LAYOUT_TOP_RATING, layoutTopRating),
    takeEvery(actions.GET_LAYOUT_SALOON, layoutSaloon ),
    takeEvery(actions.GET_LAYOUT_CATEGORIES, layoutCategory),
  ]);
}
