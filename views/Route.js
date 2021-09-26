import React from 'react';
import { View, Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// custom import
import Splash from './Splash';
import Login from './Main/Login';
import Home from './Main/Home';

const Stack = createStackNavigator();
export default function Route () {
    return (
        <NavigationContainer>
            <Stack.Navigator
                // this options hide all header
                screenOptions={{
                    headerShown: false
                }}   
                
                initialRouteName = "splash"
            >
                <Stack.Screen
                // this options hide this screen's header
                // screenOptions={{
                //     headerShown: false
                // }}  
                name = "splash" component = {Splash} />
                
                <Stack.Screen name = "login" component = {Login} />
                <Stack.Screen name = "home" component = {Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
