import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../../../constants/styles';
import StockItem from './../../../components/stock/stockItem';

const StockScreen = props => {

    const handleOnDetailPress = stock => {
        props.navigation.navigate('Details');
    };

    return (
        <View style={styles.screen}>
            <View style={{ ...styles.headerIcons, paddingHorizontal: 20, paddingTop: 20, paddingLeft: 7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                            Mi Stock
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 20 }}>
                <View style={{alignItems: 'center'}}>
                    <StockItem onPress={handleOnDetailPress}/>
                </View>
            </ScrollView>
        </View>
    );
};

export default StockScreen;