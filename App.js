import React, { useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigator/appNavigator';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
import colors from './src/constants/colors';
import env from './env';

// import Parse from 'parse/react-native';
// Parse.setAsyncStorage(AsyncStorage);
// Parse.initialize(env.PARSE_API_KEY);
// Parse.serverURL = env.PARSE_URL;

const fetchFonts = () => {
  return Font.loadAsync({
    'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Italic': require('./assets/fonts/Nunito-Italic.ttf'),
    'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),

    'NunitoSans-Black': require('./assets/fonts/NunitoSans-Black.ttf'),
    'NunitoSans-Bold': require('./assets/fonts/NunitoSans-Bold.ttf'),
    'NunitoSans-ExtraBold': require('./assets/fonts/NunitoSans-ExtraBold.ttf'),
    'NunitoSans-Italic': require('./assets/fonts/NunitoSans-Italic.ttf'),
    'NunitoSans-Light': require('./assets/fonts/NunitoSans-Light.ttf'),
    'NunitoSans-Regular': require('./assets/fonts/NunitoSans-Regular.ttf'),
    'NunitoSans-SemiBold': require('./assets/fonts/NunitoSans-SemiBold.ttf'),
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

  const fontConfig = {
    default: {
      bold: {
        fontFamily: 'NunitoSans-Bold',
        fontWeight: 'bold',
      },
      regular: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'NunitoSans-Light',
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

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryGunMetal} />
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};