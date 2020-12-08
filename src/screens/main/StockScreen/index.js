import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../constants/styles';
import StockList from './../../../components/stock/stockList';
import ApiService from './../../../services/Api';
import colors from './../../../constants/colors';
import env from './../../../../env';

const StockScreen = props => {

    const POST_PER_LOAD_LIMIT = env.LOAD_STOCK_QTY || 10;
    const [stocks, setStocks] = useState(null);
    const navigation = useNavigation();

    const [isLoadingMore, setIsLoadingMore] = useState(null);

    const fetchData = async () => {
        try {
            const res = await ApiService.get(`stocks?_sort=createdAt:DESC&_limit=${POST_PER_LOAD_LIMIT}`);
            setStocks(res.data);
        } catch (error) {
            console.log('StockScreen - fetchData Error: ', error.response);
        }
    };

    const loadMoreStock = async () => {
        try {
            setIsLoadingMore(true);
            const res = await ApiService.get(`stocks?_sort=createdAt:DESC&_start=${stocks.length}&_limit=${POST_PER_LOAD_LIMIT}`);
            const updatedPosts = [...stocks, ...res.data];
            setStocks(updatedPosts);
            setIsLoadingMore(false);
        } catch (error) {
            console.log('StockScreen - loadMoreStock Error: ', error.response);
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
                        <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                            Mi Stock
                        </Text>
                    </View>
                </View>
            </View>
            {stocks ?
                <StockList handleOnDetailPress={handleOnDetailPress} data={stocks} onEndReached={loadMoreStock} />
                :
                <ActivityIndicator style={{ flex: 1 }} size={'large'} color={colors.bs.primary} />
            }
            {isLoadingMore && <ActivityIndicator size={'large'} color={colors.bs.primary} />}
        </View>
    );
};

export default StockScreen;