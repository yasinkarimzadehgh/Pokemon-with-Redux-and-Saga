import { takeLatest, put, call } from 'redux-saga/effects';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE,

} from './userAction';
import axios from 'axios';

function* userLoginSaga(action) {
    try {
        const response = yield call(axios.get, action.payload);
        const data = response.data;
        document.documentElement.setAttribute("data-theme", data.theme);
        document.body.setAttribute("data-theme", data.theme);
        yield put({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (err) {
        console.error("Error fetching ability details:", err);
        yield put({ type: USER_LOGIN_FAILURE, payload: err });
    }
}
function* userUpdateSaga(action) {
    try {
        const { payload } = action;
        const response = yield call(
            axios.post,
            "http://192.99.8.135/pokemon_api.php?route=set_info&user_id=17",
            payload
        );
        const theme = payload.get("theme");
        document.documentElement.setAttribute("data-theme", theme);
        document.body.setAttribute("data-theme", theme);
        yield put({ type: USER_UPDATE_SUCCESS, payload: response.data });
        localStorage.setItem("userData", JSON.stringify(response.data));
        console.log("UserData saved to localStorage:", response.data);
    } catch (error) {
        console.error("Error submitting form:", error);
        yield put({ type: USER_UPDATE_FAILURE, payload: error.message });
    }
}


export function* watchUserSaga() {
    yield takeLatest(USER_LOGIN_REQUEST, userLoginSaga);
    yield takeLatest(USER_UPDATE_REQUEST, userUpdateSaga);
}

