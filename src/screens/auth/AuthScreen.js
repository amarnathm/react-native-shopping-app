import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';

import {ScrollView, View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Button, Alert} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Card from '../../components/Card';
import { CustomHeaderButton } from '../../components/CustomHeaderButton';
import Input from '../../components/Input';
import colors from '../../constants/colors';

import { Context as AuthContext } from '../../context/AuthContext';

const AuthScreen = ({ navigation }) => {
    
    // if true, signIn. if false, signUp
    const [localSignIn, setLocalSignIn] = useState(true);

    const { state: authState, signIn, signUp , signOut, clearErrorMessage} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {

    //     if (authState.infoMessage) {
    //         Alert.alert(authState.infoMessage.level1, authState.infoMessage.level2 , [{ text: 'Okay' }]);
    //     }
        
    // }, [authState.infoMessage]);
   

    // first time user comes to this page, let's clear out the auth token
    // useEffect(() => {
    //     signOut();
    // }, []);
   
    useEffect(() => {
        if (authState.errorMessage) {
            Alert.alert('An error occurred!', authState.errorMessage, [ {text: 'Okay'}])
        }
    }, [authState.errorMessage])

    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}> 
        
                <Card style={styles.authContainer}>
                    <ScrollView>
                        {isLoading && <ActivityIndicator />}
                        <Input
                            label="Email"
                            id="email"
                            keyboardType='email-address'
                            required email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address"
                            onValueChange={( val, valid) => {
                                if (valid) {
                                    // console.log("valid email onValueChange:", val);
                                    setEmail(val);
                                }
                            } }
                            initialValue=''
                        />

                        <Input
                            label="Password"
                            id="password"
                            keyboardType='default'
                            required
                            secureTextEntry
                            minLength={3}
                            autoCapitalize="none"
                            errorText="Please enter a valid password"
                            onValueChange={(val, valid) => {
                                if (valid) {
                                    setPassword(val);
                                }
                            } }
                            initialValue=''
                        />

                        <View style={styles.buttonContainer}>
                            <Button title={localSignIn? 'Login' : 'Sign Up'} color={colors.primary}
                                onPress={() => {
                                    // console.log("AuthScreen: email:", email);
                                    setIsLoading(true);
                                    localSignIn ? signIn({ email, password }) : signUp({ email, password })
                                    setIsLoading(false);
                                
                             }} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title={localSignIn ? 'Switch to Sign Up' : 'Switch to Sign In'} color={colors.accent}
                                onPress={() => {
                                    clearErrorMessage();
                                    setLocalSignIn(!localSignIn);
                                } } />
                        </View>

                        {!!authState.infoMessage && <View style={styles.infoMessageContainer}>
                            <Text style={styles.infoMessageLevel1}>{authState.infoMessage.level1} </Text>
                            <Text style={styles.infoMessageLevel2}>{authState.infoMessage.level2}</Text>
                        </View>}
                        
                        
                    </ScrollView>

                </Card>

            </LinearGradient>
        </KeyboardAvoidingView>
        
    );
}

AuthScreen.navigationOptions = ( {navigation }) => { 
    // console.log("nav igationOptions navigation", navigation);

    
    return ( {
        headerTitle: 'Authenticate',
        
        // headerLeft: () => {
        //     return (
        //         <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
        //             <Item title="Filters" iconName='ios-menu' 
        //                 onPress={() => navigation.toggleDrawer() } 
        //             />
        //         </HeaderButtons>
        //     ); 
        // }
    } )
    
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        marginVertical: 10
    },
    infoMessageContainer: {
        marginVertical: 10,
    },
    infoMessageLevel1 : {
        fontFamily: 'open-sans-bold',
        color: colors.primary,
        textAlign: 'center'
    },
    infoMessageLevel2 : {
        fontFamily: 'open-sans',
        textAlign: 'center'
    }
    
});

export default AuthScreen;

