import { all, put, call, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import {
    getRequest
} from 'helpers/axiosClient';
// import { history, store } from 'redux/store';
// import { message } from 'antd';

export function* get_countrylist() {
    try {
        const response = yield call(() =>
            getRequest('public/country/getAll'),
        );
        yield put({
            type: actions.GET_COUNTRY_LIST_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        // message.error(error.response)
        yield put({ type: actions.GET_COUNTRY_LIST_FAILURE });
    }
}

export function* get_citylist() {
    try {
        const response = yield call(() =>
            getRequest('public/addresscity/getAll'),
        );
        yield put({
            type: actions.GET_CITY_LIST_SUCCESS,
            payload: response.data.data
        });
    } catch (error) {
        // message.error(error.response && error.response.data && error.response.data.message)
        yield put({ type: actions.GET_CITY_LIST_FAILURE });
    }
}

export function* get_brandlist() {
    try {
        const response = yield call(() =>
            getRequest('public/car/get_brand'),
        );
        yield put({
            type: actions.GET_BRAND_LIST_SUCCESS,
            payload: response.data.data
        });
    } catch (error) {
        // message.error(error.response && error.response.data && error.response.data.message)
        yield put({ type: actions.GET_BRAND_LIST_FAILURE });
    }
}

export function* get_cmslist(params){
    try{
        const response = yield call(()=>
            getRequest(`public/cms/getAll?languageid=${params.payload}`),
        )
        yield put({
            type: actions.GET_CMS_LIST_SUCCESS,
            payload: response.data.data
        })
    } catch(error) {
        yield put({ type:actions.GET_CMS_LIST_FAILURE })    
    }
}

export function* get_cmsdataList(params) {
    try {
        let response;
        if(params.payload.relatedpage) {
            response = yield call(() =>
                getRequest(`public/cms/getByRelatedPageLang?relatedpage=${params.payload.relatedpage}&lng=${params.payload.lng}`),
            );
        } else {
            response = yield call(() =>
                getRequest(`public/cms/getByIdLang?id=${params.payload.id}&lng=${params.payload.lng}`),
            );
        }
        
        yield put({
            type: actions.GET_CMS_DATA_LIST_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({ type: actions.GET_CMS_DATA_LIST_FAILURE });
    }
}

export function* get_faqdatalist(params) {
    try {
        const response = yield call(() =>
        getRequest(`public/faq/getlang?lang=${params.payload.id}`),
    );
    yield put({
        type: actions.GET_FAQ_DATA_LIST_SUCCESS,
        payload: response.data.data,
    });
    } catch (error) {
        yield put({ type: actions.GET_FAQ_DATA_LIST_FAILURE });
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.GET_COUNTRY_LIST, get_countrylist),
        takeEvery(actions.GET_CITY_LIST, get_citylist),
        takeEvery(actions.GET_BRAND_LIST, get_brandlist),
        takeEvery(actions.GET_CMS_LIST, get_cmslist),
        takeEvery(actions.GET_CMS_DATA_LIST, get_cmsdataList),
        takeEvery(actions.GET_FAQ_DATA_LIST, get_faqdatalist)
    ]);
}