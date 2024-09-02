import { all, put, call, takeEvery, takeLatest } from "redux-saga/effects";
import { history } from "redux/store";
import actions from "./actions";
import {
  getRequest,
  deleteRequest,
  postRequest,
  putRequest,
} from "./../../../helpers/axiosClient";
// import { history, store } from 'redux/store';
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";

export function* GetAccessModules(params) {
  try {
    const response = yield call(() => getRequest(`admin/module/get`));
    yield put({
      type: actions.GET_ACCESS_MODULES_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ACCESS_MODULES_FAILURE });
  }
}

export function* GetRoleList(params) {
  try {
    const response = yield call(() => getRequest(`admin/role/getall`));
    yield put({
      type: actions.GET_ROLE_LIST_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_ROLE_LIST_FAILURE });
  }
}

export function* GetPermissionList(params) {
  try {
    const response = yield call(() =>
      getRequest(`admin/role/getpermission?id=${params.payload}`)
    );
    yield put({
      type: actions.GET_PERMISSION_BYID_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_PERMISSION_BYID_FAILURE });
  }
}

export function* RoleRightsIUD(params) {
  try {
    const { action, role, rights } = params.payload;
    yield call(() =>
      action == "I"
        ? postRequest("admin/role/create", { role, rights })
        : putRequest("admin/role/update", { role, rights })
    );
    yield put({
      type: actions.ROLE_RIGHTS_IUD_SUCCESS,
    });
    action == "I"
      ? message.success(getLocaleMessages("Role rights created successfully"))
      : message.success(getLocaleMessages("Role rights updated successfully"));
    history.push("/admin/role");
  } catch (error) {
    message.error(error);
    yield put({ type: actions.ROLE_RIGHTS_IUD_FAILURE });
  }
}

export function* RemoveUserRole(params) {
  try {
    const response = yield call(() =>
      deleteRequest(`admin/role/delete?id=${params.payload.id}`)
    );
    yield put({
      type: actions.REMOVE_USER_ROLE_SUCCESS,
      payload: response.data.data,
    });
    message.success(getLocaleMessages("Role has been removed successfully"));
  } catch (error) {
    yield put({ type: actions.REMOVE_USER_ROLE_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ACCESS_MODULES, GetAccessModules),
    takeEvery(actions.GET_ROLE_LIST, GetRoleList),
    takeEvery(actions.ROLE_RIGHTS_IUD, RoleRightsIUD),
    takeEvery(actions.GET_PERMISSION_BYID, GetPermissionList),
    takeEvery(actions.REMOVE_USER_ROLE, RemoveUserRole),
  ]);
}
