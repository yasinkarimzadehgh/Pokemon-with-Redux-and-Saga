import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import userReducer from './user/userReducer';
import abilityReducer from './ability/abilityReducer';
import pokemonListReducer from './pokemonList/pokemonListReducer';
import pokemonDetailReducer from './pokemonDetail/pokemonDetailReducer';

import { watchUserSaga } from './user/userSaga';
import { watchAbilitySaga } from './ability/abilitySaga';
import { watchPokemonListSaga } from './pokemonList/pokemonListSaga';
import { watchPokemonDetailSaga } from './pokemonDetail/pokemonDetailSaga';

const rootReducer = combineReducers({
    user: userReducer,
    ability: abilityReducer,
    pokemonList: pokemonListReducer,
    pokemonDetail: pokemonDetailReducer,
});

function* rootSaga() {
    yield all([
        watchUserSaga(),
        watchAbilitySaga(),
        watchPokemonListSaga(),
        watchPokemonDetailSaga(),
    ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;