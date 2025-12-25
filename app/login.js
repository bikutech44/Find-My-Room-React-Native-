import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, TextInput,Pressable, KeyboardAvoidingView,  Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeInUp, FadeOut, FadeOutRight, } from 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Input from '../components/Input'; // Assuming the Input component is in this path
import { StatusBar } from 'expo-status-bar';
import { scale } from '../utils/styling';
// firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from './../firebaseConfig';


const login = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        // Simple validation checks
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (!formData.email.trim() && !formData.password.trim()) {
            setErrorMessage('Please enter your email and password.');
            return;
        }
        else if (!formData.email.trim()) {
            setErrorMessage('Please enter your email.');
            return;
        }
        else if (!formData.password.trim()) {
            setErrorMessage('Please enter your password.');
            return;
        }
        else if (!emailRegex.test(formData.email.trim())) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        setIsLoading(true);
        try{
            const userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
            const user = userCredential.user;

            if (user && user.emailVerified) {
                // Email is verified, navigate to home
                router.replace('./(tabs)/home');
            } else {
                // Email is NOT verified, show the modal and sign out
                await signOut(auth);
                setShowUnverifiedModal(true);
            }

        }
        catch(error){
            setIsLoading(false);
            switch (error.code) {
                case 'auth/user-not-found':
                    setErrorMessage('User not found.');
                    break;
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    setErrorMessage('Invalid email or password.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Please enter a valid email address.');
                    break;
                default:
                    setErrorMessage('An error occurred. Please try again.');
                    break;
            }

        }

    };
    const handleModalClose = () => {
      setShowUnverifiedModal(false);
      setIsLoading(false);
      setErrorMessage('');
        
    };

    return (
        <SafeAreaProvider>
            {/* for status bar */}
            <StatusBar barStyle="light-content" />
            <View style={{ height: insets.top, backgroundColor: '#cae6f3', position: 'absolute', top: 0, left: 0, right: 0 }} />
            
            {/* stastus bar color 🤣 */}
            <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={[styles.container, {marginTop: insets.top}]}>
                <Animated.Image
                    entering={FadeIn.delay(50).duration(200)}
                    source={require('./../assets/top_img.png')}
                    style={styles.imageStyle}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.safeview}>
                        
                        <Animated.Text entering={FadeInUp.delay(200).duration(800).damping(3)} style={styles.welcomeText}>Welcome Back!</Animated.Text>
                        
                        <View style={styles.inputSection}>
                            {/* Replaced the original TextInput with your custom Input component */}
                            <Input
                                placeholder='Enter your email.'
                                value={formData.email}
                                textContentType='emailAddress'
                                autoCapitalize='none'
                                autoComplete='true'
                                onChangeText={(value) => handleInputChange('email', value)}
                                icon={<MaterialIcons name="email" size={Platform.OS === 'ios' ? 22 : 18} color="#00315e" />}
                                // Set the background color of the entire input container here
                                containerStyle={{ backgroundColor: '#e0f0f8de' , marginTop: 28 }}
                               
                            />
                            
                            
                            <Input
                                icon = {<Entypo name="lock" size={Platform.OS === 'ios' ? 20 : 18} color="#00315e" />}
                                placeholder='Enter your password.'
                                value={formData.password}
                                onChangeText={(value) => handleInputChange('password', value)}
                                secureTextEntry={!isPasswordVisible}
                                textContentType="password"
                                passwordRules="required: lower; required: upper; required: digit; minlength: 6;"
                                autoCorrect={false}
                                autoCapitalize="none"
                                containerStyle={{ backgroundColor: '#e0f0f8de', marginTop: 16 }}
                                rightIcon={
                                  <Entypo
                                      name={isPasswordVisible ? 'eye' : 'eye-with-line'}
                                      size={Platform.OS === 'ios' ? 20 : 20}
                                      color="#00315e"
                                  />
                                }
                                onPressRightIcon={() => setIsPasswordVisible(!isPasswordVisible)}
                            />

                            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                            
                            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                                {isLoading ? (
                                    <ActivityIndicator color="#cae6f3" size="small" />     
                                ) : (
                                    <Text style={styles.loginButtonText}>Login</Text>
                                )}
                            </TouchableOpacity>
                                
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.registerAccount} onPress={() => router.push('./register')}>
                            <Text style={styles.registerAccountText}>New User? </Text>
                            <Text style={styles.registerAccountText2}>Create an Account</Text>
                        </TouchableOpacity>

                        
                    </View>
                </KeyboardAvoidingView>

                    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                        {/* <Image source={'../assets/button.png'} style={styles.buttonImg}></Image> */}
                        <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.footerTxt} >Scroll Less, Settle Faster!</Animated.Text>
                </View>
            </Animated.View>


            <Modal
                animationType="fade"
                transparent={true}
                visible={showUnverifiedModal}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Email Verification Need!</Text>
                        <Text style={styles.modalMessage}>
                            Please check your email to verify your account.
                        </Text>
                        <Pressable onPress={handleModalClose} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaProvider>
    );
};

login.options = {
    headerStyle: { backgroundColor: 'white' },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d7ebf5',
    },
    imageStyle: {
        width: '100%',
        height: scale(140),
        marginTop: Platform.OS === 'ios'? scale(-18) : scale(-10),
        backgroundColor: '#d7ebf5',
    },
    safeview: {
        flex: 1,
        backgroundColor: '#d7ebf5',
        alignItems: 'stretch',
    },
    welcomeText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: Platform.OS === 'ios' ? 26 : 22,
        color: '#00315e',
        fontWeight: 'bold',
    },
    inputSection: {
        marginLeft: 10,
        marginEnd: 10,
        marginTop: 12,
        padding: 10,
        paddingBottom: 18,
        backgroundColor: '#cae6f3a6',
        borderRadius: 8,
    },

    eyeIcon: {
        paddingHorizontal: 8,
    },

    loginButton: {
        backgroundColor: '#00315e',
        padding: Platform.OS === 'ios' ? 16 : 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    loginButtonText: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#00315e',
        fontSize: Platform.OS === 'ios' ? 18 : 12.6,
    },
    registerAccount: {
        marginTop: Platform.OS === 'ios' ? 30 : 26,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    registerAccountText: {
        color: '#00315e',
        fontSize: Platform.OS === 'ios' ? 20 : 16,
        fontWeight: Platform.OS === 'ios' ? '780' : '790',
    },
    registerAccountText2: {
        color: '#00315e',
        fontSize: Platform.OS === 'ios' ? 20.4 : 16.4,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#d7ebf5',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'flex-end', 
    },
    buttonImg:{
        width : '100%'

    },
    footerTxt: {  
        textAlign: 'center',
        color: '#00315e',
        fontSize: Platform.OS === 'ios' ? 18 : 14,
        letterSpacing: 1.2,
        fontWeight: 'bold',
        paddingBottom: Platform.OS === 'ios' ? 2 : 8,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: -6,
      fontSize: Platform.OS === 'ios' ? 16 :12,
    },
        modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: Platform.OS === 'ios' ? 22 : 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#00315e',
    },
    modalMessage: {
      fontSize: Platform.OS === 'ios' ? 16: 14,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
      color: '#00315e',
    },
    modalButton: {
      backgroundColor: '#00315e',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 30,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

export default login;
