import { StatusBar, StyleSheet, Text, View, Platform, Image, Pressable, ScrollView, } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '../../utils/styling';

const AboutUs = () => {
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
            style={{marginLeft:5, zIndex: 11}}
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
            
            <Text style={styles.detailsTitle}>About Us</Text>
                      
        </View>

        <ScrollView showsVerticalScrollIndicator={false} > 
            <View style={styles.mainView}>
                
                <View style={styles.topImgView}>
                    <Image 
                    style={styles.topImg}
                    source={require('../../assets/appicon.png')}
                    />
                    <Text style={{fontSize: Platform.OS === 'ios' ? scale(22.6) : scale(18), fontWeight: '700', letterSpacing: 0.3, marginBottom: 4 }}>Find My Room</Text>
                    <Text style={{fontSize: Platform.OS === 'ios' ? scale(16) : scale(12), letterSpacing: 0.1, fontWeight: '500', marginBottom: 2 }}>Scroll Less, Settle Faster</Text>
                </View>

                <Text style={{fontSize: Platform.OS === 'ios' ? scale(20.8) : scale(16), fontWeight: '600', marginBottom: 10 }}>Welcome to Find My Room.</Text>

                <Text style={styles.listDescription}>We are dedicated to simplifying your search for the perfect room or helping you find the right tenants for your available space. 
                    Our mission is to connect individuals with suitable living arrangements efficiently and seamlessly.</Text>

                
                <Text style={styles.listText}>Key Features</Text>

                <Text style={styles.listDescription2}>- Easy browsing of room listings.</Text>
                <Text style={styles.listDescription2}>- Intuitive tools for uploading your own room details.</Text>
                <Text style={styles.listDescription2}>- Secure user authentication.</Text>
                <Text style={styles.listDescription2}>- Options to manage your uploaded rooms and favorites.</Text>
                <Text style={[styles.listDescription2, {marginBottom: 10}]}>- Options to report fake posting and users.</Text>

                <Text style={styles.listDescription}>We strive to provide a user-friendly and reliable platform that meets the needs of both room seekers and providers in Nepal. 
                    Your feedback is invaluable as we continuously work to improve our services.</Text>

                
                <View style={styles.teamView}>
                    <Text style={[styles.listText, {borderBottomWidth : 0.2, borderColor: '#4545455a',  paddingBottom: 4}]}>Our Teams:</Text>
                    <Text style={styles.listText2}>Bikram Kumal:</Text>
                    <Text style={styles.listDescription}>Project Lead, UI/Backend Developer, Tester</Text>
                    <Text style={styles.listText2}>Nirmaya Tamang:</Text>
                    <Text style={styles.listDescription}>Documentation & Tester</Text>
                    <Text style={styles.listText2}>Binam Pathak:</Text>
                    <Text style={styles.listDescription}>Documentation & Testing Supporter</Text>

                    <Text style={[styles.listDescription, {fontStyle: 'italic', fontWeight: '300'}]}>We are dedicated to building and improving Find My Room. </Text>


                </View>

                <Text style={styles.listDescription}>Thank You for choosing <Text style={{fontWeight: '500', fontStyle: 'italic'}}>Find My Room</Text>.</Text>




            </View>
        </ScrollView>
        
        
    </SafeAreaProvider>
  )
}

export default AboutUs;

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
        // gap: '100',
        alignItems: 'center',
        backgroundColor: '#cae6f3ff',
    },
    topImgView: {
        alignItems: 'center',
        padding: 4,
        paddingVertical: 20,
        marginBottom: 14,
        borderRadius: 14,
        backgroundColor: '#cae5f339',
    },
    topImg: {
        height: 100,
        width: 110,
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
        paddingBottom: 4,
    },
    listText: {
        fontSize: Platform.OS === 'ios' ? scale(19.4) : scale(15.4),
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 4
    },
    listText2: {
        fontSize: Platform.OS === 'ios' ? scale(19.4) : scale(15.4),
        fontWeight: 500,
        marginBottom: 4,
        marginTop: 2,
        letterSpacing: 0.1
    },
    listDescription: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
        marginBottom: 12,
    },
    listDescription2: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
        marginBottom: 4,
        marginLeft: 2,
    },

    teamView:{
        borderColor: '#2e2e2e37',
        borderWidth: 0.8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 14,
        marginTop: 4,
        backgroundColor: "#eeeeee8c",
        marginBottom: 12,
    }

})