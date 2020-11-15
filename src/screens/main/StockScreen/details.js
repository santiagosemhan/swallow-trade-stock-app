import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from './../../../constants/styles';
import colors from './../../../constants/colors';

const StockDetails = props => {

    const stock = props.route.params.stock

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
        <View style={styles.screen}>
            <View style={{ ...styles.headerIcons, paddingHorizontal: 20, paddingTop: 20, paddingLeft: 7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                            Detalle de Stock
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={{ width: '100%', padding: 15 }}>
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Categoría'}
                        value={stock.producto.nombre}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Espesor'}
                        value={stock.espesor + '"'}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Ancho'}
                        value={stock.ancho + '"'}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Largo'}
                        value={stock.largo + "'"}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Calidad'}
                        value={stock.calidad}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Volumen Stock'}
                        value={stock.volumen_stock}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Cantidad'}
                        value={stock.cantidad + ''}
                    />
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Especie'}
                        value={stock.especie.nombre}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default StockDetails;