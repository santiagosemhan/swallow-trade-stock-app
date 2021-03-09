import React from 'react';
import { Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setNavigationState } from '../redux/navigation/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/auth/LoginScreen';
import TnCScreen from '../screens/auth/TnCScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import HomeScreen from '../screens/main/HomeScreen';

import ProfileScreen from '../screens/main/ProfileScreen';
import ChangePasswordScreen from '../screens/main/ProfileScreen/changePassword';

import StockScreen from '../screens/main/StockScreen';
import StockDetailsScreen from '../screens/main/StockScreen/details';

import InfoScreen from '../screens/main/InfoScreen';
import Auth from '../services/Auth';
import { FontAwesome, Feather } from 'react-native-vector-icons';

import colors from './../constants/colors';

const RootNavigator = () => {

    const AppStack = createStackNavigator();
    const HomeTabs = createBottomTabNavigator();

    const HomeStack = createStackNavigator();
    const StockStack = createStackNavigator();
    const ProfileStack = createStackNavigator();

    const isLoggedIn = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const userRole = user && user.role ? user.role.name : null;
    const dispatch = useDispatch();

    const HomeNavigator = () => {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name={'HomeIndex'} component={HomeScreen} options={{ headerShown: false }} />
            </HomeStack.Navigator>
        );
    };

    const StockNavigator = () => {
        return (
            <StockStack.Navigator>
                <StockStack.Screen name={'StockIndex'} component={StockScreen} options={{ headerShown: false }} />
                <StockStack.Screen name={'Details'} component={StockDetailsScreen} options={{ headerShown: false }} />
            </StockStack.Navigator>
        );
    };

    const ProfileNavigator = () => {
        return (
            <ProfileStack.Navigator>
                <ProfileStack.Screen name={'ProfileIndex'} component={ProfileScreen} options={{ headerShown: false }} />
                <ProfileStack.Screen name={'ChangePassword'} component={ChangePasswordScreen} options={{ headerShown: false }} />
            </ProfileStack.Navigator>
        );
    };

    const homeTabsNavigator = () => {
        return (
            <HomeTabs.Navigator
                tabBarOptions={{
                    showLabel: false,
                    activeBackgroundColor: colors.bs.secondary,
                    inactiveBackgroundColor: colors.bs.secondary,
                    activeTintColor: colors.bs.primary,
                }}

            >
                { userRole && userRole !== 'Administrator' &&
                    <HomeTabs.Screen
                        name={'Home'}
                        component={HomeNavigator}
                        options={{
                            unmountOnBlur: true,
                            tabBarLabel: 'Inicio',
                            tabBarIcon: ({ color, size }) => (
                                <Feather name="home" color={color} size={size} />
                            ),
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                dispatch(setNavigationState({ currentTab: 'home' }));
                            },
                        })}
                    />
                }
                <HomeTabs.Screen
                    name={'Stock'}
                    component={StockNavigator}
                    options={{
                        unmountOnBlur: true,
                        tabBarLabel: 'Stock',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="box" color={color} size={size} />
                        ),
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            dispatch(setNavigationState({ currentTab: 'stock' }));
                        },
                    })}

                />
                <HomeTabs.Screen
                    name={'User'}
                    component={ProfileNavigator}
                    options={{
                        unmountOnBlur: true,
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="user-o" color={color} size={size} />
                        ),
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            dispatch(setNavigationState({ currentTab: 'profile' }));
                        },
                    })}
                />
                <HomeTabs.Screen
                    name={'Info'}
                    component={InfoScreen}
                    options={{
                        tabBarLabel: 'Info',
                        tabBarIcon: ({ focused }) => (
                            <Image style={{ width: 24, height: 24 }} source={
                                focused ?
                                    require('./../../assets/swallow_icon_transparent.png') :
                                    require('./../../assets/swallow_icon_transparent_gray.png')
                            } />
                        ),
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            dispatch(setNavigationState({ currentTab: 'info' }));
                        },
                    })}
                />
            </HomeTabs.Navigator>
        );
    };

    return (
        <NavigationContainer>
            <AppStack.Navigator>
                {isLoggedIn ?
                    <>
                        <AppStack.Screen name={'App'} component={homeTabsNavigator} options={{ headerShown: false }} />
                    </>
                    :
                    <>
                        <AppStack.Screen name={'Login'} component={LoginScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name={'TnC'} component={TnCScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name={'Register'} component={RegisterScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} options={{ headerShown: false }} />
                    </>
                }
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;