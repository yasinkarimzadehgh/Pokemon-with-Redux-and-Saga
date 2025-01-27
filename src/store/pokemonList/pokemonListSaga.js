import { takeLatest, put, call, select } from 'redux-saga/effects';
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

        const pokemonList = [];
        const batchSize = 10;
        const totalBatches = Math.ceil(pokemonUrls.length / batchSize);

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * batchSize;
            const endIndex = Math.min(startIndex + batchSize, pokemonUrls.length);
            const batchUrls = pokemonUrls.slice(startIndex, endIndex);

            const batchResults = yield Promise.all(
                batchUrls.map(async (url) => {
                    try {
                        const pokemonResponse = await axios.get(url);
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

            pokemonList.push(...batchResults.filter(pokemon => pokemon !== null));
        }

        yield put({ type: GET_POKEMON_LIST_SUCCESS, payload: pokemonList });
    } catch (err) {
        console.error("Error fetching ability details:", err);
        yield put({ type: GET_POKEMON_LIST_FAILURE, payload: err.message });
    }
}

export function* watchPokemonListSaga() {
    yield takeLatest(GET_POKEMON_LIST_REQUEST, getPokemonListSaga);
}