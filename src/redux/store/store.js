import { createStore, combineReducers } from 'redux';
import userReducer from '../user/reducer';
import authReducer from '../auth/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
});

export default createStore(rootReducer);