import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './../../constants/colors';

const StockItem = props => {

    const item = props.item;

    const handleOnDetailPress = () => {
        props.onPress();
    };

    return (
        <TouchableOpacity onPress={handleOnDetailPress} style={styles.component}>
            <Image style={{ width: 65, height: 65 }} source={require('./../../../assets/img/wood.jpeg')} />
            <View style={{ padding: 3, flex: 1 }}>
                <Text style={{}}>{item.producto.nombre.toUpperCase()}</Text>
                <Text style={{ color: colors.primarySilver }}>Especie: {item.especie.nombre}</Text>
                <Text style={{ color: colors.primarySilver }}>Ancho: {item.ancho}" - Largo: {item.largo}"</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                <AntDesign name={'right'} size={24} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    component: {
        flexDirection: 'row',
        width: '95%',
        marginVertical: 5,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default StockItem;