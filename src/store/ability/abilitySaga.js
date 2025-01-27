import { takeLatest, put, call, select } from 'redux-saga/effects';
import {
    GET_ABILITIES_REQUEST,
    GET_ABILITIES_SUCCESS,
    GET_ABILITIES_FAILURE,
    DELETE_ABILITIES_REQUEST,
    DELETE_ABILITIES_SUCCESS,
    DELETE_ABILITIES_FAILURE,
} from './abilityAction';
import axios from 'axios';

const getAbilitiesState = (state) => state.ability;

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
                isLastPage: nextApiUrl === null ? true : false,
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

        if (abilityList.length > 10) {
            if (abilityList.length <= 20) {
                newAbilities = abilityList.slice(0, 10);
                newOffset = 10;
                newUrl = 'https://pokeapi.co/api/v2/ability/?offset=10&limit=10';
            } else {
                newAbilities = abilityList.slice(0, -10);
                newOffset = currentOffset - 10;
                newUrl = `https://pokeapi.co/api/v2/ability/?offset=${newOffset}&limit=10`;
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

export function* watchAbilitySaga() {
    yield takeLatest(GET_ABILITIES_REQUEST, getAbilitiesSaga);
    yield takeLatest(DELETE_ABILITIES_REQUEST, deleteAbilitiesSaga);
}