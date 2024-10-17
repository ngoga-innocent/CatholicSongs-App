import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider} from 'react-redux';
import { store } from './redux/store/store';
import Login from './Screens/Pages/Account/Login';
import RootStack from './Screens/Navigations/Navigation';
import React,{useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from './Screens/Components/Global';
export default function App() {
  
  // const Account=useSelector((state)=>state.Account)
  return (
    <Provider store={store}> 
    <StatusBar backgroundColor={COLORS.black}/>
     <RootStack />
    </Provider>
  );
}

