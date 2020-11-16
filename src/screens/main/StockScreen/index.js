import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../constants/styles';
import StockItem from './../../../components/stock/stockItem';
import ApiService from './../../../services/Api';
import colors from './../../../constants/colors';

const StockScreen = props => {

    const [stocks, setStocks] = useState(null);
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            const res = await ApiService.get('stocks');
            setStocks(res.data);
        } catch (error) {
            console.log('StockScreen - fetchData Error: ', error.response);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

    const handleOnDetailPress = stock => {
        props.navigation.navigate('Details', { stock: stock });
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
                <View style={{ alignItems: 'center' }}>
                    {stocks ? stocks.map(stock => <StockItem key={stock.id} stock={stock} onPress={() => handleOnDetailPress(stock)} />)
                        :
                        <ActivityIndicator style={{ flex: 1 }} size={'large'} color={colors.bs.primary} />
                    }
                </View>
            </ScrollView>
        </View>
    );
};

export default StockScreen;