import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE,
    USER_LOGOUT,
} from "./userAction";

const initialState = {
    userData: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                userData: action.payload,
                isLoggedIn: true,
                loading: false,
            };
        case USER_LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case USER_UPDATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case USER_UPDATE_SUCCESS:
            return {
                ...state,
                userData: action.payload,
                loading: false,
            };
        case USER_UPDATE_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case USER_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
            };
        default:
            return state;
    }
};

export default userReducer;