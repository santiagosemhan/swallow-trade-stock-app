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

import { Appearance } from 'react-native'

const fetchFonts = () => {
  return Font.loadAsync({    
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),

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