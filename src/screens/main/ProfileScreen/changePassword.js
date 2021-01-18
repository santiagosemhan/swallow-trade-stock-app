import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, ScrollView, ActivityIndicator } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../../constants/styles';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import ApiService from './../../../services/Api';

const ChangePasswordScreen = props => {

    const fields = {
        id: props.route.params.id,
        password: '',
        passwordConfirm: ''
    };
    const [inputs, setInputs] = useState(fields);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);

    const checkErrors = () => {
        let errors = { ...errorMessages };
        for (const [key, value] of Object.entries(inputs)) {
            errors[key] = validate(key, value);
        }
        setErrorMessages(errors);
        for (const [key, value] of Object.entries(errors)) {
            if (errors[key] !== null) {
                throw new Error(errors[key]);
            }
        }
        return false;
    };

    const handleError = (field, value) => {
        const errors = { ...errorMessages };
        errors[field] = validate(field, value);
        setErrorMessages(errors);
    };

    const handleField = (field, value) => {
        const updateData = { ...inputs };
        updateData[field] = value;
        setInputs(updateData);
    };

    const handleInput = (field, value) => {
        handleError(field, value);
        handleField(field, value);
    };

    const resetFields = () => {
        setInputs(fields);
    };

    const handlePasswordConfirm = (field, value) => {
        const errors = { ...errorMessages };
        errors[field] = '';
        if (value != inputs.password) {
            errors[field] = 'Las contraseñas deben coincidir';
        }
        setErrorMessages(errors);
        handleField(field, value);
    };

    const handleCancel = () => {
        props.navigation.goBack();
    };

    const handleChangePassword = async () => {
        setIsloading(true);
        try {
            checkErrors();
            const result = await ApiService.put(`/users/${inputs.id}`, { password: inputs.password });
            console.log(result);
            resetFields();
            setIsloading(false);
            Alert.alert('Contraseña cambiada');
            props.navigation.goBack();
        } catch (error) {
            setIsloading(false);
            console.log(error);
            if (error.code && error.code === 101) {
                Alert.alert('Error', 'Su contraseña actual es incorrecta.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    return (
        <View style={styles.screen}>
            {isLoading ? <ActivityIndicator style={styles.screen} size={'large'} color={colors.bs.primary} /> :
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ ...styles.headerIcons, padding: 20, paddingLeft: 7 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                                    Cambiar contraseña
                                    </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', padding: 20 }}>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            keyboardType={"default"}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                            label={'Contraseña nueva'}
                            value={inputs.password}
                            error={errorMessages.password}
                            onChangeText={value => handleInput('password', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.password}
                        >
                            {errorMessages.password}
                        </HelperText>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            keyboardType={"default"}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                            label={'Confirmar contraseña'}
                            value={inputs.passwordConfirm}
                            error={errorMessages.passwordConfirm}
                            onChangeText={value => handlePasswordConfirm('passwordConfirm', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.passwordConfirm}
                        >
                            {errorMessages.passwordConfirm}
                        </HelperText>
                        <View style={{ width: '100%', marginTop: 20 }}>
                            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleChangePassword}>
                                <Text style={{ ...styles.btnTextWhite, letterSpacing: 0, fontSize: 16 }}>
                                    Cambiar contraseña
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleCancel}>
                        <Text style={{ ...styles.infoTextLink, color: colors.primaryDavysGray, fontFamily: 'OpenSans-Regular' }}>Cancelar</Text>
                    </TouchableOpacity>
                </ScrollView>
            }
        </View >
    )
};

export default ChangePasswordScreen;