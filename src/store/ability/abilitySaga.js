import { takeLatest, put, call, select, takeEvery } from 'redux-saga/effects';
import {
    GET_ABILITIES_REQUEST,
    GET_ABILITIES_SUCCESS,
    GET_ABILITIES_FAILURE,
    DELETE_ABILITIES_REQUEST,
    DELETE_ABILITIES_SUCCESS,
    DELETE_ABILITIES_FAILURE,
} from './abilityAction';
import axios from 'axios';

export function* watchAbilitySaga() {
    yield takeLatest(GET_ABILITIES_REQUEST, getAbilitiesSaga);
    yield takeLatest(DELETE_ABILITIES_REQUEST, deleteAbilitiesSaga);

    // yield takeEvery(GET_ABILITIES_REQUEST, getAbilitiesSaga);
    // yield takeEvery(DELETE_ABILITIES_REQUEST, deleteAbilitiesSaga);

}

const getAbilitiesState = (state) => state.ability;

const API_BASE_URL = 'https://pokeapi.co/api/v2/ability/';
const PAGE_LIMIT = 10;

function* getAbilitiesSaga(action) {
    try {
        const response = yield call(axios.get, action.payload);
        const data = response.data;

        const newAbilities = data.results.map((item) => item.name);
        const nextApiUrl = data.next;

        yield put({
            type: GET_ABILITIES_SUCCESS,
            payload: {
                abilityList: newAbilities,
                nextApiUrl,
                isLastPage: nextApiUrl === null,
                currentOffset: newAbilities.length,
            },
        });
    } catch (error) {
        yield put({ type: GET_ABILITIES_FAILURE, payload: error.message });
    }
}

function* deleteAbilitiesSaga() {
    try {
        const state = yield select(getAbilitiesState);
        const { abilityList, currentOffset } = state;

        let newAbilities, newOffset, newUrl;

        if (abilityList.length > PAGE_LIMIT) {
            const remainingAbilities = abilityList.length - PAGE_LIMIT;
            if (remainingAbilities <= PAGE_LIMIT) {
                newAbilities = abilityList.slice(0, PAGE_LIMIT);
                newOffset = PAGE_LIMIT;
                newUrl = `${API_BASE_URL}?offset=${newOffset}&limit=${PAGE_LIMIT}`;
            } else {
                newAbilities = abilityList.slice(0, -PAGE_LIMIT);
                newOffset = currentOffset - PAGE_LIMIT;
                newUrl = `${API_BASE_URL}?offset=${newOffset}&limit=${PAGE_LIMIT}`;
            }
        } else {
            newAbilities = abilityList;
            newOffset = currentOffset;
            newUrl = state.API_URL;
        }

        yield put({
            type: DELETE_ABILITIES_SUCCESS,
            payload: {
                abilityList: newAbilities,
                newOffset,
                newUrl,
            },
        });
    } catch (error) {
        yield put({ type: DELETE_ABILITIES_FAILURE, payload: error.message });
    }
}

