import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const MusicianProfile = ({ route }) => {
  const { musicians } = useSelector((state) => state.Musicians);
  const [selectedMusician, setSelectedMusician] = useState();
  //   console.log(musicians);
  const { id } = route.params;
  useEffect(() => {
    const filteredMusician = musicians.filter((musician) => musician.id === id);
    console.log(filteredMusician);
    setSelectedMusician(filteredMusician[0]);
  }, [id]);
  //   console.log(selectedMusician);
  return (
    <ScrollView
      scrollEnabled
      className="flex-1 px-4"
      contentContainerStyle={{
        flex: 1,
        paddingBottom: Dimensions.get("screen").height / 5.3,
      }}
    >
      <Image
        source={
          selectedMusician?.user_data?.profile != null
            ? { uri: selectedMusician?.user_data?.profile }
            : require("../../../assets/DefualtAvatar.jpg")
        }
        resizeMode="cover"
        resizeMethod="resize"
        className="w-[100%] self-center mt-14 h-[40%] border justify-end items-center rounded-xl  bg-blend-overlay blur-lg bg-slate-200"
      />
      {selectedMusician?.recommended && (
        <View className=" self-end -mt-5 h-8 w-8 rounded-full bg-primary items-center justify-center">
          <Entypo name="heart" size={20} color="red" />
        </View>
      )}

      <View className="flex flex-row justify-between  items-center mt-2">
        <Text className="font-bold text-lg max-w-[70%]">
          {selectedMusician?.user_data?.first_name +
            " " +
            selectedMusician?.user_data?.last_name +
            " " +
            selectedMusician?.user_data?.username}
        </Text>
        <View className="flex-end items-end max-w-[40%]  py-2 px-3 rounded-md">
          <View className="flex flex-row items-center">
            <Text className="text-xs font-bold">Verified</Text>
            {selectedMusician?.verified ? (
              <Ionicons name="checkmark-circle-sharp" size={24} color="green" />
            ) : (
              <Entypo name="circle-with-cross" size={24} color="red" />
            )}
          </View>
          <View className="flex flex-row items-center">
            <Entypo name="location-pin" size={24} color="orange" />
            <Text>{selectedMusician?.location}</Text>
          </View>
        </View>
      </View>

      {/* <Text className="">Hello</Text>
        <Avatar
          source={
            selectedMusician?.user_data?.profile != null
              ? { uri: selectedMusician?.user_data?.profile }
              : require("../../../assets/DefualtAvatar.jpg")
          }
          rounded
          size="xlarge"
          resizeMode="cover"
        /> */}

      <View>
        <Text>Description</Text>
        <Text>{selectedMusician?.description}</Text>
      </View>
      <Text className="text-lg font-bold my-2 underline">Capabilities</Text>
      <View className="flex flex-row flex-wrap  gap-2">
        {selectedMusician?.skills_data?.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="bg-slate-300 py-3 px-3 rounded-md"
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View>
        <Text className="text-lg font-bold my-2 underline">Contacts</Text>
        {selectedMusician?.phone_number && (
          <View className="flex flex-row gap-x-1">
            <Text>Phone Number:</Text>
            <Text className="font-bold">{selectedMusician?.phone_number}</Text>
          </View>
        )}
      </View>
      <View className="flex flex-row items-center gap-x-2 my-2">
        <TouchableOpacity className="bg-blue-600 px-4 py-1 rounded-md">
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="px-3 py-1 rounded-md bg-green-600">
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="px-3 py-1 rounded-md bg-blue-600">
          <MaterialIcons name="sms" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* */}
      {/* <View className="flex flex-row justify-evenly flex-end gap-x-3 mx-2  z-10">
        <TouchableOpacity className="bg-blue-600 py-3 items-center flex-1 rounded-md">
          <Text>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-600 py-3 items-center flex-1 rounded-md">
          <Text>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-600 py-3 items-center flex-1 rounded-md">
          <Text>Whatsap</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

export default MusicianProfile;
