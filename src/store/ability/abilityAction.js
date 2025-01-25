export const GET_ABILITIES_STORED = 'GET_ABILITIES_STORED';


export const GET_ABILITIES_REQUEST = 'GET_ABILITIES_REQUEST';
export const GET_ABILITIES_SUCCESS = 'GET_ABILITIES_SUCCESS';
export const GET_ABILITIES_FAILURE = 'GET_ABILITIES_FAILURE';

export const DELETE_ABILITIES_REQUEST = 'DELETE_ABILITIES_REQUEST';
export const DELETE_ABILITIES_SUCCESS = 'DELETE_ABILITIES_SUCCESS';
export const DELETE_ABILITIES_FAILURE = 'DELETE_ABILITIES_FAILURE';

export const getAbilitiesStored = (abilities) => ({
    type: GET_ABILITIES_STORED,
    payload: abilities,
});


export const getAbilitiesRequest = (url) => ({
    type: GET_ABILITIES_REQUEST,
    payload: url,
});

export const getAbilitiesSuccess = (abilities) => ({
    type: GET_ABILITIES_SUCCESS,
    payload: abilities,
});

export const getAbilitiesFailure = (error) => ({
    type: GET_ABILITIES_FAILURE,
    payload: error,
});

export const deleteAbilitiesRequest = (abilities) => ({
    type: DELETE_ABILITIES_REQUEST,
    payload: abilities,
});

export const deleteAbilitiesSuccess = (abilities) => ({
    type: DELETE_ABILITIES_SUCCESS,
    payload: abilities,
});

export const deleteAbilitiesFailure = (error) => ({
    type: DELETE_ABILITIES_FAILURE,
    payload: error,
});

