import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';
import colors from './../../constants/colors';
import StockItem from './stockItem';

const StockList = props => {

    const data = props.data;
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const [items, setItems] = useState(null);
    const screenWidth = Dimensions.get('window').width;
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await props.onRefresh();
        setRefreshing(false);
    }, []);

    const sectionDivider = (title, year) => {
        return (
            <View style={{ width: screenWidth, paddingHorizontal: 11, marginTop: 10 }} key={title}>
                <Text style={year ? styles.sectionDividerYear : styles.sectionDividerMonth}>{title}</Text>
            </View>
        );
    };

    const stockItem = (item) => {
        return <StockItem key={item.id} stock={item} onPress={() => handleOnDetailPress(item)} />;
    };

    const buildSections = () => {
        let sections = [];
        let currentYear = -1;
        let currentMonth = -1;
        let fullData = [];
        data.forEach(item => {
            const itemDate = new Date(item.createdAt);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth();
            if (itemYear !== currentYear) {
                currentYear = itemYear;
                fullData.push(sectionDivider(currentYear, true));
            }
            if (itemMonth !== currentMonth) {
                currentMonth = itemMonth;
                fullData.push(sectionDivider(months[currentMonth], false));
            }
            fullData.push(stockItem(item));
        });
        setItems(fullData);
    };

    useEffect(() => {
        buildSections();
    }, [data]);

    const handleOnDetailPress = item => {
        props.handleOnDetailPress(item);
    };

    const handleOnEndReached = () => {
        props.onEndReached();
    };

    const renderItem = ({ item }) => {
        return item;
    };

    return (
        <View style={styles.listContainer}>
            <FlatList
                contentContainerStyle={styles.contentContainer}
                style={{ width: '100%' }}
                data={items}
                renderItem={renderItem}
                onEndReached={handleOnEndReached}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View >
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%'
    },
    sectionDividerYear: {
        width: '100%',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: colors.bs.primary,
        paddingBottom: 5,
        marginBottom: 5
    },
    sectionDividerMonth: {
        width: '100%',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '300',
        borderBottomWidth: 1,
        borderBottomColor: colors.bs.secondary,
        paddingBottom: 5,
        marginBottom: 5
    },
});

export default StockList;