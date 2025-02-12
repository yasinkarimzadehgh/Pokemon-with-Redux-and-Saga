import { takeLatest, put, call, select } from 'redux-saga/effects';
import {
    GET_POKEMON_DETAIL_REQUEST,
    GET_POKEMON_DETAIL_SUCCESS,
    GET_POKEMON_DETAIL_FAILURE,
} from './pokemonDetailAction';
import axios from 'axios';

export function* watchPokemonDetailSaga() {
    yield takeLatest(GET_POKEMON_DETAIL_REQUEST, getPokemonDetailSaga);
}

function* getPokemonDetailSaga(action) {
    try {
        const response = yield call(axios.get, action.payload);
        yield put({ type: GET_POKEMON_DETAIL_SUCCESS, payload: response.data });
    } catch (err) {
        console.error("Error fetching ability details:", err);
        yield put({ type: GET_POKEMON_DETAIL_FAILURE, payload: err.message });
    }
}

