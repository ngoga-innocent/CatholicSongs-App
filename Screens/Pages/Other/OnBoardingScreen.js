import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dimensions } from "../../Components/Global";
import { registerForPushNotificationsAsync } from "../../Components/Push";

const OnBoardingScreen = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const scrollRef = useRef();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const ImageScreen = [
    {
      image: require("../../../assets/saintfamille.jpg"),
      text: "Welcome to Umuziki Gatolika, the home of Catholic music in Rwanda",
    },
    { image: require("../../../assets/pianist.jpg"), text: "Discover Music" },
    { image: require("../../../assets/violin.jpg"), text: "Learn and Sing Along" },
    { image: require("../../../assets/music_sheets.jpg"), text: "A personal library of music sheets, hymns, and psalms." },
  ];

  const handleNext = async () => {
    if (activeIndex === ImageScreen.length - 1) {
      await AsyncStorage.setItem("installed", "true");
      navigation.navigate("Tab");
    } else {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      scrollRef.current.scrollTo({ x: dimensions.width * nextIndex, animated: true });
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      scrollRef.current.scrollTo({ x: dimensions.width * prevIndex, animated: true });
    }
  };

  const onScrollEnd = (e) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / dimensions.width);
    setActiveIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        ref={scrollRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onMomentumScrollEnd={onScrollEnd}
      >
        {ImageScreen.map((item, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              width: dimensions.width,
              height: dimensions.height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={item.image}
              style={{
                position: "absolute",
                width: dimensions.width,
                height: dimensions.height,
                opacity: 0.04,
              }}
            />
            <Image
              source={item.image}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.6,
                borderRadius: 15,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: dimensions.height *0.02,width:'90%',marginHorizontal:"auto",textAlign:"center" }}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20 }}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={activeIndex === 0}
          style={{
            padding: dimensions.width * 0.027,
            paddingHorizontal: dimensions.width * 0.06,
            backgroundColor: activeIndex === 0 ? "gray" : "blue",
            borderRadius: 20,
            opacity: activeIndex === 0 ? 0.5 : 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={{
            padding: dimensions.width * 0.027,
            paddingHorizontal: dimensions.width * 0.06,
            backgroundColor: activeIndex === ImageScreen.length - 1 ? "green" : "blue",
            borderRadius: 20,
            opacity: 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {activeIndex === ImageScreen.length - 1 ? "Get started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20,alignItems:'center' }}>
        {ImageScreen.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeIndex ? dimensions.width * 0.09 : 10,
              height: index === activeIndex ? dimensions.width * 0.029 : 10,
              borderRadius: 5,
              backgroundColor: index === activeIndex ? "blue" : "gray",
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default OnBoardingScreen;
