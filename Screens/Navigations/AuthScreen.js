import React from "react";
import { } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../Pages/Account/Login'
import Register from "../Pages/Account/Register";
const AuthStack = () => {
    const stack=createNativeStackNavigator()
    return (
        <stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown:false
        }}>
            <stack.Screen name="Login" component={Login} />
            <stack.Screen name="register" component={Register}/>
        </stack.Navigator>
    )
}
export default AuthStack