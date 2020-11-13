import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './../../constants/colors';

const StockItem = props => {

    const data = {
        producto: 'Madera durísima',
        espesor: '13"',
        ancho: '10"',
        largo: '12"',
        calidad: "Primera",
        volumen_stock: "Pie",
        cantidad: 3,
        especie: 'Pino',
        comentarios: 'Alto comentario',
    };

    const handleOnDetailPress = () => {
        props.onPress();
    };

    return (
        <TouchableOpacity onPress={() => console.log('ASD')} style={styles.component}>
            <Image style={{ width: 65, height: 65 }} source={require('./../../../assets/img/wood.jpeg')} />
            <View style={{ padding: 3, flex: 1 }}>
                <Text>NOMBRE DEL PRODUCTO</Text>
                <Text style={{ color: colors.primarySilver }}>Descripciones varias</Text>
                <Text style={{ color: colors.primarySilver }}>Más descripciones</Text>
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