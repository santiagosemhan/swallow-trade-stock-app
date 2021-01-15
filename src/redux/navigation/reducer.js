import { SET_NAVIGATION_DATA } from './actions';

const initialState = { currentTab: 'home' };

const navigationReducer = (navigationData = initialState, action) => {
    switch (action.type) {
        case SET_NAVIGATION_DATA:
            return {
                ...navigationData,
                ...action.data,
            };

        default:
            return navigationData;
    }
};

export default navigationReducer;