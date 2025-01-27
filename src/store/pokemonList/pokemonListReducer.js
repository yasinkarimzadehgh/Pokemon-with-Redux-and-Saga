import {
    GET_POKEMON_LIST_REQUEST,
    GET_POKEMON_LIST_SUCCESS,
    GET_POKEMON_LIST_FAILURE,
} from './pokemonListAction';

const initialState = {
    pokemonList: [],
    loading: false,
    error: null,
};

const pokemonListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_POKEMON_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_POKEMON_LIST_SUCCESS:
            return {
                ...state,
                pokemonList: action.payload,
                loading: false,
            };
        case GET_POKEMON_LIST_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default pokemonListReducer;