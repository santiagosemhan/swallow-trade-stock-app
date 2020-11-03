import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/auth/LoginScreen';
import TnCScreen from '../screens/auth/TnCScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import HomeScreen from '../screens/main/HomeScreen';

import ProfileScreen from '../screens/main/ProfileScreen';
import ChangePasswordScreen from '../screens/main/ProfileScreen/changePassword';

import InfoScreen from '../screens/main/InfoScreen';
import Auth from '../services/Auth';
import { FontAwesome, Feather } from 'react-native-vector-icons';

const RootNavigator = () => {

    const AppStack = createStackNavigator();
    const HomeTabs = createBottomTabNavigator();

    const HomeStack = createStackNavigator();
    const ProfileStack = createStackNavigator();

    const Drawer = createDrawerNavigator();
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleLogOut = () => {
        Auth.logOut(dispatch);
    };

    const HomeNavigator = () => {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name={'Index'} component={HomeScreen} options={{ headerShown: false }} />
            </HomeStack.Navigator>
        );
    };

    const ProfileNavigator = () => {
        return (
            <ProfileStack.Navigator>
                <ProfileStack.Screen name={'Index'} component={ProfileScreen} options={{ headerShown: false }} />
                <ProfileStack.Screen name={'ChangePassword'} component={ChangePasswordScreen} options={{ headerShown: false }} />
            </ProfileStack.Navigator>
        );
    };

    const homeTabsNavigator = () => {
        return (
            <HomeTabs.Navigator tabBarOptions={{
                showLabel: false,
                activeBackgroundColor: '#1c1c1c',
                inactiveBackgroundColor: '#1c1c1c',
                activeTintColor: 'white',
            }}>
                <HomeTabs.Screen
                    name={'Home'}
                    component={HomeNavigator}
                    options={{
                        tabBarLabel: 'Inicio',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="home" color={color} size={size} />
                        ),
                    }}
                />
                <HomeTabs.Screen
                    name={'Info'}
                    component={InfoScreen}
                    options={{
                        tabBarLabel: 'Info',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="info" color={color} size={size} />
                        ),
                    }}
                />
                <HomeTabs.Screen
                    name={'User'}
                    component={ProfileNavigator}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="user-o" color={color} size={size} />
                        ),
                    }}
                />
            </HomeTabs.Navigator>
        );
    };

    const CustomDrawerContent = props => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem label="Cerrar sesión" onPress={handleLogOut} />
            </DrawerContentScrollView>
        );
    };

    const drawerNavigator = () => {
        return (
            <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={homeTabsNavigator} />
            </Drawer.Navigator>
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