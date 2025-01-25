// src/store/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import abilityReducer from './ability/abilityReducer';
import { watchAbilitySaga } from './saga/abilitySaga';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    ability: abilityReducer,
});

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(watchAbilitySaga);

export default store;