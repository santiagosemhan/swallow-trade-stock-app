import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { styles } from '../../../constants/styles';
import ImagesUtil from '../../../utils/Images';

const InfoScreen = props => {
    
    const brandImage = ImagesUtil.getBrandImage();

    return (
        <View style={styles.screen}>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <View>
                    <Image
                        style={styles.screenLogoLogin}
                        resizeMode="contain"
                        source={brandImage}
                    />
                    <Text style={{ fontFamily: 'OpenSans-Regular', textAlign: 'justify' }}>Comercializamos más de 70 productos certificados internacionalmente, procedentes de industrias de América Latina, Europa, Asia y África.</Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 18, marginBottom: 10 }}>Acerca de Swallow Trade</Text>
                    <Text style={{ fontFamily: 'OpenSans-Regular', textAlign: 'justify' }}>Somos una empresa que bajo la modalidad de agenciamiento de industrias mercadea productos derivados de la madera, alimentos, maquinaria industrial y tambien brinda asistencia al comercio internacional tanto para la parte oferente como para la parte demandante.</Text>
                    <Image
                        style={{ width: '100%', height: 80 }}
                        resizeMode="contain"
                        source={require('./../../../../assets/img/about/1.jpg')}
                    />
                </View>
                <View style={{ marginVertical: 30 }}>
                    <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 18, marginBottom: 10 }}>Contáctenos</Text>
                    <Text style={{ fontFamily: 'OpenSans-Regular', textAlign: 'justify' }}>Si desea contactarnos por cualquier duda o cotizacion+54 9 3751 314949 o envienos un email. Para cotizaciones mas puntuales envienos su consulta.</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default InfoScreen;