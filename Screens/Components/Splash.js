import React from "react";
import { View, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dimensions } from "./Global";
const Splash = () => {
  const navigation = useNavigation();
  // const token = useSelector(state => state.Account.token)

  const onAnimationEnd = async () => {
    const token = await AsyncStorage.getItem("token");
    const installed = await AsyncStorage.getItem("installed");
    // if (token) {
    //     navigation.navigate('Tab')
    // }
    // else {
    //     navigation.navigate('Auth')
    // }
    installed ? navigation.navigate("Tab") : navigation.navigate("onboarding");
  };
  return (
    <View className="flex-1 items-center justify-center bg-[#282D3B]">
      <Animatable.Image
        className="animate-pulse rounded-full"
        style={{
          width:dimensions.width *0.5,
          height: dimensions.width * 0.5,
          resizeMode: "contain",
          backgroundColor: "transparent",
          borderRadius: dimensions.width * 0.25,
          zIndex: 1000,
        }}
        source={require("../../assets/icon.png")}
        animation="swing"
        duration={5000}
      />
      <Animatable.Text
        className="text-2xl text-white font-bold"
        onAnimationEnd={onAnimationEnd}
        animation="fadeInUpBig"
        duration={5000}
      >
        Catholic Music
      </Animatable.Text>
    </View>
  );
};

export default Splash;
