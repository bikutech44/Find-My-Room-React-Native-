import { View, Text, Button, StyleSheet, Platform, ScrollView, Image, Pressable, Linking, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { scale } from '../../utils/styling';

import { doc, getDoc, collectionGroup, onSnapshot, query, orderBy } from 'firebase/firestore';



// optimize cloudinary images
const getOptimizedImageUrl = (url, width) => {
  if (!url) return false;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_${width},q_auto:best/${parts[1]}`;
  }
  return url;
};

// for open whatsapp
const phoneNumber = '9779820271484';
const MESSAGE = `Hello, This message is from Find My Room.`;

const handleWhatsappOpen = async () => {
  let url;
  
  try {
    if(Platform === 'ios'){
    url = `whatsapp://send?phone=${phoneNumber}?text=${encodeURIComponent(MESSAGE)}`;
  }
  else{
    url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(MESSAGE)}`;
  }
    const supported = await Linking.canOpenURL(url);
    
    if(supported){
      await Linking.openURL(url);
    }
    else{
      const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(MESSAGE)}`;
      await Linking.openURL(webUrl);
      console.log('Opening WhatsApp via web fallback.');

    }   

  }
  catch (error) {
   
    console.log('An error occurred while trying to open WhatsApp:', error);
  }
};

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initialLogOut = () => {
    setShowLogoutModal(true);
  }
  

  const handleLogout = async () => {
    // await signOut(auth); 
    // router.replace('/login'); // Navigates to index.js
    setShowLogoutModal(false);
    setIsLoading(true);
    try {
      await signOut(auth); 
      router.replace('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false); 
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const fetchUserData = async (user) => {
    if(user){
      try{
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if(userSnap.exists()){
          setUserData({id: userSnap.id, ...userSnap.data()});
        }
        else{
          setUserData(null);
        }
      }
      catch (error){
        console.error("Error fetching personal details:", error);
      }
    }
    else{
      setUserData(null);
    }
  };

  useEffect (()=>{
    const unsubscribeAuth = onAuthStateChanged (auth, async (user) =>{
      await fetchUserData(user);
    });

    return () => unsubscribeAuth();
  }, []);



  return (
    // <View style={styles.container}>
    //   <Text>Profile Page</Text>
    //   <Button title="Logout" onPress={handleLogout} />
    // </View>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content"/>
      <View style={[styles.profileTop, {height: insets.top }]}/>
      
      <ScrollView style={[styles.profileScrollView, 
        {marginTop: -(insets.top + 10), paddingTop: (insets.top + 10 )}]}
        showsVerticalScrollIndicator={false}
      >
        {userData &&(
          <View style={styles.topView}>
            <View style={styles.imageView}>
              {userData.profileImageUrl ?(
                <Image
                  source={{ uri: getOptimizedImageUrl(userData.profileImageUrl, 600) }} 
                  style={[styles.profileImg, {borderRadius: 100}]}
                />
              ) : (

                <Image
                  source={require('../../assets/account.png')}
                  style={[styles.profileImg, {tintColor: '#00315e'}]}
                />
              )}

            </View>

            <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
              <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
              {userData.isAdmin && (
                <Image
                source={require('../../assets/verify.png')}
                style={styles.verifiedImg}
                />
              )}
            </View>

            <Text style={styles.profileEmail}>{userData.email}</Text>
            
          </View>
         )}  

          <View style={styles.profileOthers}>

            {/* <Text style={styles.profileOthersTxt}>Account</Text> */}

            <Pressable>
              <View style={[styles.profilePressableView, {marginTop: 10,}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#76c7ec48'}]}>
                  <Image
                  source={require('../../assets/upload.png')}
                  style={styles.pressableImg}
                  tintColor='#026592ff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>My Uploads</Text>
                  <Text style={styles.pressableTxt2}>View uploaded rooms</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>

            <View style={{ height: 2, backgroundColor: '#f0ececff', marginHorizontal: 20 }} />

            <Pressable onPress = {() => router.push('../profileComponents/Setting') }>
              <View style={[styles.profilePressableView, {marginTop: 4}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#535b5e21'}]}>
                  <Image
                  source={require('../../assets/setting.png')}
                  style={styles.pressableImg}
                  tintColor='#3d4142ff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>Settings</Text>
                  <Text style={styles.pressableTxt2}>Manage your account</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>

            <View style={{ height: 2, backgroundColor: '#f0ececff', marginHorizontal: 20 }} />

            <Pressable onPress={() => router.push('../profileComponents/TermsCondition')} >
              <View style={[styles.profilePressableView, {marginTop: 4}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#d12eae25'}]}>
                  <Image
                  source={require('../../assets/valid.png')}
                  style={styles.pressableImg}
                  tintColor='#cc17a5ff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>Terms and Conditions</Text>
                  <Text style={styles.pressableTxt2}>Legal information</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>

            <View style={{ height: 2, backgroundColor: '#f0ececff', marginHorizontal: 20 }} />

             <Pressable onPress={() => router.push('../profileComponents/PrivacyPolicies')} >
              <View style={[styles.profilePressableView, {marginTop: 4}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#e07b373b'}]}>
                  <Image
                  source={require('../../assets/padlock.png')}
                  style={styles.pressableImg}
                  tintColor='#cc5f17ff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>Privacy and Policies</Text>
                  <Text style={styles.pressableTxt2}>How we protect your data</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>

            <View style={{ height: 2, backgroundColor: '#f0ececff', marginHorizontal: 20 }} />

             <Pressable onPress={handleWhatsappOpen}>
              <View style={[styles.profilePressableView, {marginTop: 4}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#3cbb5c3b'}]}>
                  <Image
                  source={require('../../assets/whatsapp.png')}
                  style={styles.pressableImg}
                  tintColor='#08942bff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>Contact</Text>
                  <Text style={styles.pressableTxt2}>Get help via WhatsApp</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>

            <View style={{ height: 2, backgroundColor: '#f0ececff', marginHorizontal: 20 }} />

             <Pressable  onPress={() => router.push('../profileComponents/AboutUs')} >
              <View style={[styles.profilePressableView, {marginTop: 4, marginBottom: 10}]}>

                <View style={[styles.pressableImgView , {backgroundColor: '#40217936'}]}>
                  <Image
                  source={require('../../assets/information-button.png')}
                  style={styles.pressableImg}
                  tintColor='#1f0d3fff'
                  />
                </View>
              
                <View>
                  <Text style={styles.pressableTxt}>About</Text>
                  <Text style={styles.pressableTxt2}>About this app</Text>
                </View>

                <View style={styles.pressableImgView2}>
                  <Image 
                    source={require('../../assets/arrow.png')}
                    style={styles.pressableImg2}
                  />
                </View>

              </View>
            </Pressable>
            
          </View>

          <View style={styles.profileLogout}>
            <Pressable onPress={initialLogOut}>
              
              <View style={styles.logoutPresabaleView}>
                {isLoading?(
                  <ActivityIndicator />
                ): (
                  <>
                    <Image 
                      source={require('../../assets/logout.png')}
                      style={styles.pressableImg}
                      
                    />
                    <Text style={styles.logoutTxt}>LogOut</Text>
                  </>)}
                </View>
    
            </Pressable>
          </View>

          <View style={styles.versionView}>
            <Text style={styles.versionTxt}>Version: 1.1.2 (2) </Text>
          </View>
        
        </ScrollView>

        {/* logout modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLogoutModal}
          onRequestClose={cancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalMessage}>Are you sure to log out?</Text>
              <View style={styles.modalButtonContainer}>
                <Pressable onPress={cancelLogout} style={[styles.modalButton, ]}>
                  <Text style={styles.cancelButtonText}>No</Text>
                </Pressable>
                <Pressable onPress={handleLogout} style={[styles.modalButton, { borderLeftWidth: 0.2, borderColor: '#8d8b8ba2'}]}>
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileScrollView: {
    backgroundColor: "#d1e6f03d"
  },

  profileTop: {
    backgroundColor:  '#cae6f3ff',
    zIndex: 4,
  },

  // top view

  topView: {
    marginTop: -200,
    paddingTop: 200,
    minHeight: 460,
    backgroundColor:  '#cae6f3ff',
    // borderBottomRightRadius: 16,
    // borderBottomLeftRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

  },

  imageView: {
    height:  Platform.OS === 'ios'? 150 : 140,
    width:  Platform.OS === 'ios'? 150 : 140,
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImg: {
    height:  Platform.OS === 'ios'? 150 : 140,
    width:  Platform.OS === 'ios'? 150 : 140,
  },
  profileName: {
    marginBottom: 6,
    fontSize: Platform.OS === 'ios' ? scale(24) : scale(18),
    fontWeight: '700',
    letterSpacing: 0.4,
    // textTransform: 'capitalize'
  },
  verifiedImg:{
    height: 16,
    width: 16,
    marginTop: -4,
  },
  profileEmail: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(16),
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
    letterSpacing: 0.2
  },


  //others
  profileOthers: {
    marginVertical: 18,
    marginHorizontal:20,
    marginTop: 22,
    borderRadius: 10,
    backgroundColor: '#a1b9c02f',

  },
  
  profilePressableView: {
    padding: scale(8),
    paddingHorizontal: scale(16),
    marginVertical: 4,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  pressableTxt: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
    fontWeight: '500',
  },
  pressableTxt2: {
    fontSize: Platform.OS === 'ios' ? scale(14) : scale(12),
  },
  pressableImgView: {
    height: 36,
    width: 36,
    padding: 8,
    borderRadius: 10,
  },
  pressableImg: {
    height: 20,
    width: 20,
  },
   pressableImgView2: {
    alignItems: 'center',
    marginLeft: 'auto', 
  },
  pressableImg2: {
    height: 20,
    width: 20,
  },

  profileLogout: {
    marginTop: 16,
    marginHorizontal: 24,
    // marginBottom: Platform.OS == 'ios' ? 40 : 60,
    marginBottom: 30,
    borderRadius: 12,
    // backgroundColor: '#c2e1f0ff',
    backgroundColor: '#5e7a837c',
  },

  logoutPresabaleView: {
    padding: scale(8),
    paddingHorizontal: scale(16),
    marginVertical: 4,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },

  logoutTxt: {
    fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
    fontWeight: '500',
    letterSpacing: 0.2
  },

  // version
  versionView: {
    marginBottom: Platform.OS == 'ios' ? 20 : 50,
    marginHorizontal: 24,
  },
  versionTxt: {
    fontSize: Platform.OS === 'ios' ? scale(14.6) : scale(11),
    textAlign: 'center',
    color: '#555252ff'
  },


  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 25, 28, 0.5)',
    },
  modalContent: {
    width: '80%',
    backgroundColor: '#f1f1f1ff',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: Platform.OS === 'ios' ? 22 : 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00315e',
  },
  modalMessage: {
    fontSize: Platform.OS === 'ios' ? 18: 14,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 22,
    color: '#00315e',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    borderTopWidth: 0.2,
    borderColor: '#8d8b8ba2'
  },
  modalButton: {
    paddingVertical: 4,
    paddingTop: 12,
    flex: 1,
    // marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? 16 : 12.4,
  },
  cancelButtonText: {
    color: '#575656ff',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? 16: 12.4,
  },

});