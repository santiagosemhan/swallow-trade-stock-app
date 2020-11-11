import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Parse } from 'parse/react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Entypo } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Input from '../../../components/form/Input';
import MapPicker from '../../../components/address/MapPicker';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import { styles } from '../../../constants/styles';
import AuthorizedScreen from '../../../components/auth/AuthorizedScreen';
import AuthService from '../../../services/Auth';

const ProfileScreen = props => {

    const fields = {
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
    };

    const [inputs, setInputs] = useState(fields);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [userAccount, setUserAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfilePhoto, setUserProfilePhoto] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            //TODO: Load all data
            //TODO: Set data in the fields
        } catch (err) {
            console.log('Error!! ' + err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

    const hasErrors = errors => {
        for (const [key, value] of Object.entries(errors)) {
            if (errors[key] !== null) {
                return true;
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

    const handleChangePassword = () => {
        props.navigation.navigate('ChangePassword');
    };

    const handleSaveButton = async () => {
        setIsLoading(true);
        try {
            //TODO: Save all info
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (result.status !== 'granted') {
            Alert.alert('Permisos insuficientes.', 'Se debe dar permiso a la cámara para efectuar la operación.', [{ text: 'Ok' }]);
            return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        try {
            const hasPermission = await verifyPermissions();
            if (!hasPermission) {
                return;
            }
            const image = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.2,
                base64: true,
            });
            if (!image.cancelled) {
                setUserProfilePhoto(`data:image/jpeg;base64,${image.base64}`);
                const dateInMillis = new Date().getTime();
                const fileName = `${dateInMillis}_${inputs.firstName}_${inputs.lastName}.jpg`;
                const profilePhoto = new Parse.File(fileName, { base64: image.base64 });
                userAccount.set('profilePhoto', profilePhoto);
                setUserAccount(userAccount);
                //TODO: Save account
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleLogOut = async () => {
        await AuthService.logout(dispatch);
    };

    return (
        <AuthorizedScreen>
            <View style={styles.screen}>
                {isLoading ? <ActivityIndicator style={{ flex: 1 }} size={'large'} color={colors.primaryOldMossGreen} /> :
                    <ScrollView style={{ flex: 1 }} >
                        <View style={{ ...styles.headerIcons, paddingHorizontal: 20, paddingTop: 20, paddingLeft: 7 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                                        Mi perfil
                                    </Text>
                                    <TouchableOpacity onPress={handleChangePassword} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Entypo style={{}} name={'key'} size={24} color={'black'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputsContainer}>
                            <View style={styles.avatarContainer}>
                                {!userProfilePhoto ?
                                    <Avatar
                                        size={120}
                                        rounded
                                        icon={{ name: 'user', type: 'font-awesome' }}
                                        onPress={takeImageHandler}
                                        activeOpacity={0.5}
                                        showEditButton
                                        containerStyle={styles.avatar}
                                    />
                                    :
                                    <Avatar
                                        size={120}
                                        rounded
                                        onPress={takeImageHandler}
                                        activeOpacity={0.5}
                                        showEditButton
                                        source={{ uri: userProfilePhoto }}
                                        containerStyle={styles.avatar}
                                    />
                                }
                            </View>
                            {/* <TouchableOpacity onPress={handleChangePassword} style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo style={{}} name={'lock'} size={16} color={colors.primaryDavysGray} />
                                <Text style={{ ...styles.infoTextLink, marginLeft: 5, color: colors.primaryDavysGray, fontFamily: 'NunitoSans-Regular' }}>Cambiar contraseña</Text>
                            </TouchableOpacity> */}
                            <Input
                                label={'Nombre/s'}
                                style={styles.input}
                                blurOnSubmit
                                keyboardType={'default'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                value={inputs.firstName}
                                error={errorMessages.firstName}
                                onChangeText={value => handleInput('firstName', value)}
                            />
                            <Input
                                label={'Apellidos/s'}
                                style={styles.input}
                                blurOnSubmit
                                keyboardType={'default'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                value={inputs.lastName}
                                error={errorMessages.lastName}
                                onChangeText={value => handleInput('lastName', value)}
                            />
                            <Input
                                label={'Apodo'}
                                style={styles.input}
                                blurOnSubmit
                                keyboardType={'default'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                value={inputs.nickname}
                                error={errorMessages.nickname}
                                onChangeText={value => handleInput('nickname', value)}
                            />
                            <Input
                                label={'Email'}
                                style={styles.input}
                                blurOnSubmit
                                editable={false}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                value={inputs.email}
                                error={errorMessages.email}
                                onChangeText={value => handleInput('email', value)}
                            />                            
                            {/* <TouchableOpacity onPress={handleChangePassword} style={styles.changePassword}>
                                <Text>Cambiar contraseña</Text>
                                <MaterialIcons name={'chevron-right'} size={36} color={colors.primaryOldMossGreen} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={handleSaveButton} style={styles.actionBtnPrimary}>
                                <Text style={styles.actionBtnText}>Guardar cambios</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogOut} style={styles.actionBtnEndSession}>
                                <Text style={{ ...styles.actionBtnText, color: '#1c1c1c' }}>Cerrar sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
            </View >
        </AuthorizedScreen>
    );
};

export default ProfileScreen;