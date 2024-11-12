import React, { Component } from "react";
import { View, Text, ImageBackground, ScrollView } from "react-native";
import SingleMusicianHeader from "../../Components/SingleMusicianHeader";
import { LinearGradient } from "expo-linear-gradient";
import { dimensions } from "../../Components/Global";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
export default SingleEvent = ({ route }) => {
  const { event } = route.params;
  
  return (
    <ScrollView className="bg-black flex-1 flex flex-col px-2" stickyHeaderIndices={[0]} >
      <SingleMusicianHeader title={event.title} />
      <ImageBackground
        source={{ uri: event.thumbnail }}
        style={{ height: dimensions.height * 0.43 }}
        className="my-4 flex flex-col justify-end"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 10
          }}
        />
        <View style={{ padding: dimensions.width * 0.02 }}>
          <Text
            style={{
              color: "white",
              fontSize: dimensions.big_icon * 0.75,
              fontWeight: "bold"
            }}
          >
            {event.title}
          </Text>
        </View>
      </ImageBackground>
      <View className="flex flex-row gap-x-2 items-center rounded-full border border-slate-600 my-4 py-2">
        <EvilIcons name="calendar" size={dimensions.big_icon} color="white" />
        <View className="flex flex-row items-center gap-x-2 py-2 ">
          <Text className="text-white text-lg font-bold">
            {new Date(event?.date || null).toLocaleDateString()}
          </Text>
          <Text className="text-white text-lg font-bold">
            {new Date(event?.date || null).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </View>
      </View>
      <View className="flex flex-row gap-x-2 items-center rounded-full border border-slate-600 mb-4 py-2">
        <Entypo name="location-pin" size={dimensions.big_icon} color="white" />
        <Text className="text-white text-lg font-bold">{event?.location}</Text>
      </View>
      <View className="flex flex-col  py-2 px-4 rounded-lg border border-slate-600 my-2 bg-slate-900 ">
        
        <Text className="text-white text-lg font-bold">Description</Text>
        <Text className="text-white mt-2">{event?.description}</Text>
      </View>
    </ScrollView>
  );
};
