import React, { useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigator/appNavigator';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
import colors from './src/constants/colors';
import { Appearance } from 'react-native'

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const fetchFonts = () => {
  return Font.loadAsync({
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
};

enableScreens();

export default App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}>
      </AppLoading>
    )
  }

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await AsyncStorage.setItem('pushToken', token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };
  registerForPushNotificationsAsync();

  const fontConfig = {
    default: {
      bold: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: 'bold',
      },
      regular: {
        fontFamily: 'OpenSans-Regular',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'OpenSans-Light',
        fontWeight: 'normal',
      },
    },
  };

  const theme = {
    ...DefaultTheme,
    roundness: 5,
    elevation: 2,
    fonts: configureFonts(fontConfig),
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primaryOldMossGreen,
      accent: colors.primaryDavysGray,
      background: colors.background
    },
  };

  const fondo = Appearance.getColorScheme() === 'dark' ? colors.bs.secondary : 'white';

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryGunMetal} />
        <SafeAreaView style={{ flex: 1, backgroundColor: fondo }}>
          <RootNavigator />
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};