import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles, theme } from './../../../constants/styles';
import colors from './../../../constants/colors';
import env from './../../../../env';

const StockDetails = props => {

    const screenWidth = Dimensions.get('window').width;
    const stock = props.route.params.stock;
    const stockImage = stock.imagenes[0] && stock.imagenes[0].name ? env.BASE_URL + 'files/' + stock.imagenes[0].name : null;
    const date = new Date(stock.createdAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedHour = `${date.getHours()}:${date.getMinutes()}`;

    return (
        <View style={styles.screen}>
            <View style={{ ...styles.headerIcons, padding: 20, paddingLeft: 7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                            Detalle de Stock
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={{}}>
                    {stockImage ?
                        <View style={{ width: '100%', height: screenWidth + 1, alignItems: 'center' }}>
                            <Image style={{ resizeMode: 'contain', width: '100%', height: '100%' }} source={{ uri: stockImage }} />
                        </View>
                        : <View></View>}
                </View>
                <View style={{ width: '100%', paddingHorizontal: 15, marginBottom: 20 }}>
                    <TextInput
                        disabled={true}
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        label={'Fecha de carga'}
                        value={formattedDate + ' - ' + formattedHour}
                    />
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