import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from 'react-native-vector-icons';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import { theme, styles } from '../../../constants/styles';
import ImagerPicker from './../../../components/form/ImagePicker';
import AuthorizedScreen from '../../../components/auth/AuthorizedScreen';
import AuthService from '../../../services/Auth';
import ApiService from './../../../services/Api';
import env from './../../../../env';

const ProfileScreen = props => {

    const userState = useSelector(state => state.user);
    const fields = {
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
    };
    const [inputs, setInputs] = useState({
        id: userState.id,
        firstName: userState.firstName,
        lastName: userState.lastName,
        email: userState.email,
        username: userState.username,
    });
    const [errorMessages, setErrorMessages] = useState(fields);
    const [userProfilePhoto, setUserProfilePhoto] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const stateAvatar = userState.avatar ? env.BASE_URL + 'files/' + userState.avatar.name : null;
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const response = await ApiService.get(`users/me`);
            const user = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            const updatedInputs = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };
            setInputs(updatedInputs);
            setUserProfilePhoto(user.avatar ? env.BASE_URL + 'files/' + user.avatar.name : null);
        } catch (error) {
            console.log(error.response);
        };
    };

    useEffect(() => {
        const updatedInputs = {
            id: userState.id,
            firstName: userState.firstName,
            lastName: userState.lastName,
            email: userState.email,
            username: userState.username,
        };
        setInputs(updatedInputs);
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            await fetchData();
        });
        return unsubscribe;
    }, [props.navigation]);

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

    const handleChangePassword = () => {
        props.navigation.navigate('ChangePassword', { id: inputs.id });
    };

    const handleLogOut = async () => {
        await AuthService.logout(dispatch);
    };

    const handleTakenImage = async (image) => {
        setUserProfilePhoto(image.uri);
        if (image) {
            try {
                const fileName = image.uri.match(/\/([a-zA-Z0-9\-.]+\.[\w]+)$/i)[1];
                const extension = image.uri.match(/\.([0-9a-z]+)$/i)[1];
                const formData = new FormData();
                formData.append(
                    'files',
                    { uri: image.uri, name: fileName, type: `image/${extension}` },
                );
                const imageResponse = await ApiService.post(`/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                const avatarId = imageResponse.data && imageResponse.data[0].id ? imageResponse.data[0].id : null;
                const result = await ApiService.put(`/users/${inputs.id}`, { avatar: avatarId });
                if (result.status == 200) {
                    console.log('Avatar actualizado');
                } else {
                    console.log('No se pudo actualizar el avatar.');
                }
                fetchData();
            } catch (error) {
                console.log(error.response);
            }
        }
    };

    const handleShowImagePicker = show => {
        setShowImagePicker(show);
    };

    const handleSaveButton = async () => {
        setIsLoading(true);
        try {
            checkErrors();
            const data = {
                firstName: inputs.firstName,
                lastName: inputs.lastName,
            };
            const result = await ApiService.put(`/users/${inputs.id}`, data);
            if (result.status == 200) {
                fetchData();
            }
        } catch (error) {
            console.log(error.response);
        }
        setIsLoading(false);
    };

    return (
        <AuthorizedScreen>
            <View style={styles.screen}>
                <ScrollView style={{ flex: 1 }} >
                    <View style={{ ...styles.headerIcons, paddingHorizontal: 20, paddingTop: 20, paddingLeft: 7 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                                    Mi perfil
                                    </Text>
                                <TouchableOpacity onPress={handleChangePassword} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Entypo style={{}} name={'key'} size={24} color={'black'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputsContainer}>
                        <ImagerPicker
                            aspect={[1, 1]}
                            onRequestClose={() => setShowImagePicker(false)}
                            show={handleShowImagePicker}
                            visible={showImagePicker}
                            takenImage={handleTakenImage}
                        />
                        <View style={styles.avatarContainer}>
                            {userProfilePhoto || stateAvatar ?
                                <Avatar
                                    size={120}
                                    rounded
                                    onPress={() => setShowImagePicker(true)}
                                    activeOpacity={0.5}
                                    showEditButton
                                    source={{ uri: userProfilePhoto }}
                                    containerStyle={styles.avatar}
                                />
                                :
                                <Avatar
                                    size={120}
                                    rounded
                                    icon={{ name: 'user', type: 'font-awesome' }}
                                    onPress={() => setShowImagePicker(true)}
                                    activeOpacity={0.5}
                                    showEditButton
                                    containerStyle={styles.avatar}
                                />
                            }
                        </View>
                        <TextInput
                            disabled={true}
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
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
                            underlineColor={colors.primaryDavysGray}
                            autoCapitalize={'none'}
                            label={'Nombre/s'}
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
                            autoCapitalize={'none'}
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
                        <TouchableOpacity disabled={isLoading} onPress={handleSaveButton} style={styles.actionBtnPrimary}>
                            <Text style={styles.actionBtnText}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogOut} style={styles.actionBtnEndSession}>
                            <Text style={{ ...styles.actionBtnText, color: '#1c1c1c' }}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View >
        </AuthorizedScreen>
    );
};

export default ProfileScreen;