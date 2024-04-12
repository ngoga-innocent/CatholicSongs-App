
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import Splash from "../Components/Splash";
import AuthStack from "./AuthScreen";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import React,{useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../../redux/Features/AccountSlice";
const RootStack = () => {
    const stack=createNativeStackNavigator()
    const token = useSelector(state => state.Account.token)
    console.log(token)
    const dispatch=useDispatch()
    
    return (
        <NavigationContainer>
            <stack.Navigator initialRouteName="Splash">
                <stack.Screen name="Splash" component={Splash} options={{
                headerShown:false
                }} />
               
                    <stack.Screen name="Tab" component={BottomTab} options={{
                        headerShown:false
                    }} />
                    <stack.Screen name="Auth" component={AuthStack} options={{
                    headerShown:false
                    }} />
                
                
            </stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack