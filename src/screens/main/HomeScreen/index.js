import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../constants/styles';

const HomeScreen = props => {

    return (
        <View style={styles.screen}>
            <Text style={styles.blankScreenText}>Home Screen!</Text>
        </View>
    );
};

export default HomeScreen;