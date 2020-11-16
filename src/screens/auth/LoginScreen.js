import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { TextInput, HelperText } from "react-native-paper";
import { styles, theme } from "../../constants/styles";
import validate from "../../services/Validate";
import colors from "../../constants/colors";

import AuthService from "./../../services/Auth";

const LoginScreen = (props) => {
    const fields = {
        email: "",
        password: "",
    };
    const [inputs, setInputs] = useState(fields);
    const [errorMessages, setErrorMessages] = useState(fields);
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();

    AuthService.isSignedIn(dispatch);

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

    const handlePressRegister = () => {
        props.navigation.navigate("TnC");
    };

    const handleForgotPassword = () => {
        props.navigation.navigate("ForgotPassword");
    };

    const handleLogin = async () => {
        setIsloading(true);
        try {
            checkErrors();
            await AuthService.login({ email: inputs.email, password: inputs.password }, dispatch);
            resetFields();
            setIsloading(false);
        } catch (err) {
            setIsloading(false);
            console.log(err.message);
            Alert.alert("Error:", err.message);
        }
    };

    return (
        <View style={styles.screen}>
            {isLoading ? (
                <ActivityIndicator
                    style={styles.screen}
                    size={"large"}
                    color={colors.primaryOldMossGreen}
                />
            ) : (
                    <ScrollView style={styles.container}>
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Image
                                style={styles.screenLogoLogin}
                                resizeMode="contain"
                                source={require("../../../assets/img/example.jpg")}
                            />
                        </View>
                        <View style={{ width: "100%" }}>
                            <TextInput
                                style={styles.inputsStyle}
                                theme={theme}
                                underlineColor={colors.primaryDavysGray}
                                keyboardType={"email-address"}
                                autoCapitalize={"none"}
                                label={"Email"}
                                value={inputs.email}
                                error={errorMessages.email}
                                onChangeText={(value) => handleInput("email", value)}
                            />
                            <HelperText type="error" visible={errorMessages.email}>
                                {errorMessages.email}
                            </HelperText>
                            <TextInput
                                style={styles.inputsStyle}
                                theme={theme}
                                underlineColor={colors.primaryDavysGray}
                                secureTextEntry={true}
                                autoCapitalize={"none"}
                                label={"Contraseña"}
                                value={inputs.password}
                                error={errorMessages.password}
                                onChangeText={(value) => handleInput("password", value)}
                            />
                            <HelperText type="error" visible={errorMessages.password}>
                                {errorMessages.password}
                            </HelperText>
                            <View style={{ width: "100%", marginTop: 40 }}>
                                <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
                                    <Text style={styles.btnTextWhite}>INGRESAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>
                                ¿No tenés cuenta?{" "}
                                <Text style={styles.infoTextLink} onPress={handlePressRegister}>
                                    Registrate
                                </Text>
                            </Text>
                        </View>
                        <View style={{ ...styles.infoContainer, marginBottom: 70 }}>
                            <Text
                                style={{
                                    ...styles.infoTextLink,
                                    fontFamily: "NunitoSans-Regular",
                                }}
                                onPress={handleForgotPassword}
                            >
                                Me olvidé mi contraseña
            </Text>
                        </View>
                    </ScrollView>
                )}
        </View>
    );
};

export default LoginScreen;
