import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, ScrollView } from 'react-native'
import { TextInput } from 'react-native-paper';
import { styles, theme } from '../../constants/styles';
import colors from '../../constants/colors';
import ImagesUtil from '../../utils/Images';
import AuthService from '../../services/Auth';

const ForgotPasswordScreen = props => {

    const { code } = props.route.params;
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const brandImage = ImagesUtil.getBrandImage();
    const [isLoading, setIsLoading] = useState(false);

    const handleSetNewPassword = async () => {
        setIsLoading(true);
        const result = await AuthService.setNewPassword(code, password, passwordConfirmation);
        if (result) {
            Alert.alert('Su contraseña se restauró con éxito.');
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
                    <TextInput
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        keyboardType={"default"}
                        label={'Nueva contraseña'}
                        value={password}
                        secureTextEntry
                        onChangeText={value => setPassword(value)}
                    />
                    <TextInput
                        style={styles.inputsStyle}
                        theme={theme}
                        underlineColor={colors.primaryDavysGray}
                        keyboardType={"default"}
                        label={'Confirmar nueva contraseña'}
                        value={passwordConfirmation}
                        secureTextEntry
                        onChangeText={value => setPasswordConfirmation(value)}
                    />
                    <View style={{ width: '100%', marginTop: 40 }}>
                        <TouchableOpacity disabled={isLoading} style={isLoading ? styles.btnDisabled : styles.btnPrimary} onPress={handleSetNewPassword}>
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