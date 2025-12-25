import { Dimensions, Image, Platform, Pressable, ScrollView, Linking, StyleSheet, Text, View, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { scale } from '../../utils/styling';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'; 

import { collectionGroup, query, where, getDocs, documentId } from 'firebase/firestore';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';




const { width } = Dimensions.get('window');


// optimize cloudinary images
const getOptimizedImageUrl = (url, width) => {
  if (!url) return false;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_${width},q_auto:best/${parts[1]}`;
  }
  return url;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};



const details = () => {

    const insets = useSafeAreaInsets();
    const { roomId, userId, latitude, longitude } = useLocalSearchParams();

    const currentUser = auth.currentUser;

    const [roomData, setRoomData] =  useState(null);
    const [ownerData, setOwnerData] =  useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const scrollViewRef = useRef(null);

    const [distance, setDistance] = useState(null);

    const [numericDistance, setNumericDistance] = useState(null);

    // const fullName = ownerData.firstName + ' ' + ownerData.lastName ;


    const textInputRef = useRef(null);
    const [message, setMessage] = useState("Hello, Is this room available?");


    const [isFavorite, setIsFavorite] = useState(false);

    const openMaps = (lat, lng) => {
        const latLng = `${lat},${lng}`;
        const label = "Room Location";

        const url = Platform.select({
        ios: `maps:0,0?q=${label}@${latLng}`,
        android: `geo:0,0?q=${latLng}(${label})`
        });

        Linking.openURL(url);
    };
    useEffect (() => {
        const fetchOwnerData = async () => {
            try{
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()){
                    setOwnerData({ id: docSnap.id, ...docSnap.data() });
                } 
                else {
                    console.log("No such user!");
                }
            }
            catch(error){
                 console.error("Error fetching owner details:", error);
            }
        };
        if(userId){
            fetchOwnerData();
            // console.log(userId);
        }
    }, [userId]);


    useEffect(() =>{
        // console.log("room id : ", roomId);
        // console.log("user id : ", userId);
        // console.log("latitude : ", latitude);
        // console.log("longitude : ", longitude);

        if (!roomId || !userId) {
            console.log("No roomId or userId provided.");
            setLoading(false);
            return;
        }

        const fetchRoomData = async () => {
            try{
                const docRef = doc(db, 'roomsData', userId, 'rooms', roomId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setRoomData({ id: docSnap.id, ...docSnap.data() });
                    // console.log("Room data fetched:", docSnap.data());   

                    // for distance

                    if (latitude && longitude && data.latitude && data.longitude) {
                        const calculatedDistance = calculateDistance(
                            parseFloat(latitude),
                            parseFloat(longitude),
                            data.latitude,
                            data.longitude
                        );
                        setNumericDistance(calculatedDistance.toFixed(1));
                        setDistance(calculatedDistance.toFixed(1) + ' km');
                    } 
                    else {
                        setNumericDistance(null);
                        setDistance('Location unavailable');
                    }

                } 
                else {
                    console.log("No such document!");
                }
            }
            catch(error) {
                console.error("Error fetching room details:", error);
            }
            finally{
                // setLoading(false);
                setTimeout(() =>{
                    setLoading(false);
                }, Platform.OS === 'ios' ? 100 : 200);
            }
        };


        const checkFavouriteStatus = async () => {
            if (currentUser && roomId) {
                try {
                    const favoriteRef = doc(db, 'users', currentUser.uid, 'favorites', roomId);
                    const favoriteSnap = await getDoc(favoriteRef);
                    setIsFavorite(favoriteSnap.exists());
                }
                catch (error) {
                     console.error("Error checking favorite status:", error);
                }
            }
        }


        fetchRoomData();
        checkFavouriteStatus();
    }, [roomId, userId, latitude, longitude] );

    const roomImages = roomData?.imageUrls || [];

    const onScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / width);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };


    const onModalScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / width);
        setSelectedImageIndex(index);
    };

    const handleImagePress = (index) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    useEffect(() => {
        if (modalVisible && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: selectedImageIndex * width, animated: false });
        }
    }, [modalVisible, selectedImageIndex]);


    const handleFavoriteToggle = async () => {
        if (!currentUser){
             alert("Please log in to save rooms.");
             return;
        }

        const favoriteRef = doc(db, 'users', currentUser.uid, 'favorites', roomId);
        const roomRef = doc(db, 'roomsData', userId, 'rooms', roomId);
        const favoriteData = {
            roomRef: roomRef,
            timestamp: Timestamp.now(),
        };

        try {
            if (isFavorite) {
                await deleteDoc(favoriteRef);
                setIsFavorite(false);
                console.log("Room removed from favorites.");
                
            }
            else{
                await setDoc(favoriteRef, favoriteData);
                setIsFavorite(true);
                console.log("Room added to favorites.");
            }

        }
        catch (error){
            console.error("Error toggling favorite:", error);
            alert("Failed to update favorites. Please try again.");
        }

    };

    return (
        <SafeAreaProvider style= {styles.container}>
            
            <StatusBar barStyle="dark-content"/>
            
            {!modalVisible && (
                <View 
                    style={{ 
                        height: insets.top, 
                        backgroundColor: '#cae6f3ff',
                        position: 'absolute', 
                        top: 0, left: 0, right: 0 
                    }} 
                />

            )}

            
            <View style={{marginTop: insets.top}}></View>

            <View style={styles.topView}>

                <Pressable style={{marginLeft: 5,}}
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
                <Text style={styles.detailsTitle}>Room Details</Text>
            </View>
            
            {/* scrollview */}

            {
                loading ?(
                    <View style={styles.loaderContainer} >
                        <ActivityIndicator size="large" color="#00315e" />
                        <Text style={styles.loadingText}>Fetching room details...</Text>
                    </View>
                ) : !roomData ?(
                    <View style={styles.loaderContainer} >
                        <Text style={styles.noDataText}>Room not found.</Text>
                    </View>
                ) : (

                    <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                        
                    >
                    <ScrollView style={styles.detailsScrollView}
                        showsVerticalScrollIndicator={false}
                    >
                 
                        <View>
                            <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator= {false}
                            onScroll={onScroll}
                            scrollEventThrottle={20}
                            style={{
                                borderRadius: 1,
                                borderBottomWidth: 1,
                                borderBottomColor: '#3d3d3d1e'
                            }}
                            >
                                {roomImages.length > 0 ? (
                                    roomImages.map((image, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => handleImagePress(index)}
                                        >
                                                <Image 
                                                    key={index} 
                                                    source={{ uri: getOptimizedImageUrl(image, 600) }} 
                                                    style={styles.roomImage} 
                                            
                                                />
                                        </Pressable>
                                    ))
                                ) : (
                                    <View style={styles.roomImagePlaceholder}>
                                        <Text style={styles.noImageText}>No images available</Text>
                                    </View>
                                    )
                                }

                            </ScrollView>
                                {roomImages.length > 1 && (
                                <View style={styles.paginationContainer}>
                                {roomImages.length > 1 && (
                                        roomImages.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                { 
                                                    backgroundColor: index === activeIndex ? '#fff' : '#c9c9c9ee', 
                                                    borderWidth: index === activeIndex ? 0 : 1, 
                                                    borderColor: '#d8d8d89c' 
                                                }
                                            ]}
                                        />
                                    ))
                                    
                                    )}
                                 </View>
                                 )}
                        </View>

                        <View style={styles.detailedTitleView}>

                            <Text style={styles.roomTitle}>{roomData.title}</Text>
                            <Text style={styles.roomPrice}>Rs: {roomData.price}/month</Text>

                            {numericDistance < 5 ? (
                                <View style={{display: 'flex', flexDirection: 'row', gap: 2, marginTop: 16,}}>
                                    <Image
                                        source={require('../../assets/man-walking.png')}
                                        style={styles.nearbyMan}
                                    />
                                    <Text style={styles.roomNearby}>Nearby</Text>
                                    <Text style={styles.roomDot}>⋅</Text>
                                    <Text style={styles.roomDistance}>{distance}</Text>

                                </View>
                                
                            ) : (

                                <Text style={styles.roomPlace} >{roomData.place}</Text>

                            )
                        
                            }

                        </View>

                        

                        

                        <View style={styles.messageView}  >
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, margin: 2,}}>
                                <Image
                                    source={require('../../assets/chat.png')}
                                    style={styles.chatImg}
                                />
                                <Text style={styles.messageTitle}>Send message to poster.</Text>
                            </View>

                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, margin: 2, marginTop: 8,}}>
                                <TextInput 
                                    // ref={textInputRef}
                                    style={styles.messageInput}
                                    // multiline={true} 
                                    numberOfLines={3}
                                    defaultValue= {"Hello, Is this room available?"}
                                    value={message}
                                    onChangeText={setMessage} 
                                    returnKeyType="send"
                                    // onSubmitEditing={message.trim() ? handleSendMessage : null}
                                    
                                />


                                <Pressable 
                                    style={[{padding: 8, borderRadius: 10,}, 
                                        message.trim() 
                                            ? { backgroundColor: '#00315e' } 
                                            : { backgroundColor: '#00315ea2' } 
                                    ]}
                                    // onPress={message.trim() ? handleSendMessage : null}
                                    disabled={!message.trim()} 
                                >
                                    <Text style={[
                                        {fontWeight: '600', fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),},

                                        message.trim() 
                                        ? {color: '#fff', }
                                        : {color: '#8f8f8fff', }                                        
                                        
                                        ]} >Send</Text>
                                </Pressable>
                                

                            </View>

                        </View>

                        {/* pressable */}

                        <View style={{display: 'flex', flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            marginTop: 32, 
                            marginHorizontal: 10, 
                            paddingHorizontal: 28,
                            borderBottomWidth: 1, 
                            paddingBottom: 18, 
                            borderBottomColor: '#41414121',
                        
                            }}>

                            <View style={styles.pressableItemsList}>
                                <Pressable style={[styles.pressableItems, 
                                   { backgroundColor: isFavorite ? '#b7ceeb9c' :'#aaa' }
                                ]} onPress={handleFavoriteToggle}>
                                    <Image
                                    source={require('../../assets/heart.png')}
                                    style={[styles.clickableItemImg, 
                                        { tintColor: isFavorite ? '#0e5496ff' : '#000' },
                                    ]}
                                    />
                                </Pressable>

                                <Text style={styles.clickableItemText}>{isFavorite ? 'Saved' : 'Save'}</Text>
                            </View>

                            <View style={styles.pressableItemsList}>
                                <Pressable style={styles.pressableItems}
                                    onPress={() => openMaps(roomData.latitude, roomData.longitude)}
                                >
                                    <Image
                                    source={require('../../assets/pin.png')}
                                    style={styles.clickableItemImg}
                                    />
                                </Pressable>

                                <Text style={styles.clickableItemText}>Open Map</Text>
                            </View>

                            <View style={styles.pressableItemsList}>
                                <Pressable style={styles.pressableItems}>
                                    <Image
                                    source={require('../../assets/share.png')}
                                    style={styles.clickableItemImg}
                                    />
                                </Pressable>

                                <Text style={styles.clickableItemText}>Share</Text>
                            </View>

                            <View style={styles.pressableItemsList}>
                                <Pressable style={styles.pressableItems}>
                                    <Image
                                    source={require('../../assets/error.png')}
                                    style={styles.clickableItemImg}
                                    />
                                </Pressable>

                                <Text style={styles.clickableItemText}>Report</Text>
                            </View>

                           

                        </View>

                        {/* poster information */}

                        {ownerData && (
                        <View style={styles.posterInfo}>
                            <Text style= {styles.posterHeader} >Uploaded By</Text>
                            <View style={{display: 'flex', flexDirection: 'row', gap: 14,  marginTop: 6, alignItems: 'center'}}>
                                { ownerData.profileImageUrl ? (
                                    <Image
                                    source={{ uri: getOptimizedImageUrl(ownerData.profileImageUrl, 600) }} 
                                    style={{ width: 36, height: 36, borderRadius: 50, marginLeft: 4, }}
                                    />
                                ) : (
                                    <Image 
                                    source={require('../../assets/account_icon.png')}
                                    style={{ width: 36, height: 36, borderRadius: 50, tintColor: '#00315e', marginLeft: 4,  }}
                                    />
                                )

                                }
                                <Text style={styles.posterName}>{ownerData.firstName} {ownerData.lastName}</Text>
                            </View>

                        </View>

                        )}

                        {/* Details Section */}

                        <View style={styles.detailsSecion}>
                            <Text style={{fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),  fontWeight: "600", marginBottom: 2,}}>Details</Text>
                            <View>
                                <View style={styles.detailsTwoView}>
                                    <Text style={styles.detailsLeft}>Location</Text>
                                    <Text  style={styles.detailsRight}>{roomData.place}</Text>
                                </View>
                                <View style={styles.detailsTwoView}>
                                    <Text style={styles.detailsLeft}>Price</Text>
                                    <Text  style={styles.detailsRight}>{roomData.price} /month</Text>
                                </View>
                                <View style={styles.detailsTwoView}>
                                    <Text style={styles.detailsLeft}>Room Type</Text>
                                    <Text  style={styles.detailsRight}>{roomData.roomType}</Text>
                                </View>
                                <View style={styles.detailsTwoView}>
                                    <Text style={styles.detailsLeft}>Furnished Status</Text>
                                    <Text  style={styles.detailsRight}>{roomData.furnishingStatus}</Text>
                                </View>

                            </View>

                        </View>




                            {/* Description */}
                        <View style={styles.description}>
                            <Text style={{fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),  fontWeight: "600",}} >Description</Text>
                            <Text style={styles.descriptionText} >{roomData.description}</Text>

                        </View>


                        {/* map view */}

                        <Text style={{fontSize: Platform.OS === 'ios' ? scale(18) : scale(14), 
                            fontWeight: '600',
                            marginHorizontal: 10,
                            marginTop: 4,
                            }}>Room Location</Text>

                        <View style={{ height: 220, borderRadius: 12, overflow: 'hidden', margin: 10, marginBottom: Platform.OS === 'ios' ? 50 : 32 }}>
                            <MapView
                                style={{ flex: 1 }}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                latitude: roomData.latitude,
                                longitude: roomData.longitude,
                                latitudeDelta: 0.0098,
                                longitudeDelta: 0.0098,
                                }}
                                // showsUserLocation
                                // followsUserLocation={true}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: roomData.latitude,
                                        longitude: roomData.longitude,
                                    }}
                                    title="Room Location"
                                    description={roomData.title}
                                />
                            </MapView>
                        </View>

                        
                        

                    </ScrollView>
                     </KeyboardAvoidingView>
                )
            } 


           

            {/* Modal for full-screen image */}
            
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    {/* Top bar with close button and photo count */}
                    <View style={[styles.modalTopBar, { top: insets.top }]}>
                        <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Image
                                source={require('../../assets/close.png')}
                                style={styles.closeIcon}
                            />
                        </Pressable>
                        <Text style={styles.imageCountText}>
                            {selectedImageIndex + 1} of {roomImages.length}
                        </Text>
                    </View>

                    {/* Scrollable Images */}
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onModalScroll}
                        scrollEventThrottle={200}
                    >
                        {roomImages.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: getOptimizedImageUrl(image, 1080) }}
                                style={styles.fullScreenImage}
                                resizeMode="contain"
                            />
                        ))}
                    </ScrollView>
                </View>
            </Modal>

        
        </SafeAreaProvider>
    )
}

export default details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // top view
    topView: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom:6,
        borderBottomWidth: 0.2,
        borderColor: 'rgba(17, 0, 0, 0.62)',
        display: 'flex',
        flexDirection: 'row',
        gap: '86',
        alignItems: 'center',
        backgroundColor: '#cae6f3ff',
    },

    detailsTitle: {
        fontSize: Platform.OS === 'ios' ? scale(24) : scale(18),
        color: '#00315e',
        fontWeight: 'bold',

    },

    roomImage: {
        width: width,
        height: 320,
    },
    roomImagePlaceholder: {
        width: width,
        height: 250,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontSize: 16,
        color: '#888',
    },
    paginationContainer: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 18,
        marginTop: -24,
        backgroundColor: '#3a393959',
        padding: 4,
        maxHeight: 'fit-content',

    },
    dot: {
        width: 6.4,
        height: 6.4,
        borderRadius: 5,
        marginHorizontal: 2,
        marginVertical: 2,
        borderWidth: 1.2,
        borderColor: '#fff'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#00315e',
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
    },
    detailsScrollView: {
        // flex: 1,
        flexGrow: 1,
        backgroundColor: '#fff',
    },

    // detailed view

    detailedTitleView:{
        marginTop: scale(18),
        paddingHorizontal: 10,
    },

    roomTitle: {
        fontSize: Platform.OS === 'ios' ? scale(24) : scale(18),
        fontWeight: '700',
        color: '#00315e',
        marginBottom: 2,
    },
    roomPrice: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(13.4),
        fontWeight: '500',
        color:  Platform.OS === 'ios' ? '#031e38ff' : '#061727ff',
        marginLeft: 1,

    },
    nearbyMan: {
        height: Platform.OS === 'ios' ? scale(14) : scale(16),
        width: Platform.OS === 'ios' ? scale(14) : scale(16),
        marginRight: 5,
    },

    roomNearby: {
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
        color: '#525252ff',
        fontWeight: '500',
    },
    roomDot: {
        fontSize:  scale(22) ,
        marginTop: Platform.OS === 'ios' ? -4 : -7,
        color: '#3b3b3bff',
        fontWeight: '600',
    },

    roomDistance: {
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
        color: '#525252ff',
        fontWeight: '500',
        // fontStyle: 'italic',
    },

    roomPlace: {
        marginTop: 16,
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
        color: '#525252ff',
        fontWeight: '500',
    },

    // message section

    messageView: {
        // flex: 1,
        marginTop: 20,
        marginHorizontal: 12,
        padding: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderColor: '#00000009',
        borderWidth: 1,
        backgroundColor: "#fefefeff",

        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

        //shadow for Android
        elevation: 6,
    },

    chatImg: {
        height: scale(24),
        width: scale(24),
    },

    messageTitle: {
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
        fontWeight: '500',
    },

    messageInput: {
        flex: 1,
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
        minHeight: scale(40),
        color: '#000',
        borderRadius: 10,
        backgroundColor: "#f1efefb9",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },



    // clickable Item

    pressableItemsList: {
        alignItems: 'center',
    },

    pressableItems: {
        padding: 8,
        backgroundColor: "#aaa",
        borderRadius: 50,
    },

    clickableItemImg: {
        height: Platform.OS === 'ios' ? 20 : 18,
        width: Platform.OS === 'ios' ? 20 : 18,

    },
    clickableItemText: {
        marginTop: 5,
        fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
    },


    posterInfo: {
        marginTop: 12,
        marginHorizontal: 10,
        borderBottomWidth: 1, 
        paddingBottom: 14, 
        borderBottomColor: '#41414121',

    },
    posterHeader: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
        fontWeight: '600',
    },
    posterName: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
        // marginTop: 4,
        fontWeight: '600',
        color: '#00315e',
    },


    // details

    detailsSecion : {
        marginTop: 12,
        marginHorizontal: 10,
        borderBottomWidth: 1, 
        paddingBottom: 14, 
        borderBottomColor: '#41414121',
    },

    detailsTwoView :{
        flexDirection: 'row',
        marginVertical: 2,
    },
    detailsLeft : {
        width: 150,
        color: '#494949ff',
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
        marginLeft: 2,
    },

    detailsRight: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
    },


    // description
    description: {
        marginTop: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1, 
        paddingBottom: 14, 
        borderBottomColor: '#41414121',
        marginBottom: 6,

    },

    descriptionText: {
        fontSize: Platform.OS === 'ios' ? scale(18) : scale(14),
        padding:2,
    },



    // for modal

    modalBackground: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    modalTopBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imageCountText: {
        color: '#fff',
        fontSize: Platform.OS === 'ios' ? 16 : 14,
        fontWeight: 'bold',
    },
    fullScreenImage: {
        width: width, 
        height: '100%',
        maxHeight: Dimensions.get('window').height - 170,
        marginTop: 105,
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
    },

});