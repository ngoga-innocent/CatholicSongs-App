import React, { Component, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GetNotifications } from "../../../redux/Features/NotificationSlice";
import { COLORS } from "../../Components/Global";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Push from "../../Components/Push";
const Notification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.Notifications
  );
  useEffect(() => {
    FetchNotifications();
  }, []);
  console.log(notifications);
  const inset = useSafeAreaInsets();
  const FetchNotifications = async () => {
    const result = await dispatch(GetNotifications());
    if (GetNotifications.rejected.match(result)) {
      Toast.show({
        text1: "Failed to Get Notifications",
        type: "error",
        autoHide: true
      });
    }
  };
  return (
    <View
      className="flex-1 bg-black text-start justify-center items-center w-[100%] px-4"
      style={{ paddingTop: inset.top }}
    >
      <View className="w-[100%] flex flex-row items-center justify-between">
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <FontAwesome6 name="circle-chevron-left" size={35} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text className="text-white text-2xl font-bold text-center">
          
          Notifications
        </Text>
        <MaterialIcons name="notifications" size={35} color={COLORS.white} />
      </View>
      <ScrollView className="my-4 py-3 flex-1 w-[100%]">
        {isLoading && <ActivityIndicator color={COLORS.white} collapsable />}
        {notifications.map((item, index) => (
          <View
            key={index}
            className="py-2 flex flex-row gap-x-2 items-center  self-center  my-1 rounded-lg   flex-1 w-[90%]"
          >
            <View className="ring-white ring-1 border-gray-500 border rounded-full p-2">
            <MaterialIcons name="notifications-active" size={24} color="gray" />
            </View>
            <Text className="text-gray-300 font-bold text-wrap">{item.notification}</Text>
          </View>
        ))}
      </ScrollView>
      
    </View>
  );
};

export default Notification;
