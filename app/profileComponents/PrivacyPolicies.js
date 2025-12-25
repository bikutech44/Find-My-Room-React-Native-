import { Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import { scale } from '../../utils/styling';

const PrivacyPolicies = () => {
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

          <Pressable
          style={{marginLeft:5, zIndex: 10}}
          onPress={() => router.back()}
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

          <Text style={styles.detailsTitle}>Privacy and Policies</Text>
          
        </View>

        <ScrollView>
          <View style={styles.mainView}>
            <Text style={{fontSize: Platform.OS === 'ios' ? scale(20.8) : scale(16), fontWeight: '700'}}>Find My Room : Privacy & Policies </Text>
            <Text style={{fontSize: Platform.OS === 'ios' ? scale(16) : scale(10.8), marginTop: 4.8, color: '#666666ff', marginBottom: 18}}>Last Updated: November 11, 2025</Text>

            <Text style={styles.listText}>1. Information We Collect</Text>

            <Text style={styles.listDescription}>We collect information to operate and improve the Service:</Text>
            
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>Account Data:</Text> Information you provide when you register, such as your name and email address.</Text>
            
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>Content Data:</Text> Information you upload to list a room, including images, room descriptions, and rental details.</Text>

            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>Location Data (Not Saved):</Text> We temporarily access your device’s location only while you are using the app to help you search for nearby rooms or set a room's location. 
            This location data is not stored in our database after the initial use.</Text>

            <Text style={[styles.listDescription2, {marginBottom: 18}]}><Text style={{fontWeight: 600}}>Device Information:</Text> Technical details like your mobile device type and operating system version were determind by app itself and 
            provides a better experiences, fonts according to it.</Text>


            <Text style={styles.listText}>2. Data Security</Text>

            <Text style={styles.listDescription3}>We work hard to protect your information and take reasonable steps to secure your personal data from accidental loss and unauthorized access.</Text>

            <Text style={styles.listDescription3}><Text style={{fontWeight: 500}}>Important Note on Passwords:</Text> We do not save or store your password in our database. 
              We use secure authentication methods (like hashing or relying on third-party sign-in methods) to verify your identity.</Text>

            <Text style={[styles.listDescription3, {marginBottom: 18}]}>However, please remember that no method of transmission over the internet or electronic storage is 100% secure.</Text>


            <Text style={styles.listText}>3. Sharing Your Information</Text>

            <Text style={styles.listDescription}>We only share your information in limited circumstances:</Text>
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>With Other Users:</Text> When you list a room, the listing details, photos, and any contact info you include are visible to other app users.</Text>
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>With Service Providers:</Text> We use third-party companies (like hosting providers) to help us run the app. 
            They only access your data to perform services for us and are required to keep it confidential.</Text>
            <Text style={[styles.listDescription2, {marginBottom: 18}]}><Text style={{fontWeight: 600}}>For Legal Reasons:</Text> We may share your data if we believe it is necessary to comply with a law, regulation, legal process, or valid government request.</Text>

            <Text style={styles.listText}>4. Data Security</Text>
            <Text style={[styles.listDescription, {marginBottom: 18}]}>We take reasonable steps to protect your personal information from loss and unauthorized access. 
              However, no method of transmission over the internet or electronic storage is 100% secure.</Text>


            <Text style={styles.listText}>5. Your Rights and Choices</Text>
            <Text style={styles.listDescription}>You have the ability to manage your information:</Text>
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>Update Your Data:</Text> ou can review and change your account information within the app settings.</Text>
            <Text style={styles.listDescription2}><Text style={{fontWeight: 600}}>Delete Your Account:</Text> You can request that we delete your account and personal data.</Text>
            <Text style={[styles.listDescription2, {marginBottom: 18}]}><Text style={{fontWeight: 600}}>Control Notifications:</Text> You can opt-out of receiving promotional emails from us.</Text>


            <Text style={styles.listText}>6. Changes to This Policy</Text>
            <Text style={[styles.listDescription, {marginBottom: 18}]}>We may update this Privacy Policy occasionally. 
              We will notify you of any changes by posting the new Policy within the app. 
              Changes become effective when they are posted.</Text>

            
            <Text style={styles.listText}>7. Contact Us</Text>
            <Text style={styles.listDescription}>If you have any questions about this Privacy Policy, please contact us at:
            <Text style={{fontWeight: 500, fontStyle: 'italic', textDecorationLine: 'underline' }}> findmyroom.info@gmail.com</Text>.</Text>

          
          </View>
        </ScrollView>
    </SafeAreaProvider>
  )
}

export default PrivacyPolicies

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
    // gap: '58',
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
    zindex: 1,
  },  
  mainView:{
    marginTop: scale(12),
    marginBottom: scale(28),
    marginHorizontal: scale(14),
    paddingBottom: 8,
  },
  listText: {
    fontSize: Platform.OS === 'ios' ? scale(19.4) : scale(15.4),
    fontWeight: '700',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
    marginBottom: 10,
  },
  listDescription2: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
    marginBottom: 10,
  },
  listDescription3: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
    marginBottom: 4,
    marginTop: 1,
  },

})