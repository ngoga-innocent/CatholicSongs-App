import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, dimensions } from "./Global";
import * as Animatable from "react-native-animatable";

import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import { useDispatch,useSelector } from "react-redux";
export default SingleMusicianHeader = ({ title, uploadState }) => {
  const navigation = useNavigation();

  const inset = useSafeAreaInsets();

  return (
    <View className="flex flex-col bg-black">
      <View
        className="flex flex-row items-center justify-between py-2 px-2 bg-black "
        style={{ paddingTop: inset.top }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6
            name="circle-chevron-left"
            size={35}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text className="text-white font-bold text-2xl"> {title} </Text>
        <TouchableOpacity>
          <MaterialIcons name="recommend" size={35}
            color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
