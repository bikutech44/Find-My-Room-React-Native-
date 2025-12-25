import { View, Text, StyleSheet, Image, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeInUp, FadeOutRight, useSharedValue, withTiming, withRepeat, useAnimatedStyle, Easing } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Input from './../components/Input';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { scale } from './../utils/styling';

// firebase
import { createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import { auth, db } from './../firebaseConfig';


const register = () => {

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const pulse = useSharedValue(1);

    useEffect(() => {
      if (isLoading) {
        pulse.value = withRepeat(withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true);
      } else {
        pulse.value = withTiming(1, { duration: 300 });
      }
    }, [isLoading]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: pulse.value }],
        backgroundColor: isLoading ? '#004183' : '#00315e',
      };
    });

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const handleRegister = async () => {
        setErrorMessage('');
        
        // Simple validation checks
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!formData.fullName.trim()) {
            setErrorMessage('Please enter your full name.');
            return;
        }
        if (formData.fullName.trim().length < 6) {
            setErrorMessage('Please enter a valid name.');
            return;
        }
        if (formData.fullName.trim().split(' ').length < 2) {
            setErrorMessage('Please enter your full name (first and last name).');
            return;
        }
        if (!formData.email.trim()) {
            setErrorMessage('Please enter your email.');
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!formData.password.trim()) {
            setErrorMessage('Please enter your password.');
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            setErrorMessage('Password must be at least 6 characters, with one uppercase, one lowercase, and one number.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const nameParts = formData.fullName.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts[nameParts.length - 1];
            const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : null;

            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                id: user.uid,
            };
            await setDoc(doc(db, "users", user.uid), userData);
            await sendEmailVerification(user);

            setIsLoading(false);
            setShowSuccessModal(true);

        } catch(error) {
            setIsLoading(false);
            // setErrorMessage(error.message);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('User is already registered.');
            } else {
                setErrorMessage(error.message);
            }
        }
    };

    const handleLoginNavigation = () => {
        router.push('./login');
    };

    const handleModalClose = () => {
      setShowSuccessModal(false);
      router.push('./login');
    };

    return (
        <SafeAreaProvider>

          {/* for status bar */}
          <StatusBar barStyle="light-content" />
          <View style={{ height: insets.top, backgroundColor: '#cae6f3', position: 'absolute', top: 0, left: 0, right: 0 }} />

          <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={[styles.container, {marginTop: insets.top}]}>
              <Animated.Image
                  entering={FadeIn.delay(50).duration(200)}
                  source={require('./../assets/top_img.png')}
                  style={styles.imageStyle}
              />
              <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? scale(60) : 10}
              >
                  <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 , 
                      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}
                      keyboardShouldPersistTaps="handled"
                      >
                      <View style={styles.safeview}>
                          <Animated.Text entering={FadeInUp.delay(100).duration(500).damping(3)} style={styles.newAccountText}>Create an Account</Animated.Text>

                          <View style={styles.inputSection} >
                              <Input
                                  icon={<MaterialCommunityIcons name="account" size={Platform.OS === 'ios' ? 24 : 20} color="#00315e" />}
                                  placeholder='Enter your Full Name.'
                                  textContentType='name'
                                  onChangeText={(value) => handleInputChange('fullName', value)}
                                  containerStyle={{ backgroundColor: '#e0f0f8de', marginTop: 28 }}
                                  
                              />
                              <Input
                                  icon={<MaterialIcons name="email" size={Platform.OS === 'ios' ? 22 : 18} color="#00315e" />}
                                  placeholder='Enter your email address.'
                                  textContentType='emailAddress'
                                  autoCapitalize='none'
                                  onChangeText={(value) => handleInputChange('email', value)}
                                  containerStyle={{ backgroundColor: '#e0f0f8de', marginTop: 16 }}
                              />
                              <Input
                                  icon={<Entypo name="lock" size={Platform.OS === 'ios' ? 20 : 18} color="#00315e" />}
                                  placeholder='Enter password.'
                                  onChangeText={(value) => handleInputChange('password', value)}
                                  secureTextEntry={!isPasswordVisible}
                                  textContentType="password"
                                  passwordRules="required: lower; required: upper; required: digit; minlength: 6;"
                                  autoCorrect={false}
                                  autoCapitalize="none"
                                  containerStyle={{ backgroundColor: '#e0f0f8de', marginTop: 16 }}
                                  rightIcon={<Entypo name={isPasswordVisible ? 'eye' : 'eye-with-line'} size={Platform.OS === 'ios' ? 24 : 20} color="#00315e" />}
                                  onPressRightIcon={() => setIsPasswordVisible(!isPasswordVisible)}
                              />
                              <Input
                                  icon={<Entypo name="lock" size={Platform.OS === 'ios' ? 20 : 18} color="#00315e" />}
                                  placeholder='Confirm password.'
                                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                                  secureTextEntry={!isConfirmPasswordVisible}
                                  textContentType="password"
                                  passwordRules="required: lower; required: upper; required: digit; minlength: 6;"
                                  autoCorrect={false}
                                  autoCapitalize="none"
                                  autoComplete='none'
                                  containerStyle={{ backgroundColor: '#e0f0f8de', marginTop: 16 }}
                                  rightIcon={<Entypo name={isConfirmPasswordVisible ? 'eye' : 'eye-with-line'} size={Platform.OS === 'ios' ? 24 : 20} color="#00315e" />}
                                  onPressRightIcon={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                  returnKeyType="done"
                              />

                              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                              <Pressable onPress={handleRegister} style={styles.registerButton}>
                                {isLoading ? (
                                        <ActivityIndicator color="#cae6f3" size="small" />     
                                ) : (
                                    <Text style={styles.registerButtonText}>Register</Text>
                                )}
                              </Pressable>
                          </View>

                          <TouchableOpacity onPress={handleLoginNavigation} style={styles.registerAccount}>
                              <Text style={styles.registerAccountText}>Already have an account? </Text>
                              <Text style={styles.registerAccountText2}>Login</Text>
                          </TouchableOpacity>
                      </View>
                  </ScrollView>
              </KeyboardAvoidingView>

              <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                  <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.footerTxt} >Scroll Less, Settle Faster!</Animated.Text>
              </View>
          </Animated.View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showSuccessModal}
            onRequestClose={handleModalClose}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Registration Successful!</Text>
                <Text style={styles.modalMessage}>
                  Please check your email to verify your account and complete your registration.
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d7ebf5',
    },
    imageStyle: {
        justifyContent: 'flex-start',
        width: '100%',
        height: scale(140),
        marginTop: Platform.OS === 'ios' ? scale(-18) : scale(-10),
        backgroundColor: '#d7ebf5',
    },
    safeview: {
        flex: 1,
        backgroundColor: '#d7ebf5',
        alignItems: 'stretch',
    },
    newAccountText: {
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 32 : 28,
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
    registerButton: {
        backgroundColor: '#00315e',
        padding: Platform.OS === 'ios' ? 16 : 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    // loadingContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     padding: 2,
    // },
    registerButtonText: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontWeight: 'bold',
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
        alignItems: 'center',
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
        fontSize: Platform.OS === 'ios' ? 18 : 12,
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

export default register;
