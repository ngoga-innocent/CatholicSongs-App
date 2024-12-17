import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import { useSelector } from "react-redux";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import SingleMusicianHeader from "../../Components/SingleMusicianHeader";
import { useTranslation } from "react-i18next";
const MusicianProfile = ({ route }) => {
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.1],
    extrapolate: "clamp"
  });
  const { musicians } = useSelector((state) => state.Musicians);
  const [selectedMusician, setSelectedMusician] = useState();
  const { id } = route.params;

  useEffect(() => {
    const filteredMusician = musicians.find((musician) => musician.id === id);
    setSelectedMusician(filteredMusician);
  }, [id]);
  const handleCall = () => {
    const phoneNumber = `tel:${selectedMusician?.phone_number}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert("Unable to open your call application");
        }
      })
      .catch((error) => console.error("Error with calling:", error));
  };
  const handleWhatsap = () => {
    const phoneNumber = `whatsapp://send?phone=${
      selectedMusician?.phone_number?.length > 10
        ? selectedMusician?.phone_number
        : 250 + selectedMusician?.phone_number
    }`;
    Linking.canOpenURL(phoneNumber).then((supported) => {
      if (supported) {
        Linking.openURL(phoneNumber);
      } else {
        Alert.alert("Unable to open your Whatsapp application");
      }
    });
  };
  return (
    <Animated.ScrollView
      className="flex-1 bg-black"
      stickyHeaderIndices={[0]}
      contentContainerStyle={{
        paddingBottom: Dimensions.get("screen").height / 5.3
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      <SingleMusicianHeader
        title={
          selectedMusician?.user_data?.first_name ||
          selectedMusician?.user_data?.last_name
            ? selectedMusician?.user_data?.first_name +
              " " +
              selectedMusician?.user_data?.last_name
            : selectedMusician?.user_data?.username
        }
      />

      <Animated.View className="my-3" style={{ opacity: backgroundOpacity }}>
        <ImageBackground
          source={selectedMusician?.user_data?.profile?{uri:selectedMusician?.user_data?.profile}:require("../../../assets/DefualtAvatar.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <View style={styles.content} className="flex-1 w-[100%] pb-2">
            <View
              className="flex-1 flex flex-row item-center w-full px-5 py-2 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
            >
              <View className="flex-1 flex gap-y-2 flex-col">
                {selectedMusician?.user_data?.first_name ||
                  (selectedMusician?.user_data?.last_name && (
                    <Text style={styles.nameText}>
                      {selectedMusician?.user_data?.first_name +
                        " " +
                        selectedMusician?.user_data?.last_name}
                    </Text>
                  ))}
                <Text className="text-slate-200 font-bold">
                  {selectedMusician?.user_data?.username}
                </Text>
                <Text className="text-slate-200 font-bold">
                  {selectedMusician?.phone_number}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Entypo name="location-pin" size={24} color="gray" />
                <Text className="font-bold text-lg text-slate-200">
                  {selectedMusician?.location}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
      {selectedMusician?.phone_number && (
        <View className="flex flex-row px-4  gap-x-3 my-2">
          <TouchableOpacity
            onPress={() => handleCall()}
            className="bg-blue-600 px-4 py-3 w-[30%] flex flex-col items-center justify-center rounded-full"
          >
            <Ionicons name="call" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleWhatsap()}
            className="px-3 py-3 w-[30%] flex flex-col items-center justify-center rounded-full bg-green-600"
          >
            <Ionicons name="logo-whatsapp" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`sms:${selectedMusician?.phone_number}`)
            }
            className="px-3 py-1 rounded-full bg-blue-600 py-3 w-[30%] flex flex-col items-center justify-center"
          >
            <MaterialIcons name="sms" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View className="bg-slate-400 w-[100%] my-2" style={{ height: 1 }} />
      <View className="border border-gray-600 my-3 py-1 rounded-full flex flex-col items-center  px-4">
        <Text className="text-white text-xl font-bold  px-4">Skills</Text>
      </View>

      <View className="flex flex-row flex-wrap px-4  gap-2 my-1">
        {selectedMusician?.skills_data?.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="bg-transparent border border-slate-600  py-3 px-3 rounded-full w-[27%] items-center "
            >
              <Text className="text-white font-bold text-md">{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="border border-gray-600 my-3 py-2 rounded-full flex flex-col items-center  px-4">
        <Text className="text-white text-xl font-bold px-4">
          Personal Description
        </Text>
      </View>
      <Text className="text-gray-300  font-bold  px-4">
        {" "}
        {selectedMusician?.description}
      </Text>
    </Animated.ScrollView>
  );
};

export default MusicianProfile;

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: Dimensions.get("screen").height *0.5
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  },
  content: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 16
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white"
  },
  locationText: {
    fontSize: 14,
    color: "white"
  }
});
