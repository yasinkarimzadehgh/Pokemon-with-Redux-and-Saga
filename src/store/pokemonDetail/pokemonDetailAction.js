export const GET_POKEMON_DETAIL_REQUEST = 'GET_POKEMON_DETAIL_REQUEST';
export const GET_POKEMON_DETAIL_SUCCESS = 'GET_POKEMON_DETAIL_SUCCESS';
export const GET_POKEMON_DETAIL_FAILURE = 'GET_POKEMON_DETAIL_FAILURE';

export const getPokemonDetailRequest = (url) => ({
    type: GET_POKEMON_DETAIL_REQUEST,
    payload: url,
});

export const getPokemonDetailSuccess = (pokemonDetail) => ({
    type: GET_POKEMON_DETAIL_SUCCESS,
    payload: pokemonDetail,
});

export const getPokemonDetailFailure = (error) => ({
    type: GET_POKEMON_DETAIL_FAILURE,
    payload: error,
});

