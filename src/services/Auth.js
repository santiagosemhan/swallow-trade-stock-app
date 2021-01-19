import ApiService from './Api';
import { setLoggedIn } from '../redux/auth/actions';
import { setUserData } from '../redux/user/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const loginIfOk = async (res, dispatch) => {
    if (res.status == 200) {
        try {
            ApiService.setAuthToken(res.data.jwt);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            await AsyncStorage.setItem('auth_token', JSON.stringify(res.data.jwt));
            saveInstallationId(res.data.user);
            dispatch(setLoggedIn(true));
            dispatch(setUserData(res.data.user));
        } catch (error) {
            console.log('Auth Service - LoginIfOk Error: ', error);
        }
    } else {
        console.log('Auth Service - LoginIfOk Error: ', res.data);

    }
};

const saveInstallationId = async (user) => {
    try {
        const pushToken = await AsyncStorage.getItem('pushToken');
        const data = {
            installationId: Constants.installationId,
            pushToken,
            user: user.id,
        }
        const hasInstallation = await ApiService.get('/installations', { installationId: Constants.installationId });
        if (!hasInstallation.data.length) {
            await ApiService.post('/installations', data);
        }
    } catch (error) {
        console.log('Auth Service - saveInstallationId Error', error.response);
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
        console.log('Auth Service - Register Error: ', error.response);
    }
};

const logout = async (dispatch) => {
    try {
        ApiService.resetAuthToken();
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('auth_token');
        dispatch(setUserData(null));
        dispatch(setLoggedIn(false));
    } catch (error) {
        console.log('Auth Service - logOut Error: ', error);
    }
};

const isSignedIn = async (dispatch) => {
    let user = undefined;
    let auth_token = undefined;
    try {
        const res = await AsyncStorage.getItem('user');
        const jwt = await AsyncStorage.getItem('auth_token');
        user = JSON.parse(res);
        auth_token = JSON.parse(jwt);
    } catch (error) {
        console.log('Auth Service - isSignedIn error: ', error);
    }
    if (user && auth_token) {
        ApiService.setAuthToken(auth_token);
        dispatch(setLoggedIn(true));
        dispatch(setUserData(user));
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