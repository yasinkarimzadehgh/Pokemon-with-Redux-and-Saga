import {
    GET_ABILITIES_STORED,
    GET_ABILITIES_SUCCESS,
    GET_ABILITIES_FAILURE,
    DELETE_ABILITIES_SUCCESS,
    DELETE_ABILITIES_FAILURE,
} from './abilityAction';

const initialState = {
    abilityList: [],
    currentOffset: 0,
    loading: false,
    error: null,
    API_URL: 'https://pokeapi.co/api/v2/ability/?offset=0&limit=10',
    isLastPage: false,
};

const abilityReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ABILITIES_STORED:
            return {
                ...state,
                abilityList: [...action.payload.abilityList],
                currentOffset: action.payload.currentOffset,
                API_URL: action.payload.nextApiUrl || state.API_URL,
                loading: false,
                isLastPage: action.payload.isLastPage
            };
        case GET_ABILITIES_SUCCESS:
            return {
                ...state,
                abilityList: [...state.abilityList, ...action.payload.abilityList],
                currentOffset: state.currentOffset + action.payload.currentOffset,
                API_URL: action.payload.nextApiUrl || state.API_URL,
                loading: false,
                isLastPage: action.payload.isLastPage
            };
        case GET_ABILITIES_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case DELETE_ABILITIES_SUCCESS:
            return {
                ...state,
                abilityList: action.payload.abilityList,
                currentOffset: action.payload.newOffset,
                API_URL: action.payload.newUrl,
                loading: false,
                isLastPage: false,
            };
        case DELETE_ABILITIES_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default abilityReducer;