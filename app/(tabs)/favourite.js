import { View, Text, StyleSheet, StatusBar, Platform, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'
import { scale } from '../../utils/styling'
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot, query, where, orderBy, limit, QuerySnapshot } from 'firebase/firestore';
import { Pressable } from 'react-native';
import { Image, Dimensions } from 'react-native';
import { router } from 'expo-router';

import locationManager from '../../utils/LocationManager';


const getOptimizedImageUrl = (url, width) => {
  if (!url) return false;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_${width},q_auto:best/${parts[1]}`;
  }
  return url;
};

const favourite = () => {
  const insets = useSafeAreaInsets();
  const [favouriteRooms, setFavouriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged (auth, (user) =>{
        if(user){
        const userFavouriteRef = collection(db, 'users', user.uid, 'favorites');

        const unsubscribeFavourites = onSnapshot(query(userFavouriteRef, orderBy('timestamp', 'desc')), async (QuerySnapshot) => {
          const favouritePromises = QuerySnapshot.docs.map(async (favDoc) => {
            const favouriteData = favDoc.data();
            const roomRef = favouriteData.roomRef;

            if(roomRef){
              try{
                const roomSnap = await getDoc(roomRef);
                if (roomSnap.exists()) {
                  return { 
                    id: roomSnap.id, 
                    ...roomSnap.data(),
                    favouriteTimestamp: favouriteData.timestamp
                  };
                }
              }
              catch (error){
                console.error("Error fetching favourited room: ", error);
              }
            }
            return null;

          });

          const rooms = (await Promise.all(favouritePromises)).filter(Boolean);
          setFavouriteRooms(rooms);
          setTimeout(() =>{
            setLoading(false);
          }, Platform.OS === 'ios' ? 100 : 200);

        }, error =>{
          console.error("Error fetching favourites: ", error);
          setLoading(false);
        });
        return () => unsubscribeFavourites();
      } else{
        setFavouriteRooms([]);
        setLoading(false);
      }
    } );
    return () => unsubscribeAuth();
  }, []);


  const {location} = locationManager.getLocation();



  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content"/>

      {/* <View 
        style={{ 
          height: insets.top, 
          backgroundColor: '#63c5ec5d', 
          // backgroundColor: '#cae6f3ff',
          position: 'absolute', 
          top: 0, left: 0, right: 0 
        }} 
      />
             */}
      {/* <View style={[styles.container, {marginTop: insets.top}]}></View> */}


      

      <View style={[styles.titleView, {paddingTop: insets.top, height: insets.top + 34, }]}>
        <BlurView 
          intensity={Platform.OS === 'ios'? 40 : 40 }
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={[styles.blurOverlay, {height: insets.top + 34,}]}
        />
        <Text style={styles.savedTitle}>Saved Rooms</Text>

      </View>

      <ScrollView style={styles.roomsContainer} showsVerticalScrollIndicator={false}>

        {loading ? (
          // Show a loading indicator while data is being fetched
          <ActivityIndicator size="large" color="#00315e" style={styles.loader} />
        ) : favouriteRooms.length > 0 ? (
          // Render the list of favourite rooms
          <View style={styles.otherRoomsContainer}>
            {favouriteRooms.map(room => (
              <Pressable
                key={room.id}
                style={styles.otherRoomCard}
                onPress={() => router.push({
                  pathname: './../room/details',
                  params: { roomId: room.id, userId: room.userId, latitude: location.latitude, longitude: location.longitude }
                })}
              >
                <Image
                  source={{ uri: getOptimizedImageUrl(room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls[0] : null, 600) }}
                  style={styles.otherRoomImage}
                />
                <View style={styles.otherRoomInfo}>
                  <Text style={styles.otherRoomTitle} numberOfLines={1}>{room.title}</Text>
                  <Text style={styles.otherRoomPrice}>Rs: {room.price}/month</Text>
                  <Text style={styles.otherLocation} numberOfLines={1}>Location: {room.place}</Text>
                  <Text style={styles.otherRoomType}>{room.roomType}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          // Show a message if there are no favourite rooms
          <Text style={styles.noDataText}>You haven't saved any rooms yet.</Text>
        )}

      </ScrollView>
    </SafeAreaProvider>
  )
}

export default favourite;

const styles = StyleSheet.create({ 

  // blur view
  blurOverlay: {
    position: 'absolute',
    top: 0,
    // height: Platform.OS === 'ios'? 80 : 60,
    left: 0,
    right: 0,
    zIndex: 2,
  },

  // headings
  titleView: {
    // height:  Platform.OS === 'ios'? 75 : 55,
    backgroundColor:  Platform.OS === 'ios'? '#63c5ec5d' : '#63c5ec88',
    // backgroundColor: '#63c5ec5d',
    zIndex: 5,

  },
  savedTitle: {
    fontSize: Platform.OS === 'ios' ? scale(24) : scale(18),
    color: '#00315e',
    fontWeight: 'bold',   
    // paddingTop: 2,
    // paddingBottom: 12,
    textAlign: 'center',
    zIndex: 5,

  },


   roomsContainer: {
    // paddingTop: scale(10),
    paddingTop: 76,
    marginTop: -70,
    // marginBottom: Platform.OS === 'ios' ? scale(40) : scale(46),
    minHeight: scale(650),
    // paddingBottom: Platform.OS === 'ios' ? 30 : 80,
    
  },
  loader: {
    marginTop: scale(52),
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    color: '#888',
  },
  // other rooms card styles
  otherRoomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: scale(5),
    marginLeft: scale(5),
    marginRight: scale(5),
    marginVertical: scale(8),
    paddingBottom: Platform.OS === 'ios' ? 6 : 70,
  },
  otherRoomCard: {
    backgroundColor: '#fafafaff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '48%', // For two columns
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  otherRoomImage: {
    width: '100%',
    height: Platform.OS === 'ios' ? scale(110) : scale(100),
    borderRadius: 8,
    marginBottom: 5,
  },
  otherRoomInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  otherRoomTitle: {
    fontSize: Platform.OS === 'ios' ? scale(16) : scale(14),
    fontWeight: 'bold',
    color: '#00315e',
    marginBottom: 2,
  },
  otherRoomPrice: {
    fontSize: Platform.OS === 'ios' ? scale(14) : scale(12),
    fontWeight: 'bold',
    color: '#00315e',
    marginBottom: 2,
  },
  otherLocation: {
    fontSize: Platform.OS === 'ios' ? scale(15.4) : scale(12.6),
    color: '#00315eda',
    fontWeight: '600',
    marginBottom: 2,
  },
  otherRoomType: {
    fontSize: Platform.OS === 'ios' ? scale(15) : scale(12),
    color: '#00315eda',
    fontWeight: '600',
  },



});