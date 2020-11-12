import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StockItem = () => {

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

    return (
        <View>
            <Text>Utilizar el memo especificado en la url</Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default StockItem;