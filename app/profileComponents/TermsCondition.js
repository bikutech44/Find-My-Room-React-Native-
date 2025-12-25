import { Pressable, StatusBar, StyleSheet, Text, View, Platform, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '../../utils/styling';
import { router } from 'expo-router';

const TermsCondition = () => {
  
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content"/>
        <View 
        style={{ 
            height: insets.top, 
            backgroundColor: '#cae6f3ff',
            position: 'absolute', 
            top: 0, left: 0, right: 0 
            }}
        />
        <View style={{marginTop: insets.top}}/>

        <View style={styles.topView}>

          <Pressable style={{marginLeft:5, zIndex: 11,}}
          onPress={ () => router.back()}
          >
            <Image
              source={require('../../assets/back.png')}
              style={{
                height: Platform.OS === 'ios' ? 24 : 20, 
                width: Platform.OS === 'ios' ? 24 : 20, 
                tintColor: "#00315e", 
                paddingHorizontal: 5,
              }}
            />

          </Pressable>

          <Text style={styles.detailsTitle}>Terms and Conditions</Text>

        </View>

        <ScrollView>
          <View style={styles.mainView}>
            <Text style={{fontSize: Platform.OS === 'ios' ? scale(20.8) : scale(16), fontWeight: '700'}}>Terms & Conditions (T&C)</Text>
            <Text style={{fontSize: Platform.OS === 'ios' ? scale(16) : scale(10.8), marginTop: 4.8, color: '#666666ff', marginBottom: 18}}>Last Updated: November 11, 2025</Text>

            <Text style={{fontSize: Platform.OS === 'ios' ? scale(18) : scale(12.8), marginBottom: 8 }}>Welcome to <Text style={{fontWeight: '600'}}>Find My Room!</Text> These Terms and Conditions are a legal agreement between you and us, the creators of the app. 
              They set the rules for using our mobile application, which helps you find and upload available rooms. 
              </Text>
              
             <Text style={{fontSize: Platform.OS === 'ios' ? scale(18) : scale(12.8), marginBottom: 20 }} >By using our Service, you agree to these T&C. If you don't agree, you must not use the Service.
            </Text>

            <Text style={styles.listText}>1. Accepting the Terms</Text>
            <Text style={styles.listDescription}>By creating an account or using Find My Room, you confirm that you have read, understood, and agree to these Terms. 
            You also confirm you're of legal age to enter into this contract.
            </Text>

            <Text style={styles.listText}>2. Using the App Responsibly</Text>

            <Text style={styles.listDescription2}>You are responsible for your actions on the app and for any content you post (like room listings). You agree to use the Service lawfully and fairly. You must:</Text>
            
            <Text style={[styles.listDescription2 , { marginLeft: 10,}]}>• Provide accurate and truthful information about yourself and any rooms you list.</Text>
            <Text style={[styles.listDescription2 , { marginLeft: 10,}]}>• Keep your account details secure.</Text>
            <Text style={[styles.listDescription2 , { marginLeft: 10,}]}>• Not post illegal, misleading, offensive, or harmful content, or anything that violates another person's rights.</Text>
            <Text style={[styles.listDescription2 , { marginLeft: 10,}]}>• Not interfere with or damage the app (e.g., by hacking).</Text>
            <Text style={[styles.listDescription2 , { marginLeft: 10, marginBottom: 10 }]}>• Respect the property rights of Find My Room and other users.</Text>

            <Text style={styles.listDescription}><Text style={{fontWeight: '600'}}>Important:</Text> Find My Room is just a platform. We are not responsible for the quality, safety, or legality of the rooms or the interactions between users.</Text>


            <Text style={styles.listText}>3. Content You Post (User-Generated Content)</Text>

            <Text style={styles.listDescription2}>When you upload content like room photos or descriptions, you still own it. 
              However, you give Find My Room a worldwide, royalty-free license to use, display, and distribute that content to run and promote the Service.
            </Text>
            <Text style={styles.listDescription}>We have the right to remove any content that violates these Terms.</Text>


            <Text style={styles.listText}>4. Our Property (Intellectual Property)</Text>
            <Text style={styles.listDescription}>All parts of the Find My Room app—including the design, logos, text, and software—are the exclusive property of Find My Room. 
              You cannot copy or use our material for commercial purposes without our permission.</Text>

            <Text style={styles.listText}>5. Privacy Policy</Text>
            <Text style={styles.listDescription}>Your privacy is vital. Please review our separate Privacy Policy for full details on how we handle your personal information. 
              By using the Service, you also agree to that policy.</Text>

            <Text style={styles.listText}>6. Disclaimers and Limited Liability</Text>
            <Text style={styles.listDescription2}>The Service is provided "AS IS" and "AS AVAILABLE." 
              Find My Room does not promise the app will always be perfect, error-free, or meet all your needs.</Text>

            <Text style={styles.listDescription}>To the maximum extent allowed by law, we will not be liable for any indirect damages, loss of data, or loss of profits resulting from your use or inability to use the Service, the actions of other users, or unauthorized access to your data.</Text>


            <Text style={styles.listText}>7. Termination</Text>
            <Text style={styles.listDescription}>We can immediately terminate or suspend your access to the Service without notice if you break these Terms.</Text>

            <Text style={styles.listText}>8. Governing Law</Text>
            <Text style={styles.listDescription}>These Terms are governed by the laws of <Text style={{fontWeight: '600'}}>Nepal</Text>.</Text>

            <Text style={styles.listText}>9. Changes to These Terms</Text>
            <Text style={styles.listDescription}>We may update these Terms at any time. 
              If a change is significant, we will try to give you at least 30 days' notice. 
              By continuing to use the Service after the changes take effect, you agree to the new Terms.</Text>

            <Text style={styles.listText}>10. Contact Us</Text>
            <Text style={styles.listDescription}>If you have any questions about these Terms, please contact us at: <Text style={{fontStyle:'italic', fontWeight:'500', textDecorationLine: 'underline' }}>findmyroom.info@gmail.com</Text>.</Text>

          </View>
        </ScrollView>

        

    </SafeAreaProvider>
  )
}

export default TermsCondition;

const styles = StyleSheet.create({

  // top view
  topView: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom:6,
    borderBottomWidth: 0.2,
    borderColor: 'rgba(17, 0, 0, 0.62)',
    display: 'flex',
    flexDirection: 'row',
    // gap: '55',
    alignItems: 'center',
    backgroundColor: '#cae6f3ff',
  },
  detailsTitle: {
    fontSize: Platform.OS === 'ios' ? scale(24) : scale(18),
    color: '#00315e',
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },  
  mainView:{
    marginTop: scale(12),
    marginBottom: scale(28),
    marginHorizontal: scale(14),
  },

  listText: {
    fontSize: Platform.OS === 'ios' ? scale(19.4) : scale(15.4),
    fontWeight: '700',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
    marginBottom: 16,
  },
  listDescription2: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
    marginBottom: 4,
  },

})