import React, { Component, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useDispatch,useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GetNotifications } from "../../../redux/Features/NotificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const {notifications} = useSelector((state) => state.Notifications);
  useEffect(()=>{
FetchNotifications()
  },[])
  console.log(notifications)
  const inset = useSafeAreaInsets();
  const FetchNotifications=async()=>{
    
    const result=await dispatch(GetNotifications())
    if(GetNotifications.rejected.match(result)){
      Toast.show({
        text1: "Failed to Get Notifications",
        type: "error",
        autoHide: true,
      })
    }
    
  }
  return (
    <View className="flex-1 bg-black text-start justify-center items-start px-2" style={{paddingTop:inset.top}}>
      
      <Text className="text-white text-2xl font-bold text-center"> Notifications </Text>
      <ScrollView className="my-4">
        {notifications.map((item, index) => (
          <View key={index} className="py-2">
            <Text className="text-gray-300 font-bold">{item.notification}</Text>
            <Text>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
