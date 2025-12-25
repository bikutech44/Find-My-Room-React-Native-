import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
// import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';




export default function TabLayout() {



  return (
        
    <Tabs screenOptions={{ tabBarActiveTintColor: '#00315e', 
      headerShown: false ,
      tabBarHideOnKeyboard: Platform.OS === 'android' ? true : false,
      

      
    }}>

        
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => 
            focused? (
              <Octicons name="home-fill" size={22} color={color} />
            ) : (        
              <Octicons name="home" size={22} color={color} />
            )
            ,
        }}
      />

      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color,  focused }) => 
            focused? (
              <Ionicons name="heart-sharp" size={26} color={color} />
            ) : (
              <Ionicons name="heart-outline" size={26} color={color} />
            )
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => 
            focused ? (
              <Ionicons name="add-circle" size={30} color={color} />
            ) : (
              <Ionicons name="add-circle-outline" size={30} color={color} />
            ),
        }}
      />

        <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          tabBarIcon: ({ color, focused }) => 
          focused? (
            <Ionicons name="chatbubble" size={24} color={color} />
            
          )  : (
            <Feather name="message-circle" size={25} color={color} />
          )  
          ,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color , focused}) => 
            focused? (
              <Ionicons name="person" size={24} color={color} />   
            ) : (
              <Feather name="user" size={24} color={color} />
              // <Ionicons name="person-outline" size={24} color={color} />
            )
            ,
        }}
      />

    </Tabs>

    
    
    
  );
}
