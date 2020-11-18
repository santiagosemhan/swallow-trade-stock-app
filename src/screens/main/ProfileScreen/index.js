import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Entypo } from 'react-native-vector-icons';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import { theme, styles } from '../../../constants/styles';
import ImagerPicker from './../../../components/form/ImagePicker';
import AuthorizedScreen from '../../../components/auth/AuthorizedScreen';
import AuthService from '../../../services/Auth';
import ApiService from './../../../services/Api';

const ProfileScreen = props => {

    const fields = {
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
    };
    const [inputs, setInputs] = useState(fields);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfilePhoto, setUserProfilePhoto] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const storageUser = await AsyncStorage.getItem('user');
            const user = JSON.parse(storageUser);
            setInputs({
                ...inputs,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            })
        } catch (err) {
            console.log('Error!! ' + err);
        }
        setIsLoading(false);
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

    const resetFields = () => {
        setUserProfilePhoto(null);
        setInputs(fields);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

    const handleChangePassword = () => {
        props.navigation.navigate('ChangePassword');
    };

    const handleLogOut = async () => {
        await AuthService.logout(dispatch);
    };

    const handleTakenImage = async (image) => {
        setUserProfilePhoto(image);
        if (image) {
            try{
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
                    Alert.alert('Avatar actualizado con éxito.');
                }
            }catch(error){
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
                Alert.alert('Stock cargado con éxito.');
            }
        } catch (error) {
            console.log(error.response);
        }
        setIsLoading(false);
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
                            <ImagerPicker
                                aspect={[1, 1]}
                                onRequestClose={() => setShowImagePicker(false)}
                                show={handleShowImagePicker}
                                visible={showImagePicker}
                                takenImage={handleTakenImage}
                            />
                            <View style={styles.avatarContainer}>
                                {userProfilePhoto ?
                                    <Avatar
                                        size={120}
                                        rounded
                                        onPress={() => setShowImagePicker(true)}
                                        activeOpacity={0.5}
                                        showEditButton
                                        source={{ uri: userProfilePhoto.uri }}
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
                            {/* <TouchableOpacity onPress={handleChangePassword} style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo style={{}} name={'lock'} size={16} color={colors.primaryDavysGray} />
                                <Text style={{ ...styles.infoTextLink, marginLeft: 5, color: colors.primaryDavysGray, fontFamily: 'NunitoSans-Regular' }}>Cambiar contraseña</Text>
                            </TouchableOpacity> */}
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
                            <TextInput
                                editable={false}
                                style={styles.inputsStyle}
                                theme={theme}
                                underlineColor={colors.primaryDavysGray}
                                autoCapitalize={'none'}
                                label={'Apodo'}
                                value={inputs.username}
                                error={errorMessages.username}
                                onChangeText={value => handleInput('username', value)}
                            />
                            <HelperText
                                type="error"
                                visible={errorMessages.username}
                            >
                                {errorMessages.username}
                            </HelperText>
                            <TextInput
                                editable={false}
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