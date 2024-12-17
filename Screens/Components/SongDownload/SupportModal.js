import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, FlatList, Dimensions,ActivityIndicator, Alert } from "react-native";
import {Url} from "../../../Url"
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SupportModal = ({visible,setSupportVisible}) => {
  const [open, setOpen] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const predefinedAmounts = [500, 1000, 5000, 10000]; // Predefined amounts in RWF
  const [donating,setDonating]=useState(false);
  const handleAmountSelection = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };
const handleSupport=async()=>{
  console.log("DONATING")
  const token=await AsyncStorage.getItem("expoPushToken")
  if(!token){
    token ="Donating_Device"
  }
  if (!phoneNumber || !amount) return Alert.alert("Please Fill All Fields");
  setDonating(true)
  const myHeaders=new Headers();
  myHeaders.append("Content-Type", "application/json");
  const myBody=JSON.stringify({
    "phone_number":phoneNumber,
    "amount":parseFloat(amount),
    "device_token":token
  });
  const requestOptions={
    method:"POST",
    headers:myHeaders,
    body:myBody,
    redirect:"follow"
  }
  const response=await fetch(`${Url}/payments/`,requestOptions);
  if(!response.ok){
    console.log("errro",await response.json());
    setDonating(false)
    
    return Toast.show({
      text1: "Failed to make a Donation",
      type: "error",
      autoHide: true,
      visibilityTime:10000
    })
  }
  console.log("donated",await response.json())
  setDonating(false)
  setSupportVisible(false)
  return Toast.show({
    text1: "Thank You for Supporting ",
    text2: "Your donation is successfully recieved",
    type: "success",
    autoHide: true,
    visibilityTime:10000
  })
}
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={() => setSupportVisible(false)}
      animationType="slide"
    >
    <View className="z-50">
    <Toast />
    </View>
      <View
        className="flex-1 flex flex-col justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <TouchableWithoutFeedback onPress={() => setSupportVisible(false)}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View className="h-[70%] bg-white w-full rounded-t-xl p-6 text-center">
            {/* Modal Header */}
            {donating && <Text className="text-green-700 font-bold">Processing ...</Text>}
            <View className="flex items-center mb-4">
            <View
                className="overflow-hidden "
                style={{
                  width: Dimensions.get("screen").width * 0.9,
                  height: Dimensions.get("screen").height * 0.07,
                  
                  
                  borderColor: "#ddd",
                }}
              >
                <Image
                  className="w-full h-full"
                  source={require("../../../assets/airtel_momo.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain", // Ensures the image fits within the circle while maintaining its aspect ratio
                  }}
                />
              </View>
              <Text className="text-lg font-bold text-gray-800 mt-2">
                Support Us
              </Text>
              <Text className="text-sm text-gray-600">
                Enter your phone number and amount to support.
              </Text>
            </View>

            {/* Input Fields */}
            <View className="flex flex-col gap-y-4 mb-6">
              {/* Phone Number Input */}
              <TextInput
                className="border border-gray-300 rounded-md px-4 py-2 text-lg"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              {/* Amount Input */}
              <TextInput
                className="border border-gray-300 rounded-md px-4 py-2 text-lg"
                placeholder="Enter Amount (RWF)"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Predefined Amount Buttons */}
            <View className="flex flex-row flex-wrap gap-2 mb-6">
              {predefinedAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  className="bg-indigo-500 rounded-full px-4 py-2"
                  onPress={() => handleAmountSelection(value)}
                >
                  <Text className="text-white text-sm font-bold">
                    {value.toLocaleString()} RWF
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-indigo-500 rounded-full py-3"
              onPress={()=>handleSupport()}
              
            >
              <Text className="text-white text-center text-lg font-bold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default SupportModal;
