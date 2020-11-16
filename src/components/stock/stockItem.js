import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './../../constants/colors';
import env from './../../../env';

const StockItem = props => {

    const stock = props.stock;
    const stockImage = stock.imagenes[0] && stock.imagenes[0].name ? env.BASE_URL + 'files/' + stock.imagenes[0].formats.thumbnail.name : null;
    const date = new Date(stock.createdAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedHour = `${date.getHours()}:${date.getMinutes()}`;

    const handleOnDetailPress = () => {
        props.onPress();
    };

    return (
        <TouchableOpacity onPress={handleOnDetailPress} style={styles.component}>
            {stockImage ?
                <Image style={{ width: 65, height: 65 }} source={{ uri: env.BASE_URL + 'files/' + stockImage }} />
                :
                <Image style={{ width: 65, height: 65 }} source={require('./../../../assets/img/wood.jpeg')} />
            }
            <View style={{ padding: 3, flex: 1 }}>
                <Text style={{}}>{stock.producto.nombre.toUpperCase()}</Text>
                <Text style={{ color: colors.primarySilver, fontSize: 13 }}>Especie: {stock.especie.nombre} - Ancho: {stock.ancho}" - Largo: {stock.largo}"</Text>
                <Text style={{ color: colors.primarySilver, fontSize: 13 }}>Cargado: {formattedDate} - {formattedHour}</Text>
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