import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, dimensions } from "./Global";
import * as Animatable from "react-native-animatable";
import { useSelector, useDispatch } from "react-redux";
import { SearchSong } from "../../redux/Features/CopuesSlice";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetNotifications } from "../../redux/Features/NotificationSlice";
import Toast from "react-native-toast-message";
// import { useDispatch,useSelector } from "react-redux";
export default Header = ({ title,uploadState }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const inset = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [showSearch, setShowShowSearch] = useState(false);
  const [upload,setUpload]=useState(false)
  const handleSearch = async () => {
    // console.log("button pressed")
    const result = await dispatch(SearchSong({ search: search }));
    if (SearchSong.fulfilled.match(result)) {
      navigation.navigate("song_category");
      // console.log("Search result",result.payload)
    }
    if (SearchSong.rejected.match(result)) {
      return Toast.show({
        text1: "Search Failed",
        type: "error",
        autoHide: true
      });
      // console.log("Search error",result.payload)
    }
  };
  const handleUploadState=async()=>{
    const token=await AsyncStorage.getItem("token")
    if(!token){
      navigation.navigate("Auth",{
        screen:"Login"
      })
      return
    }
    setUpload(!upload)
    uploadState(!upload)
  }
  const FetchNotifications=async()=>{
    navigation.navigate("notification")
    const result=await dispatch(GetNotifications())
    // if(GetNotifications.rejected.match(result)){
    //   Toast.show({
    //     text1: "Failed to Get Notifications",
    //     type: "error",
    //     autoHide: true,
    //   })
    // }
    
  }
  return (
    <View className="flex flex-col bg-black">
      <View
        className="flex flex-row items-center justify-between py-2 bg-black "
        style={{ paddingTop: inset.top }}
      >
        <View className="z-50">
          <Toast />
        </View>
        <Text className="text-white font-bold text-2xl"> {title} </Text>
        <View className="flex flex-row items-center justify-between gap-x-4">
          <TouchableOpacity onPress={()=>FetchNotifications()}> 
            <Ionicons
              name="notifications-circle"
              size={dimensions.big_icon}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowShowSearch(!showSearch)}>
            <FontAwesome
              name="search"
              size={dimensions.big_icon * 0.9}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleUploadState()}>
            <MaterialIcons
              name="playlist-add-circle"
              size={dimensions.big_icon * 1.1}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch && (
        <Animatable.View
          easing="ease-in-out-cubic"
          duration={2000}
          animation="fadeIn"
          className=" border px-3 mr-2 flex flex-row items-center justify-between border-white rounded-md"
        >
          <TextInput
            className="py-4 text-white "
            placeholder={`${title}`}
            placeholderTextColor={COLORS.white}
            value={search}
            onChangeText={(e) => setSearch(e)}
          />
          <TouchableOpacity onPress={() => handleSearch()}>
            <AntDesign name="search1" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};
