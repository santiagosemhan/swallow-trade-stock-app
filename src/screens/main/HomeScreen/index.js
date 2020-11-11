import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-community/picker';
import { TextInput, HelperText } from 'react-native-paper';
import { styles, theme } from '../../../constants/styles';
import validate from '../../../services/Validate';
import colors from '../../../constants/colors';
import ApiService from './../../../services/Api';

import Constants from 'expo-constants'

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
        comments: ''
    };
    const [inputs, setInputs] = useState(fields);
    const [categories, setCategories] = useState(null);
    const [thicknesses, setThicknesses] = useState(null);
    const [widths, setWidths] = useState(null);
    const [heights, setHeights] = useState(null);
    const [qualities, setQualities] = useState(null);
    const [species, setSpecies] = useState(null);
    const [stockVolumes, setStockVolumes] = useState(null);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);

    const dummyThicknesses = [
        { id: null, name: 'Seleccione una opción...' },
        { id: '1/2', name: '1/2"' },
        { id: '3/4', name: '3/4"' },
        { id: '1', name: '1"' },
        { id: '1.5', name: '1.5"' },
    ];

    const dummyWidths = [
        { id: null, name: 'Seleccione una opción...' },
        { id: '2', name: '2"' },
        { id: '3', name: '3"' },
        { id: '4', name: '4"' },
        { id: '5', name: '5"' },
        { id: '6', name: '6"' },
        { id: '7', name: '7' },
        { id: '8', name: '8"' },
        { id: '10', name: '10"' },
        { id: '12', name: '12"' },
    ];

    const dummyHeights = [
        { id: null, name: 'Seleccione una opción...' },
        { id: '6', name: '6"' },
        { id: '8', name: '8"' },
        { id: '10', name: '10"' },
        { id: '12', name: '12"' },
        { id: '14', name: '14"' },
        { id: '16', name: '16"' },
        { id: '18', name: '18"' },
    ];

    const dummyQualities = [
        { id: null, name: 'Seleccione una opción...' },
        { id: 'Primera', name: 'Primera' },
        { id: 'Segunda', name: 'Segunda' },
        { id: 'Tercera', name: 'Tercera' },
    ];

    const dummyStocVolumes = [
        { id: null, name: 'Seleccione una opción...' },
        { id: 'Pie', name: 'Pie' },
        { id: 'M3', name: 'm3' },
    ];

    const fetchData = async () => {
        setIsloading(true);
        try {
            const speciesResult = await ApiService.get('especies');
            const categoriesResult = await ApiService.get('productos');
            setCategories(categoriesResult.data);
            setThicknesses(dummyThicknesses);
            setWidths(dummyWidths);
            setHeights(dummyHeights);
            setQualities(dummyQualities);
            setSpecies(speciesResult.data);
            setStockVolumes(dummyStocVolumes);
        } catch (error) {
            console.log('HomeScreen - fetchData Error:', error);
        }
        setIsloading(false);
    };

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

    const resetFields = () => {
        setInputs(fields);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSend = async () => {
        setIsloading(true);
        try {
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
            };
            const result = await ApiService.post('stocks', data);
            resetFields();
            setIsloading(false);
            if(result.status == 200){
                Alert.alert('Stock cargado con éxito.');
            }            
        } catch (error) {
            setIsloading(false);
            console.log(error.response);
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.screen}>
            {isLoading ? <ActivityIndicator style={styles.screen} size={'large'} color={colors.bs.primary} /> :
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
                    <View style={{ width: '100%', padding: 15 }}>
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
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.thickness ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.thickness ? colors.bs.primary : colors.primaryDavysGray }}>Espesor</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.thickness}
                                onValueChange={value => handleInput('thickness', value)}
                            >
                                {thicknesses && thicknesses.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    );
                                })}
                            </Picker>
                        </View>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.width ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.width ? colors.bs.primary : colors.primaryDavysGray }}>Ancho</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.width}
                                onValueChange={value => handleInput('width', value)}
                            >
                                {widths && widths
                                    .map(item => {
                                        return (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        );
                                    })}
                            </Picker>
                        </View>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.height ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.height ? colors.bs.primary : colors.primaryDavysGray }}>Largo</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.height}
                                onValueChange={value => handleInput('height', value)}
                            >
                                {heights && heights.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    );
                                })}
                            </Picker>
                        </View>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.quality ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.quality ? colors.bs.primary : colors.primaryDavysGray }}>Calidad</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.quality}
                                onValueChange={value => handleInput('quality', value)}
                            >
                                {qualities && qualities.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    );
                                })}
                            </Picker>
                        </View>
                        <View style={{ ...styles.pickerContainer, borderBottomColor: inputs.stockVolume ? colors.bs.primary : '#9a9a9a' }}>
                            <Text style={{ ...styles.pickerTitle, color: inputs.stockVolume ? colors.bs.primary : colors.primaryDavysGray }}>Volumen de stock</Text>
                            <Picker style={styles.pickerSelector}
                                selectedValue={inputs.stockVolume}
                                onValueChange={value => handleInput('stockVolume', value)}
                            >
                                {stockVolumes && stockVolumes.map(item => {
                                    return (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    );
                                })}
                            </Picker>
                        </View>
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
                            visible={errorMessages.passwordConfirm}
                        ></HelperText>
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
                            visible={errorMessages.passwordConfirm}
                        >
                            {errorMessages.passwordConfirm}
                        </HelperText>
                        <View style={{ width: '100%', marginTop: 40, marginBottom: 10 }}>
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleSend}>
                                <Text style={styles.btnTextWhite}>
                                    AGREGAR
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }
        </View >
    )
};

export default HomeScreen;