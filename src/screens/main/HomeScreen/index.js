import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../../constants/styles';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import ApiService from './../../../services/Api';
import ImagerPicker from './../../../components/form/ImagePicker';
import { Entypo } from '@expo/vector-icons';
import FormData from 'form-data';
import { thicknesses, heights, qualities, stockVolumes, widths } from './data';

const HomeScreen = props => {

    const fields = {
        category: '',
        thickness: '',
        width: '',
        height: '',
        quality: '',
        stockVolume: '',
        species: '',
        stockQuantity: '',
        comments: '',
    };
    const [inputs, setInputs] = useState(fields);
    const [categories, setCategories] = useState(null);
    const [species, setSpecies] = useState(null);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);
    const [postImage, setPostImage] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const navigation = useNavigation();
    const screenHeight = Dimensions.get('window').height - 50;

    const fetchData = async () => {
        resetFields();
        try {
            const categoriesResult = await ApiService.get('productos');
            const speciesResult = await ApiService.get('especies');
            setCategories(categoriesResult.data);
            setSpecies(speciesResult.data);
        } catch (error) {
            console.log('HomeScreen - fetchData Error:', error);
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

    const resetFields = () => {
        setPostImage(null);
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
                image = imageResponse.data && imageResponse.data[0].id ? imageResponse.data[0].id : null
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
                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 26, paddingLeft: 10 }}>
                                Cargar stock
                                    </Text>
                        </View>
                    </View>
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
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ ...styles.pickerTitle, color: postImage ? colors.bs.primary : colors.primaryDavysGray }}>{postImage ? 'Foto' : 'Tomar foto'}</Text>
                            <View style={{ width: '100%', alignItems: 'flex-start', maxHeight: 150 }}>
                                {postImage ?
                                    <View style={{ position: 'relative' }}>
                                        <TouchableOpacity onPress={handleCancelPhoto} style={{ position: 'absolute', top: 20, right: 20, zIndex: 999 }}>
                                            <Entypo name={'circle-with-cross'} size={20} color={colors.primaryDavysGray} />
                                        </TouchableOpacity>
                                        <Image style={{ resizeMode: 'contain', borderRadius: 2, padding: 20, margin: 20, width: 120, height: 120 }} source={{ uri: postImage.uri }} />
                                    </View>
                                    :
                                    <TouchableOpacity style={{ margin: 20, borderWidth: 1, borderColor: colors.primaryGunMetal, borderRadius: 4 }} onPress={() => handleShowImagePicker(true)}>
                                        <Image style={{ resizeMode: 'contain', borderRadius: 2, padding: 20, margin: 20, width: 75, height: 75 }} source={require('./../../../../assets/img/camera.png')} />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.category ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.category ? colors.bs.primary : colors.primaryDavysGray }}>Categoría</Text>

                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.category}
                                onValueChange={value => handleInput('category', value)}
                            >
                                <Picker.Item key={'category_id'} label={'Seleccione una opción...'} value={null} />
                                {categories && categories.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                                    );
                                })}
                            </Picker>
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.category}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.thickness ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.thickness ? colors.bs.primary : colors.primaryDavysGray }}>Espesor</Text>
                            {thicknesses &&
                                <Picker style={styles.pickerSelector}
                                    selectedValue={inputs.thickness}
                                    onValueChange={value => handleInput('thickness', value)}
                                >
                                    {thicknesses.map(item => {
                                        return (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        );
                                    })}
                                </Picker>
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.thickness}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.width ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.width ? colors.bs.primary : colors.primaryDavysGray }}>Ancho</Text>
                            {widths &&
                                <Picker style={styles.pickerSelector}
                                    selectedValue={inputs.width}
                                    onValueChange={value => handleInput('width', value)}
                                >
                                    {widths
                                        .map(item => {
                                            return (
                                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                                            );
                                        })}
                                </Picker>
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.width}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.height ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.height ? colors.bs.primary : colors.primaryDavysGray }}>Largo</Text>
                            {heights &&
                                <Picker style={styles.pickerSelector}
                                    selectedValue={inputs.height}
                                    onValueChange={value => handleInput('height', value)}
                                >
                                    {heights.map(item => {
                                        return (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        );
                                    })}
                                </Picker>
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.height}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.quality ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.quality ? colors.bs.primary : colors.primaryDavysGray }}>Calidad</Text>
                            {qualities &&
                                <Picker style={styles.pickerSelector}
                                    selectedValue={inputs.quality}
                                    onValueChange={value => handleInput('quality', value)}
                                >
                                    {qualities.map(item => {
                                        return (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        );
                                    })}
                                </Picker>
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.quality}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.stockVolume ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.stockVolume ? colors.bs.primary : colors.primaryDavysGray }}>Volumen de stock</Text>
                            {stockVolumes &&
                                <Picker style={styles.pickerSelector}
                                    selectedValue={inputs.stockVolume}
                                    onValueChange={value => handleInput('stockVolume', value)}
                                >
                                    {stockVolumes.map(item => {
                                        return (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        );
                                    })}
                                </Picker>
                            }
                        </View>
                        <Text style={{ marginLeft: 7, color: 'red', fontSize: 12 }}>{errorMessages.stockVolume}</Text>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.species ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.species ? colors.bs.primary : colors.primaryDavysGray }}>Especie</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.species}
                                onValueChange={value => handleInput('species', value)}
                            >
                                <Picker.Item key={'species_id'} label={'Seleccione una opción...'} value={null} />
                                {species && species.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                                    );
                                })}
                            </Picker>
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
                        <View style={{ width: '100%', marginTop: 20, marginBottom: 10 }}>
                            <TouchableOpacity style={{}} onPress={resetFields}>
                                <Text style={{ color: colors.bs.primary, fontSize: 20, textDecorationLine: 'underline', marginBottom: 15, textAlign: 'center' }}>
                                    Cancelar
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleSend}>
                                <Text style={styles.btnTextWhite}>
                                    AGREGAR
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </ScrollView>
        </View >
    )
};

export default HomeScreen;