import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal
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

import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Avatar } from "react-native-elements";
// import { useDispatch,useSelector } from "react-redux";
export default Header = ({ title, uploadState, setToggleMenu,toggleMenu }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const inset = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [showSearch, setShowShowSearch] = useState(false);
  
  const handleSearch = async () => {
    // console.log("button pressed")
    const result = await dispatch(SearchSong({ search: search }));
    if (SearchSong.fulfilled.match(result)) {
      navigation.navigate("song_category");
      console.log("Search result", result.payload);
    }
    if (SearchSong.rejected.match(result)) {
      return Toast.show({
        text1: "No Song found",
        type: "info",
        autoHide: true,
        visibilityTime: 8000,
        position: "top"
      });
      // console.log("Search error",result.payload)
    }
  };

  return (
    <View className="flex flex-col items-start bg-black">
      <View className="z-50">
        <Toast />
      </View>
      <View
        className="w-full flex flex-row items-center justify-between px-2 py-2 bg-black "
        style={{ paddingTop: inset.top }}
      >
        <TouchableOpacity onPress={()=>setToggleMenu(!toggleMenu)}>
          <Avatar
            icon={{name:'menu'}}
            size="medium"
            rounded
            overlayContainerStyle={{
              borderWidth: 1,
              borderColor: "white"
            }}
          />
        </TouchableOpacity>
        <Text className="text-white font-bold text-2xl"> {t("app_name")} </Text>
        <View className="flex flex-row items-center justify-between gap-x-4">
          
          <TouchableOpacity onPress={() => setShowShowSearch(!showSearch)}>
            <FontAwesome
              name="search"
              size={dimensions.big_icon * 0.9}
              color={COLORS.white}
            />
          </TouchableOpacity>
          
        </View>
      </View>
      {showSearch && (
        <Animatable.View
          easing="ease-in-out-cubic"
          duration={1000}
          animation="fadeIn"
          className=" border w-[85%]  mx-auto flex flex-row items-center justify-between border-white rounded-full py-1"
        >
          <TextInput
            className="py-1 px-3  flex-1 text-white "
            placeholder={`${title}`}
            placeholderTextColor="gray"
            value={search}
            onChangeText={(e) => setSearch(e)}
            onEndEditing={()=>handleSearch()}
          />
          <TouchableOpacity className="mx-2" onPress={() => handleSearch()}>
            <AntDesign name="search1" size={25} color={COLORS.white} />
          </TouchableOpacity>
        </Animatable.View>
      )}
      
    </View>
  );
};
