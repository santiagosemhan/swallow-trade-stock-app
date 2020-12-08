import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import StockItem from './stockItem';

const StockList = props => {

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const handleOnDetailPress = item => {
        props.handleOnDetailPress(item);
    };

    const handleOnEndReached = () => {
        props.onEndReached();
    };

    const renderItem = ({ item }) => {
        return (<StockItem key={item.id} stock={item} onPress={() => handleOnDetailPress(item)} />);
        // return <Text onPress={() => handleOnDetailPress(item)}>{item.id}</Text>
    };

    return (
        <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
            <FlatList
                contentContainerStyle={{ alignItems: 'center' }}
                style={{ width: '100%' }}
                data={props.data}
                renderItem={renderItem}
                onEndReached={handleOnEndReached}
                onEndReachedThreshold={0.1}
            />
        </View >
    );
};

const styles = StyleSheet.create({

});

export default StockList;