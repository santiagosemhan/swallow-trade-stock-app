import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../constants/styles';
import validate from '../../services/Validate';
import colors from '../../constants/colors';
import ImagesUtil from '../../utils/Images';
import Slugify from 'slugify';
import AuthService from './../../services/Auth';
import ApiService from './../../services/Api';

const RegisterScreen = props => {

    const fields = {
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        password: '',
        passwordConfirm: ''
    };
    const [inputs, setInputs] = useState(fields);
    const [companies, setCompanies] = useState(null);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();
    const brandImage = ImagesUtil.getBrandImage();

    const fetchData = async () => {
        try {
            const result = await ApiService.get('companies');
            if (result && result.data) {
                const data = {
                    ...inputs,
                    company: result.data[1].id,
                }
                const sortedData = result.data.sort((a, b) => a.name > b.name);
                setInputs(data);
                setCompanies(result.data);
            }
        } catch (error) {
            console.log('RegisterScreen - fetchData Error:', error);
        }
    };

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

    useEffect(() => {
        fetchData();
    }, []);

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
                company: inputs.company
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
            {isLoading ? <ActivityIndicator style={styles.screen} size={'large'} color={colors.bs.primary} /> :
                <ScrollView style={styles.container}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Image style={styles.screenLogoRegister} resizeMode="contain" source={brandImage} />
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
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTitle}>Empresa</Text>
                            {companies ?
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('company', value)}
                                    itemKey={inputs.company}
                                    value={inputs.company}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={companies.map(company => ({ key: company.id, label: company.name, value: company.id }))}
                                /> :
                                <View></View>
                            }
                        </View>
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

const customStyles = StyleSheet.create({
    pickerContainer: {
        borderBottomColor: '#c6c6c6',
        borderBottomWidth: 1.35,
    },
    picker: {
        marginLeft: 15,
    },
    label: {
        color: colors.primaryDavysGray,
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 12,
        fontSize: 18,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 17,
        paddingVertical: 10,
        // paddingHorizontal: 10,
        // borderWidth: 1,
        // borderColor: 'gray',
        // borderRadius: 4,
        // color: 'black',
        // paddingRight: 30, // to ensure the text is never behind the icon
        paddingLeft: 13,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default RegisterScreen;