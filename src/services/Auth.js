import ApiService from './Api';
import { setLoggedIn } from '../redux/auth/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginIfOk = async (res, dispatch) => {
    if (res.status == 200) {
        try {
            ApiService.setAuthToken(res.data.jwt);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            dispatch(setLoggedIn(true));
        } catch (error) {
            console.log('Auth Service - LoginIfOk Error: ', error);
        }
    } else {
        console.log('Auth Service - LoginIfOk Error: ', res.data);
    }
};

const login = async (credentials, dispatch) => {
    try {
        const res = await ApiService.post(
            'auth/local', {
            identifier: credentials.email,
            password: credentials.password
        });
        loginIfOk(res, dispatch);
    } catch (error) {
        console.log('AuthService - Login Error:', error.response);
    }
};

const register = async (userData, dispatch) => {
    try {
        const res = await ApiService.post(
            'auth/local/register',
            {
                ...userData,
            }
        );
        loginIfOk(res, dispatch);
    } catch (error) {
        console.log('AuthService - Register Error: ', error.response);
    }
};

const logout = async (dispatch) => {
    try {
        ApiService.resetAuthToken();
        await AsyncStorage.removeItem('user');
        dispatch(setLoggedIn(false));
    } catch (error) {
        console.log('Auth Service - logOut Error: ', error);
    }
};

const isSignedIn = async (dispatch) => {
    let user = undefined;
    try {
        const res = await AsyncStorage.getItem('user');
        user = JSON.parse(res);
    } catch (error) {
        console.log('Aut hService - isSignedIn error: ', error);
    }
    if (user) {
        dispatch(setLoggedIn(user ? true : false));
        return user;
    } else {
        logout(dispatch);
    }
};

export default {
    login,
    logout,
    register,
    isSignedIn,
};