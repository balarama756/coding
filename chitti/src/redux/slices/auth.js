import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { setAuthToken } from '../../utils/api';
import { connectSocket } from '../../utils/socket';

const initialState = {
    isLoading: false,
    error: null,
    token: null,
    user: null,
    isLoggedIn: false,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        loginSuccess(state, action) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        logoutSuccess(state) {
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
        },
        updateUser(state, action) {
            state.user = action.payload;
        },
    },
});

export default slice.reducer;
const { setError, setLoading, loginSuccess, logoutSuccess, updateUser } = slice.actions;
export { updateUser };

// ** REGISTER USER
export function RegisterUser(formData, navigate) {
    return async (dispatch, getState) => {
        dispatch(setError(null));
        dispatch(setLoading(true));

        await axios.post('/auth/signup', formData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                toast.success(response.data.message);
            })
            .catch(function (error) {
                dispatch(setError(error));
                toast.error(error?.message || 'Something went wrong!');
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (!getState().auth.error) {
                    navigate(`/auth/verify?email=${formData.email}`);
                }
            });
    };
}

// RESEND OTP
export function ResendOTP(email) {
    return async (dispatch) => {
        dispatch(setError(null));
        dispatch(setLoading(true));

        await axios.post('/auth/resend-otp', { email }, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                toast.success(response.data.message);
            })
            .catch(function (error) {
                dispatch(setError(error));
                toast.error(error?.message || 'Something went wrong!');
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
}

// VERIFY OTP
export function VerifyOTP(formValues, navigate) {
    return async (dispatch, getState) => {
        dispatch(setError(null));
        dispatch(setLoading(true));

        await axios.post('/auth/verify', formValues, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                const { token, message } = response.data;
                setAuthToken(token);
                connectSocket(token);
                dispatch(loginSuccess({ token, user: response.data.user || null }));
                toast.success(message || 'Email Verified Successfully!');
            })
            .catch(function (error) {
                dispatch(setError(error));
                toast.error(error?.message || 'Something went wrong!');
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (!getState().auth.error) {
                    navigate('/dashboard');
                }
            });
    };
}

// LOGIN USER
export function LoginUser(formValues, navigate) {
    return async (dispatch, getState) => {
        dispatch(setError(null));
        dispatch(setLoading(true));

        await axios.post('/auth/login', formValues, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                const { token, message } = response.data;
                setAuthToken(token);
                connectSocket(token);
                dispatch(loginSuccess({ token, user: response.data.user || null }));
                toast.success(message || 'Logged in Successfully!');
            })
            .catch(function (error) {
                dispatch(setError(error));
                toast.error(error?.message || 'Something went wrong!');
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (!getState().auth.error) {
                    navigate('/dashboard');
                }
            });
    };
}

export function LogoutUser(navigate) {
    return async (dispatch) => {
        try {
            dispatch(logoutSuccess());
            navigate('/');
            toast.success('Logged out Successfully!');
        } catch (error) {
            console.log(error);
        }
    };
}
