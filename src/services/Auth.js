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
            console.log('Auth Service - Login Error: ', error);
        }
    } else {
        console.log('Login error: ', res.data);
    }
};

const login = async (credentials, dispatch) => {
    const res = await ApiService.post(
        'auth/local', {
        identifier: credentials.email,
        password: credentials.password
    });
    loginIfOk(res, dispatch);
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

const register = async (userData, dispatch) => {
    const res = await ApiService.post(
        'auth/local/register',
        {
            ...userData,
        }
    );
    console.log('REGISTER RESPONSE', res);
    loginIfOk(res, dispatch);
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