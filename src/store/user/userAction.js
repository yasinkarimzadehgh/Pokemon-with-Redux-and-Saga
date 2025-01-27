export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
export const USER_UPDATE_FAILURE = 'USER_UPDATE_FAILURE';

export const USER_LOGOUT = 'USER_LOGOUT';


export const userLoginRequest = (url) => ({
    type: USER_LOGIN_REQUEST,
    payload: url,
});

export const userLoginSuccess = (userData) => ({
    type: USER_LOGIN_SUCCESS,
    payload: userData,
});

export const userLoginFailure = (error) => ({
    type: USER_LOGIN_FAILURE,
    payload: error,
});


export const userUpdateRequest = (formData) => ({
    type: USER_UPDATE_REQUEST,
    payload: formData,
});

export const userUpdateSuccess = (userData) => ({
    type: USER_UPDATE_SUCCESS,
    payload: userData,
});

export const userUpdateFailure = (error) => ({
    type: USER_UPDATE_FAILURE,
    payload: error,
});

export const userLogout = () => ({
    type: USER_LOGOUT,
});
