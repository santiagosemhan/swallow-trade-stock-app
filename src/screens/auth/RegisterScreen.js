import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useDispatch } from 'react-redux';
import { setLoggedIn } from "../../redux/auth/actions";
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../constants/styles';
import validate from '../../services/Validate';
import Installation from '../../services/Installation';
import colors from '../../constants/colors';
import Slugify from 'slugify';
import AuthService from './../../services/Auth';

const RegisterScreen = props => {

    const fields = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    };
    const [inputs, setInputs] = useState(fields);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();

    const checkErrors = errors => {
        for (item in errors) {
            if (errors[item] !== null) {
                console.log(item + ' => ' + errors[item]);
                throw { message: 'Revise los datos!' };
            }
        }
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

    const handlePasswordConfirm = (field, value) => {
        const errors = { ...errorMessages };
        errors[field] = '';
        if (value != inputs.password) {
            errors[field] = 'Las contraseñas deben coincidir';
        }
        setErrorMessages(errors);
        handleField(field, value);
    };

    const handlePressLogin = () => {
        props.navigation.navigate('Login');
    };

    const resetFields = () => {
        setInputs(fields);
    };

    const handleRegister = async () => {
        setIsloading(true);
        try {
            await AuthService.isSignedIn(dispatch);
            checkErrors();
            const userData = {
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                email: inputs.email,
                password: inputs.password,
                username: Slugify(`${inputs.firstName.charAt(0)} ${inputs.lastName}`, '_').toLowerCase(),
                confirmed: "true",
                empresa: "5f92c002d152a900173c39c6"
            };
            await AuthService.register(userData, dispatch);
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            console.log("Error: " + error.code + " " + error.message);
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.screen}>
            {isLoading ? <ActivityIndicator style={styles.screen} size={'large'} color={colors.accentLaurelGreen} /> :
                <ScrollView style={styles.container}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Image style={styles.screenLogoRegister} resizeMode="contain" source={require('../../../assets/img/example.jpg')} />
                    </View>
                    <View style={{ width: '100%' }}>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            label={'Nombre'}
                            value={inputs.firstName}
                            error={errorMessages.firstName}
                            onChangeText={value => handleInput('firstName', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.firstName}
                        >
                            {errorMessages.firstName}
                        </HelperText>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            label={'Apellido'}
                            value={inputs.lastName}
                            error={errorMessages.lastName}
                            onChangeText={value => handleInput('lastName', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.lastName}
                        >
                            {errorMessages.lastName}
                        </HelperText>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            keyboardType={"email-address"}
                            autoCapitalize={'none'}
                            label={'Email'}
                            value={inputs.email}
                            error={errorMessages.email}
                            onChangeText={value => handleInput('email', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.email}
                        >
                            {errorMessages.email}
                        </HelperText>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            secureTextEntry
                            underlineColor={colors.primaryDavysGray}
                            autoCapitalize={'none'}
                            label={'Contraseña'}
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
                            secureTextEntry
                            underlineColor={colors.primaryDavysGray}
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
                        <View style={{ width: '100%', marginTop: 40 }}>
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
                                <Text style={styles.btnTextWhite}>
                                    REGISTRARME
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ ...styles.infoContainer, marginBottom: 70 }}>
                        <Text style={styles.infoText}>¿Ya tenés cuenta? <Text style={styles.infoTextLink} onPress={handlePressLogin}>Iniciar sesión</Text></Text>
                    </View>
                </ScrollView>
            }
        </View >
    )
};

export default RegisterScreen;