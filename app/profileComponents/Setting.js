import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { scale } from '../../utils/styling';

const Setting = () => {
    const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider>
        <StatusBar
         barStyle="dark-content"
        />
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
                style={{marginLeft:5, zIndex: 11,}}
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
            

            <Text style={styles.detailsTitle}>Settings</Text>
            
        </View>

        <ScrollView>
            <View style={styles.mainView}>
                <View style={styles.topImgView}>
                    <Image 
                    style={styles.topImg}
                    source={require('../../assets/appicon.png')}
                    />
                    <Text style={{fontSize: Platform.OS === 'ios' ? scale(22.6) : scale(18), fontWeight: '700', letterSpacing: 0.3, marginBottom: 6 }}>Find My Room</Text>
                    <Text style={{fontSize: Platform.OS === 'ios' ? scale(16) : scale(12), letterSpacing: 0.2, fontWeight: '500', marginBottom: 2 }}>Scroll Less, Settle Faster.</Text>
                </View>

                <View style={styles.settingView}>
                    <Text style={styles.settingTitle}>Account Setting</Text>

                    <Pressable>
                        <View style={styles.settingListView}>
                            <Text style={styles.settingListTitle}>Change Name</Text>
                            <Image
                            style={styles.settingListArrow}
                            source={require('../../assets/arrow.png')}
                            tintColor='#3b3d3dff'
                            />
                        </View>  
                    </Pressable>
                    
                    <Pressable>
                        <View style={styles.settingListView}>
                            <Text style={styles.settingListTitle}>Change Email</Text>
                            <Image
                            style={styles.settingListArrow}
                            source={require('../../assets/arrow.png')}
                            tintColor='#3b3d3dff'
                            />
                        </View>  
                    </Pressable>

                    <Pressable>
                        <View style={styles.settingListView}>
                            <Text style={styles.settingListTitle}>Change Password</Text>
                            <Image
                            style={styles.settingListArrow}
                            source={require('../../assets/arrow.png')}
                            tintColor='#3b3d3dff'
                            />
                        </View>  
                    </Pressable>

                </View>

            </View>
        </ScrollView>

    </SafeAreaProvider>
  )
}

export default Setting;

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
        zIndex: 1,
    },  
    mainView:{
        paddingTop: scale(12),
        paddingBottom: scale(14),
        paddingHorizontal: scale(10),
        width: '100%',
        backgroundColor: '#ecf0f0b5',
    },
    topImgView: {
        alignItems: 'center',
        padding: 4,
        paddingVertical: 20,
        marginBottom: 14,
        borderRadius: 14,
        backgroundColor: '#cae5f344',
    },
    topImg: {
        height: 100,
        width: 110,
    },
    settingView: {
        backgroundColor: '#b6bfc444',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginTop:10,
        paddingBottom: 14,
    },
    settingTitle: {
        fontSize: Platform.OS === 'ios' ? scale(20) : scale(16),
        fontWeight: '600',
        paddingBottom: 6,
        paddingTop: 10,
        marginBottom: 10,
        borderBottomWidth: 0.2,
        paddingLeft: 4,
        
    },
    settingListView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 7.2,
        justifyContent: 'space-between',
        borderBottomWidth: 1.4,
        borderRightWidth: 2,
        borderBottomColor: "#ccc6c695",
        borderRightColor: "#ccc6c685",
        // borderLeftWidth: 0.2,
        // borderTopWidth: 0.2,
        // borderTopColor: "#46454561",
        // borderLeftColor: "#46454561",
        marginRight: scale(2),
        backgroundColor:  '#7c919c0d',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,

    },
    settingListTitle: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
        fontWeight: '500',
        paddingLeft: 2.8,
    },
    settingListArrow: {
        height: 20,
        width: 30,
        right: 0,
        padding: 0.8,
        paddingRight: 0,
    },
})