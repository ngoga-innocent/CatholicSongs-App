import react,{useState,useEffect} from 'react'
import {SafeAreaView,View,Text, TextInput, Button,Image,TouchableOpacity,ScrollView } from 'react-native'
import {useDispatch, useSelector } from 'react-redux'

import { COLORS } from '../../Components/Global'
import { useNavigation } from '@react-navigation/native'
import { Register,LoginFunction } from '../../../redux/Features/AccountSlice'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-toast-message'
const Login = () => {
    const dispatch = useDispatch()
    const navigation=useNavigation()
    const {isLoading,isError,RegisterStatus,message,isLogged }=useSelector((state) => state.Account)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [title, SetTitle] = useState("Login")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // useEffect(() => {
    //     setIsLoggedIn(isLogged)
    //     if (isLogged) {
    //     navigation.navigate('Tab')
    // }
    // },[isLoggedIn])
    
    
    const RegisterSubmit = async () => {
        const userData = { "username": name, "email": email, "password": password }
        
        dispatch(Register(userData))
        if (RegisterStatus) {
            SetTitle("Login")
        } else if(isError){
            Toast.show({
                text1: 'Error For Registration',
                text2: message,
                type: 'error',
                position: 'top',
                visibilityTime:10000
            })
        }
    }
    const userData = { "username": name, "password": password }
    const Login = async () => {
        const userData = { "username": name, "password": password }
       try {
         dispatch(LoginFunction(userData))
       } catch (error) {
        console.log(error)
       }
            
    }
    useEffect(() => {
        setTimeout(() => {
            dispatch(LoginFunction(userData))
        },2000)
    }, [dispatch])
    
    useEffect(() => {
        if (isLogged) {
            navigation.navigate("Tab")
        }
    },[navigation,isLogged])
    return (
        <SafeAreaView className={`flex-1 w-full  bg-[${COLORS.Primary}] pt-20`} >
            <Spinner visible={isLoading} color={COLORS.green} size={20} />
            <Toast />
            <Text className="text-mygreen font-bold text-2xl text-center">{title}</Text>
            <ScrollView className={`flex-1 flex-grow `} contentContainerStyle={{
                flexGrow:1
            }}>
                <View className='items-center justify-center'>
                    
                    <Image source={require('../../../assets/icon.png')} />
                    <Text className='text-white text-xl'>{title=='Login'?"Welcome back":"Let's Get You Registered" }</Text>
                </View>
                
                <View className="flex-1 bg-bg rounded-t-3xl  mt-7">
                    <View className="flex-1 bg-bg rounded-t-3xl items-center mt-20">
                    <View className='-mt-5 flex flex-row mb-4'>
                        <TouchableOpacity onPress={()=>SetTitle("Login")} className={`rounded-2xl border border-white w-32 items-center py-2 ${title=='Login'?'bg-mygreen z-10 ':'bg-bg'}`}>
                            <Text className="font-bold">Login</Text>
                        </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                SetTitle("Register")
                                
                            }} className={`-ml-8 rounded-2xl border border-white w-32 items-center py-2 ${title == 'Register' ? 'bg-mygreen z-10' : 'bg-bg'}`}>
                            <Text className="font-bold">Register</Text>
                        </TouchableOpacity>
                        </View>
                        <Text className="text-orange-600 font-bold">{message }</Text>
                    {title == 'Login' && <>
                        <TextInput value={name} onChangeText={(e) => setName(e)} className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-md text-black font-semibold`} placeholder='Username' />
                        <TextInput value={password} secureTextEntry onChangeText={(e) => setPassword(e)} className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-md text-black font-semibold`} placeholder='Password' />
                        
                        <TouchableOpacity onPress={()=>Login()} className='border bg-primary w-[90%] bg-opacity-20 opacity-80 py-3 items-center rounded-lg my-4'>
                            <Text className="text-white font-bold">Login</Text>
                        </TouchableOpacity>
                        <View className="flex flex-row gap-2 items-center">
                            <Text>Don't have an Account?</Text>
                            <TouchableOpacity >
                                <Text className="text-xl text-mypurple font-bold rounded-md px-3 ">Register</Text>
                            </TouchableOpacity>
                        </View>
                    </>}
                    {title == 'Register' && <>
                        <TextInput value={name} onChangeText={(e) => setName(e)} className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-lg text-black font-semibold`} placeholder='Username' />
                    <TextInput value={email} onChangeText={(e) => setEmail(e)} className= "bg-white my-1 px-2  w-[90%]  py-2 rounded-lg text-black font-semibold" placeholder='email' />
                    <TextInput value={password} secureTextEntry onChangeText={(e) => setPassword(e)} className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-md text-black font-semibold`} placeholder='Password' />

                        <TouchableOpacity onPress={()=>RegisterSubmit()} className="items-center w-[90%] my-2 py-3 bg-primary opacity-80 rounded-lg ">
                                <Text className="text-white font-bold">Register</Text>
                        </TouchableOpacity>
                    </>}
                    </View>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate('Tab')} className="absolute bottom-4 items-center self-center">
                    <Text className="font-bold">Skip for Later</Text>
                </TouchableOpacity>
            </ScrollView>
            
        </SafeAreaView>
    )
}
export default Login