import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, dimensions } from "./Global";
import * as Animatable from "react-native-animatable";
import { useSelector, useDispatch } from "react-redux";
import { RequestSong, SearchSong } from "../../redux/Features/CopuesSlice";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Avatar } from "react-native-elements";

// import { useDispatch,useSelector } from "react-redux";
export default Header = ({ title, uploadState, setToggleMenu, toggleMenu }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const inset = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [showSearch, setShowShowSearch] = useState(false);
  const [request_Song, setRequestSong] = useState(false);
  const [requested_song_title, setRequestSongTitle] = useState("");
  const handleSearch = async () => {
    // console.log("button pressed")
    const result = await dispatch(SearchSong({ search: search }));
    if (SearchSong.fulfilled.match(result)) {
      navigation.navigate("song_category");
      console.log("Search result", result.payload);
    }
    if (SearchSong.rejected.match(result)) {
      setTimeout(() => {
        setRequestSong(true);
      }, 2000);
      return Toast.show({
        text1: "Sorry, The song you have searched is not available ",
        text2:
          "Raise a request of the song for our team to find It and get back to you as soon as possible",
        type: "info",
        autoHide: true,
        visibilityTime: 8000,
        position: "top"
      });

      // console.log("Search error",result.payload)
    }
  };
  const RequestSongFunction = async () => {
    const trimmedTitle = requested_song_title.trim(); // Normalize input
    if (!trimmedTitle) {
      console.log("Song name cannot be empty");
      Toast.show({
        text1: "Invalid Input",
        text2: "Song name cannot be empty. Please provide a valid name.",
        type: "error",
        autoHide: true,
        visibilityTime: 5000,
        position: "top"
      });
      return;
    }
  
    
  
    const result = await dispatch(RequestSong({ name: trimmedTitle }));
    // console.log("Dispatch result:", result);
  
    if (RequestSong.fulfilled.match(result)) {
      // console.log("Song request successful:", result.payload);
      return Toast.show({
        text1: "We have received your request!",
        text2: "Our team will get back to you soon.",
        type: "success",
        autoHide: true,
        visibilityTime: 8000,
        position: "top"
      });
    } else if (RequestSong.rejected.match(result)) {
      console.error("Song request rejected:", result.payload || result.error);
      return Toast.show({
        text1: "Sorry, Your request was rejected",
        text2: result.payload?.error || "Please try again.",
        type: "error",
        autoHide: true,
        visibilityTime: 8000,
        position: "top"
      });
    } else {
      console.error("Unexpected result:", result);
      Toast.show({
        text1: "Unexpected Error",
        text2: "An unexpected error occurred. Please try again.",
        type: "error",
        autoHide: true,
        visibilityTime: 8000,
        position: "top"
      });
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
        <TouchableOpacity onPress={() => setToggleMenu(!toggleMenu)}>
          <Avatar
            icon={{ name: "menu" }}
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
            onEndEditing={() => handleSearch()}
          />
          <TouchableOpacity className="mx-2" onPress={() => handleSearch()}>
            <AntDesign name="search1" size={25} color={COLORS.white} />
          </TouchableOpacity>
        </Animatable.View>
      )}
      <Modal
        className="flex-1"
        visible={request_Song}
        onRequestClose={() => setRequestSong(false)}
        transparent
        animationType="slide"
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          {/* Outer TouchableWithoutFeedback to close modal */}
          <TouchableWithoutFeedback onPress={() => setRequestSong(false)}>
            <View className="flex-1">
              {/* Modal Content */}
              <View className="bg-white w-full py-8 rounded-t-lg items-center absolute bottom-0">
                {/* Inner TouchableWithoutFeedback to prevent closing */}
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View className="w-full flex flex-col items-center gap-y-4">
                    <Text className="text-lg font-bold text-gray-600">
                      {t("request")}
                    </Text>
                    <TextInput 
                    value={requested_song_title}
                    onChangeText={(e)=>setRequestSongTitle(e)}
                      className="bg-gray-100 py-2 px-3 rounded-full w-[80%]"
                      placeholder="Request a song"
                    />
                    <TouchableOpacity
                      onPress={() => RequestSongFunction()}
                      className="bg-blue-500 text-white py-2 px-10 rounded-full"
                    >
                      <Text className="text-lg font-bold text-white">
                        {t("request")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
};
