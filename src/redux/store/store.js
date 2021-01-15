import { createStore, combineReducers } from 'redux';
import userReducer from '../user/reducer';
import authReducer from '../auth/reducer';
import navigationReducer from '../navigation/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    navigation: navigationReducer,
});

export default createStore(rootReducer);