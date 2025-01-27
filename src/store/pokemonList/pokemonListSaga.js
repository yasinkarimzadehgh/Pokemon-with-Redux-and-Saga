import { takeLatest, put, call, all } from 'redux-saga/effects';
import {
    GET_POKEMON_LIST_REQUEST,
    GET_POKEMON_LIST_SUCCESS,
    GET_POKEMON_LIST_FAILURE,
} from './pokemonListAction';
import { getPokemonSprite } from "../../utils/helper";
import axios from 'axios';

function* getPokemonListSaga(action) {
    try {
        const response = yield call(axios.get, action.payload);
        const abilityDetail = response.data;
        const pokemonUrls = abilityDetail.pokemon.map(
            (pokemon) => pokemon.pokemon.url
        );

        const pokemonList = yield all(
            pokemonUrls.map(function* (url) {
                try {
                    const pokemonResponse = yield call(axios.get, url);
                    const pokemonData = pokemonResponse.data;
                    return {
                        name: pokemonData.name,
                        sprite: getPokemonSprite(pokemonData.sprites),
                        abilities: pokemonData.abilities.map((ability) => ({
                            name: ability.ability.name,
                        })),
                    };
                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                    return null;
                }
            })
        );

        yield put({ type: GET_POKEMON_LIST_SUCCESS, payload: pokemonList });
    } catch (err) {
        console.error("Error fetching ability details:", err);
        yield put({ type: GET_POKEMON_LIST_FAILURE, payload: err.message });
    }
}

export function* watchPokemonListSaga() {
    yield takeLatest(GET_POKEMON_LIST_REQUEST, getPokemonListSaga);
}

