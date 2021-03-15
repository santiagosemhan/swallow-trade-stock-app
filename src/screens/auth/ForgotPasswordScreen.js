import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, ScrollView } from 'react-native'
import { TextInput } from 'react-native-paper';
import { styles, theme } from '../../constants/styles';
import colors from '../../constants/colors';
import ImagesUtil from '../../utils/Images';
import AuthService from '../../services/Auth';


const ForgotPasswordScreen = props => {

    const [email, setEmail] = useState(null);
    const brandImage = ImagesUtil.getBrandImage();
    const [isLoading, setIsLoading] = useState(false);

    const handleRecoverPassword = async () => {
        setIsLoading(true);
        const result = await AuthService.forgotPassword(email);
        if (result) {
            Alert.alert('Se envió un correo para resetear su password');
            props.navigation.navigate('Login');
        } else {
            Alert.alert('Ocurrió un error. Intente nuevamente o contáctese con Swallow Trade.');
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.container}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image style={styles.screenLogoLogin} resizeMode="contain" source={brandImage} />
                </View>
                <View style={{ width: '100%' }}>
                    <View style={{ fontFamily: 'OpenSans-Regular', textAlign: 'justify' }}>
                        <Text style={{ marginBottom: 20 }}>A continuación, ingrese su email y le enviaremos un correo para recuperar su contraseña.</Text>
                        <Text style={{ marginBottom: 20 }}>Tenga en cuenta que el email debe ser válido y debe estar asociado a una cuenta.</Text>
                    </View>
                    <TextInput
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        keyboardType={"email-address"}
                        label={'Email'}
                        value={email}
                        onChangeText={value => setEmail(value)}
                    />
                    <View style={{ width: '100%', marginTop: 40 }}>
                        <TouchableOpacity disabled={isLoading} style={isLoading ? styles.btnDisabled : styles.btnPrimary} onPress={handleRecoverPassword}>
                            <Text style={styles.btnTextWhite}>
                                {isLoading ?
                                    'ENVIANDO...'
                                    :
                                    'ENVIAR'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View >
    )
};

export default ForgotPasswordScreen;