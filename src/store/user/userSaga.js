import { takeLatest, put, call, fork, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE,
} from './userAction';
import axios from 'axios';
import { getCookieValue } from '../../utils/helper.js';

export function* watchUserSaga() {
    yield takeLatest(USER_LOGIN_REQUEST, userLoginSaga);
    yield takeLatest(USER_UPDATE_REQUEST, userUpdateSaga);
    yield takeLatest([USER_LOGIN_SUCCESS, USER_UPDATE_SUCCESS], handleThemeUpdate);
    yield fork(watchStorageSaga);
}

function* handleThemeUpdate(action) {
    const { payload } = action;
    if (payload.theme) {
        document.documentElement.setAttribute('data-theme', payload.theme);
        document.body.setAttribute('data-theme', payload.theme);
    }
}

function createStorageChannel() {
    return eventChannel(emitter => {
        const onStorageChange = (event) => {
            if (event.key === 'userData') {
                try {
                    const userData = JSON.parse(event.newValue);
                    emitter(userData);
                } catch (error) {
                    console.error('Error parsing userData:', error);
                }
            }
        };

        window.addEventListener('storage', onStorageChange);
        return () => window.removeEventListener('storage', onStorageChange);
    });
}

function* watchStorageSaga() {
    const channel = yield call(createStorageChannel);
    while (true) {
        const userData = yield take(channel);
        yield put({ type: USER_UPDATE_SUCCESS, payload: userData });
    }
}

function* userLoginSaga() {
    try {
        const userId = getCookieValue('user_id');

        if (!userId) {
            throw new Error('User ID not found in cookies. Please log in.');
        }

        const url = `http://192.99.8.135/pokemon_api.php?route=get_info&user_id=${userId}`;

        const response = yield call(axios.get, url, {
            headers: {
                Cookie: `user_id=${userId};`,
            },
        });
        const data = response.data;

        document.documentElement.setAttribute('data-theme', data.theme);
        document.body.setAttribute('data-theme', data.theme);

        yield put({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (err) {
        console.error('Error fetching user details:', err);
        yield put({ type: USER_LOGIN_FAILURE, payload: err });
    }
}

function* userUpdateSaga(action) {
    try {
        const { payload } = action;
        const userId = getCookieValue('user_id');

        if (!userId) {
            throw new Error('User ID not found in cookies. Please log in.');
        }

        const url = `http://192.99.8.135/pokemon_api.php?route=set_info&user_id=${userId}`;

        const response = yield call(
            axios.post,
            url,
            payload,
            {
                headers: {
                    Cookie: `user_id=${userId};`,
                },
            }
        );

        const theme = payload.get('theme');
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);

        yield put({ type: USER_UPDATE_SUCCESS, payload: response.data });

        localStorage.setItem('userData', JSON.stringify(response.data));
        console.log('User data saved to localStorage:', response.data);
    } catch (error) {
        console.error('Error submitting form:', error);
        yield put({ type: USER_UPDATE_FAILURE, payload: error.message });
    }
}

