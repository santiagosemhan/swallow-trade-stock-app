import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions, ScrollView, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../../constants/styles';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import ApiService from './../../../services/Api';
import ImagerPicker from './../../../components/form/ImagePicker';
import { Entypo, Feather } from '@expo/vector-icons';
import FormData from 'form-data';
import { thicknesses, heights, qualities, stockVolumes, widths } from './data';

const HomeScreen = props => {

    const fields = {
        category: null,
        thickness: null,
        width: null,
        height: null,
        quality: null,
        stockVolume: null,
        species: null,
        stockQuantity: '',
        comments: '',
    };
    const [inputs, setInputs] = useState(fields);
    const [categories, setCategories] = useState([]);
    const [species, setSpecies] = useState([]);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);
    const [postImage, setPostImage] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const navigation = useNavigation();
    const { currentTab } = useSelector(state => state.navigation);
    const screenHeight = Dimensions.get('window').height - 50;

    const fetchData = React.useCallback(
        async () => {
            resetFields();
            try {
                const [categoriesResult, speciesResult] = await Promise.all([
                    ApiService.get('productos'),
                    ApiService.get('especies')
                ]);
                if (currentTab === 'home') {
                    setCategories(categoriesResult.data);
                    setSpecies(speciesResult.data);
                }
            } catch (error) {
                console.log('HomeScreen - fetchData Error:', error);
            }
        }, [currentTab]
    );

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
        setErrorMessages(fields);
        setInputs(fields);
        setPostImage(null);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(fetchData, 500);
        });
        return unsubscribe;
    }, [navigation]);

    const handleTakenImage = (image) => {
        setPostImage(image);
    };

    const handleShowImagePicker = show => {
        setShowImagePicker(show);
    };

    const handleCancelPhoto = () => {
        setPostImage(null);
    };

    const handleSend = async () => {
        setIsloading(true);
        try {
            checkErrors();
            let image = null;
            if (postImage) {
                const fileName = postImage.uri.match(/\/([a-zA-Z0-9\-.]+\.[\w]+)$/i)[1];
                const extension = postImage.uri.match(/\.([0-9a-z]+)$/i)[1];
                const formData = new FormData();
                formData.append(
                    'files',
                    { uri: postImage.uri, name: fileName, type: `image/${extension}` },
                );
                const imageResponse = await ApiService.post(`/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                image = imageResponse.data && imageResponse.data[0].id ? imageResponse.data[0].id : null;
            }
            const data = {
                producto: inputs.category,
                espesor: inputs.thickness,
                ancho: inputs.width,
                largo: inputs.height,
                calidad: inputs.quality,
                volumen_stock: inputs.stockVolume,
                cantidad: inputs.stockQuantity,
                especie: inputs.species,
                comentarios: inputs.comments,
                imagenes: [image],
            };
            const result = await ApiService.post('stocks', data);
            resetFields();
            if (result.status == 200) {
                Alert.alert('Stock cargado con éxito.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            console.log(error.response);
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ ...styles.headerIcons, paddingHorizontal: 20, paddingTop: 20, paddingLeft: 7 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                                Cargar stock
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%' }}>
                    <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 14, color: colors.primaryGunMetal, paddingHorizontal: 20, paddingTop: 40 }}>
                        Complete el formulario para notificar del stock disponible a Swallow Trade. Los campos marcados con (*) son obligatorios.
                    </Text>
                </View>
                {isLoading ? <ActivityIndicator style={{ height: screenHeight }} size={'large'} color={colors.bs.primary} /> :
                    <View style={{ width: '100%', padding: 15 }}>
                        <ImagerPicker
                            aspect={[1, 1]}
                            onRequestClose={() => setShowImagePicker(false)}
                            show={handleShowImagePicker}
                            visible={showImagePicker}
                            takenImage={handleTakenImage}
                        />
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.category ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.category ? colors.bs.primary : colors.primaryDavysGray }}>Categoría</Text>
                            {categories &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('category', value)}
                                    value={inputs.category}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={categories.map(item => ({ key: item.id, label: item.nombre, value: item.id }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.category}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.thickness ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.thickness ? colors.bs.primary : colors.primaryDavysGray }}>Espesor</Text>
                            {thicknesses &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('thickness', value)}
                                    value={inputs.thickness}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={thicknesses.map(item => ({ label: item.name, value: item.name }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.thickness}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.width ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.width ? colors.bs.primary : colors.primaryDavysGray }}>Ancho</Text>
                            {widths &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('width', value)}
                                    value={inputs.width}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={widths.map(item => ({ label: item.name, value: item.name }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.width}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.height ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.height ? colors.bs.primary : colors.primaryDavysGray }}>Largo</Text>
                            {heights &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('height', value)}
                                    value={inputs.height}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={heights.map(item => ({ label: item.name, value: item.name }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.height}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.quality ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.quality ? colors.bs.primary : colors.primaryDavysGray }}>Calidad</Text>
                            {qualities &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('quality', value)}
                                    value={inputs.quality}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={qualities.map(item => ({ label: item.name, value: item.name }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.quality}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.stockVolume ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.stockVolume ? colors.bs.primary : colors.primaryDavysGray }}>Volumen de stock</Text>
                            {stockVolumes &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('stockVolume', value)}
                                    value={inputs.stockVolume}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={stockVolumes.map(item => ({ label: item.name, value: item.name }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.stockVolume}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.species ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.species ? colors.bs.primary : colors.primaryDavysGray }}>Especie</Text>
                            {species &&
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={value => handleInput('species', value)}
                                    value={inputs.species}
                                    placeholder={{ key: null, label: 'Seleccionar un item...', value: null }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
                                        placeholder: {},
                                    }}
                                    items={species.map(item => ({ key: item.id, label: item.nombre, value: item.id }))}
                                />
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.species}</Text>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            underlineColor={colors.primaryDavysGray}
                            autoCapitalize={'none'}
                            keyboardType={'numeric'}
                            label={'Cantidad Stock'}
                            value={inputs.stockQuantity}
                            error={errorMessages.stockQuantity}
                            onChangeText={value => handleInput('stockQuantity', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.stockQuantity}
                        >
                            {errorMessages.stockQuantity}
                        </HelperText>
                        <TextInput
                            style={styles.inputsStyle}
                            theme={theme}
                            numberOfLines={4}
                            multiline={true}
                            underlineColor={colors.primaryDavysGray}
                            autoCapitalize={'none'}
                            label={'Comentarios'}
                            value={inputs.comments}
                            error={errorMessages.comments}
                            onChangeText={value => handleInput('comments', value)}
                        />
                        <HelperText
                            type="error"
                            visible={errorMessages.comments}
                        >
                            {errorMessages.comments}
                        </HelperText>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ ...styles.pickerTitle, color: colors.primaryDavysGray }}>Si desea puede añadir una foto de su teléfono o capturar una foto haciendo click en el siguiente botón.</Text>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                {postImage ?
                                    <View style={{ position: 'relative' }}>
                                        <TouchableOpacity onPress={handleCancelPhoto} style={{ position: 'absolute', top: 20, right: 20, zIndex: 999 }}>
                                            <Entypo name={'circle-with-cross'} size={20} color={colors.bs.primary} />
                                        </TouchableOpacity>
                                        <Image style={{ resizeMode: 'contain', borderRadius: 100, padding: 20, margin: 20, width: 120, height: 120 }} source={{ uri: postImage.uri }} />
                                    </View>
                                    :
                                    <TouchableOpacity style={{ margin: 20, borderWidth: 1, borderColor: colors.primaryGunMetal, borderRadius: 100, borderWidth: 3, borderColor: colors.bs.primary, padding: 40 }} onPress={() => handleShowImagePicker(true)}>
                                        <Feather name={'camera'} size={40} color={colors.bs.primary} />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{ width: '100%', marginTop: 0, marginBottom: 10 }}>
                            <TouchableOpacity style={{}} onPress={resetFields}>
                                <Text style={{ color: colors.bs.primary, fontSize: 20, textDecorationLine: 'underline', marginBottom: 15, textAlign: 'center' }}>
                                    Borrar formulario
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleSend}>
                                <Text style={{ ...styles.btnTextWhite, fontSize: 18, letterSpacing: 2 }}>
                                    GUARDAR STOCK
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </ScrollView>
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

export default HomeScreen;