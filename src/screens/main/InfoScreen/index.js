import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../constants/styles';

const InfoScreen = props => {

    return (
        <View style={styles.screen}>
            <Text style={styles.blankScreenText}>Info Screen!</Text>
        </View>
    );
};

export default InfoScreen;