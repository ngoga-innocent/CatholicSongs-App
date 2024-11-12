import React, { useState, useRef,useEffect } from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { dimensions } from "../../Components/Global";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../../Components/Push";

const OnBoardingScreen = () => {
  useEffect(()=>{
    registerForPushNotificationsAsync()
  },[])
  const scrollRef = useRef();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const ImageScreen = [
    {
      image: require("../../../assets/saintfamille.jpg"),
      text: "Welcome to Umuziki Gatolika, the home of Catholic music in Rwanda"
    },
    { image: require("../../../assets/pianist.jpg"), text: "Discover Music" },
    { image: require("../../../assets/violin.jpg"), text: "Learn and Sing Along" },
    { image: require("../../../assets/music_sheets.jpg"), text: "A personal library of music sheets, hymns, and psalms." }
  ];

  const handleNext = async () => {
    if (activeIndex === ImageScreen.length - 1) {
      await AsyncStorage.setItem('installed', 'true');
      navigation.navigate("Tab");
    } else {
      setActiveIndex(activeIndex + 1);
      scrollRef.current.scrollTo({ x: dimensions.width * (activeIndex + 1), animated: true });
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollRef.current.scrollTo({ x: dimensions.width * (activeIndex - 1), animated: true });
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        horizontal
        ref={scrollRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={(e) => {
          const scrollPosition = e.nativeEvent.contentOffset.x;
          const index = Math.floor(scrollPosition / dimensions.width);
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {ImageScreen.map((item, index) => (
          <View
            className="flex-1 flex flex-col items-center justify-center"
            key={index}
            style={{
              flex: 1,
              width: dimensions.width,
              height: dimensions.height
            }}
          >
            <ImageBackground
              source={item.image}
              style={{
                position: "absolute",
                flex: 1,
                width: dimensions.width,
                height: dimensions.height,
                opacity: 0.04
              }}
              className="flex flex-col justify-end py-9 px-3 flex-wrap"
            />
            <Image
              source={item.image}
              className="object-cover rounded-2xl"
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.6
              }}
            />
            <Text className="font-bold text-2xl my-2">{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-between px-5 pb-5">
        <TouchableOpacity
          className="py-2 px-3 rounded-full"
          onPress={handlePrevious}
          disabled={activeIndex === 0}
          style={{
            opacity: activeIndex === 0 ? 0.5 : 1,
            backgroundColor: "rgba(0,0,0,0.7)"
          }}
        >
          <Text className="text-white font-bold text-lg">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-2 px-6 rounded-full"
          onPress={handleNext}
          disabled={activeIndex === ImageScreen.length }
          style={{
            opacity: activeIndex === ImageScreen.length - 1 ? 0.5 : 1,
            backgroundColor: "rgba(0,0,0,0.7)"
          }}
        >
          <Text className="text-white font-bold text-lg">
            {activeIndex === ImageScreen.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center py-2 px-3 absolute bottom-4 self-center">
        {ImageScreen.map((_, index) => (
          <View
            key={index}
            className={`border border-white p-2 h-2 w-2 rounded-full ${
              index === activeIndex
                ? "border-2 border-blue-500 bg-blue-500 w-14"
                : "border-2 bg-gray-400 border-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default OnBoardingScreen;
