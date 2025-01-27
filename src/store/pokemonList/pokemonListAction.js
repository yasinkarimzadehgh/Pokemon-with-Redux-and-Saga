export const GET_POKEMON_LIST_REQUEST = 'GET_POKEMON_LIST_REQUEST';
export const GET_POKEMON_LIST_SUCCESS = 'GET_POKEMON_LIST_SUCCESS';
export const GET_POKEMON_LIST_FAILURE = 'GET_POKEMON_LIST_FAILURE';

export const getPokemonListRequest = (url) => ({
    type: GET_POKEMON_LIST_REQUEST,
    payload: url,
});

export const getPokemonListSuccess = (pokemonList) => ({
    type: GET_POKEMON_LIST_SUCCESS,
    payload: pokemonList,
});

export const getPokemonListFailure = (error) => ({
    type: GET_POKEMON_LIST_FAILURE,
    payload: error,
});

