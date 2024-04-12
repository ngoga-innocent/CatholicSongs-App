import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text,TouchableOpacity, SafeAreaView,Image } from 'react-native'
import { UseSelector,useDispatch } from "react-redux";
import { Logout } from "../../../redux/Features/AccountSlice";
import { Avatar } from "react-native-elements";
import { Feather } from '@expo/vector-icons';
const Setting = () => {
    const navigation = useNavigation()
    const dispatch=useDispatch()
    const Logoutfunction = async() => {
        // await AsyncStorage.clear()
        dispatch(Logout())
        navigation.navigate("Auth")
        
        // navigation.navigate("Auth")
    }
    return (
        <View className="flex-1  bg-[#D9D9D9]">
            <SafeAreaView className="mt-10">
                <View className="bg-white rounded-lg py-2 px-2 my-5 w-[90%] self-center z-10 shadow-md shadow-black flex flex-row justify-between items-center">
                    <Avatar source={require('../../../assets/icon.png')} rounded size='large' containerStyle={{ borderColor: '#000', borderWidth: 1 }} />
                    <View className="w-[80%] mx-5">
                        <Text className="font-bold">UWERA GLORIOSE</Text>
                        <Text>uweragloriose@gmail.com</Text>
                    </View>
                </View>

                <View className="bg-white rounded-lg py-2 px-2 my-5 w-[90%] self-center z-10 shadow-md shadow-black ">
                    <Text className="font-bold text-lg">Application</Text>
                    <View>
                        <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/modedark.png')} />
                                <Text className="mx-2 font-semibold">Dark Mode</Text>
                            </View>
                            <TouchableOpacity>
                                <Feather name="toggle-left" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />

                         <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/notification.png')} />
                                <Text className="mx-2 font-semibold">Notifications</Text>
                            </View>
                            <TouchableOpacity>
                            <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />


                         <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/languages.png')} />
                                <Text className="mx-2 font-semibold">Languages</Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        
                        
                    </View>
                </View>

                <View className="bg-white rounded-lg py-2 px-2 my-3 w-[90%] self-center z-10 shadow-md shadow-black ">
                    <Text className="font-bold text-lg">Account</Text>
                    <View>
                        <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/User.png')} />
                                <Text className="mx-2 font-semibold">Profile</Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />

                         <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/email.png')} />
                                <Text className="mx-2 font-semibold">Email</Text>
                            </View>
                            <TouchableOpacity>
                            <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />


                         <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/password.png')} />
                                <Text className="mx-2 font-semibold">Password</Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />

                        <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/chat.png')} />
                                <Text className="mx-2 font-semibold">Chatting</Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-[99%] h-1 bg-slate-200 self-center" />

                        <View className="my-1 flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center" >
                                <Image source={require('../../../assets/Invite.png')} />
                                <Text className="mx-2 font-semibold">Share</Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/arrow.png')} />
                            </TouchableOpacity>
                        </View>
                        
                        
                    </View>
                </View>
            </SafeAreaView>
            {/* <Text>Home</Text>
            <TouchableOpacity onPress={()=>Logoutfunction()} className="border px-5 py-1 rounded items-center justify-center">
                <Text className="font-bold">Logout</Text>
            </TouchableOpacity> */}
        </View>
    )
}
export default Setting