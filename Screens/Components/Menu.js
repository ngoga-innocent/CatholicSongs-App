import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { GetNotifications } from "../../redux/Features/NotificationSlice";
import { Ionicons } from "@expo/vector-icons";
import { dimensions, COLORS } from "./Global";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { useSelector,useDispatch } from "react-redux";
import { Logout } from "../../redux/Features/AccountSlice";
const Menu = ({ toggleMenu,uploadState, setToggleMenu }) => {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [upload, setUpload] = useState(false);
  const navigation = useNavigation();
  const dispatch=useDispatch()
  const inset = useSafeAreaInsets();
  const {User} =useSelector(state=>state.Account)
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  console.log(User)
  useEffect(() => {
    getUserData();
  }, []);

  // Fetch user data from AsyncStorage
  async function getUserData() {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      console.log(userDataString);
      if (userDataString !== null) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  //Change Language
  // Function to change language
  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("user-language", lang);
      setLanguageModalVisible(false);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };
  //Fecth Notification
  const FetchNotifications = async () => {
    setToggleMenu(false);
    navigation.navigate("notification");
    const result = await dispatch(GetNotifications());
    // if(GetNotifications.rejected.match(result)){
    //   Toast.show({
    //     text1: "Failed to Get Notifications",
    //     type: "error",
    //     autoHide: true,
    //   })
    // }
  };
  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      const result = dispatch(Logout())
      // console.log(result)
      setToggleMenu(false);
      navigation.navigate("Auth", { screen: "Login" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
//Upload A Song
const handleUploadState = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    navigation.navigate("Auth", {
      screen: "Login"
    });
    return;
  }
  
  uploadState(true);
  setToggleMenu(false);
};
  return (
   
    <Modal
      animationType="slide"
      transparent
      visible={toggleMenu}
      onRequestClose={() => setToggleMenu(false)}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)"}}>
        <TouchableWithoutFeedback onPress={() => {
          setToggleMenu(false);
          
          }}  accessible={false}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback >
              <View
                style={{
                  marginTop: inset.top,
                  padding: 20,
                  backgroundColor: "white",
                  width: dimensions.width*0.75,
                  height: dimensions.height * 0.93,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:'space-between'
                  
                }}
              >
                <View className="flex flex-col">
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: dimensions.height * 0.05
                    }}
                  >
                    <Avatar
                      rounded
                      containerStyle={{
                        marginLeft: 10,
                        borderWidth: 1,
                        borderColor: "black",
                        width: 40,
                        height: 40
                      }}
                      size="large"
                      source={
                        User?.user?.profile
                          ? { uri: userData.profile }
                          : require("../../assets/icon.png")
                      }
                    />
                    <Text
                      className="font-bold text-xl"
                      style={{ marginLeft: 10 }}
                    >
                      {User?.user?.username || "Guest"}
                    </Text>
                  </View>
                  <TouchableOpacity className="flex flex-row items-center px-2 justify-between bg-gray-600 rounded-full my-2 py-1" onPress={() => {
                   
                    handleUploadState();}}>
                    <View className="flex flex-row items-center gap-x-2">
                    <MaterialIcons
                      name="playlist-add-circle"
                      size={dimensions.big_icon}
                      color={COLORS.white}
                    />
                    <Text className="text-white font-bold">Upload a Song</Text>
                    </View>
                     <Entypo name="chevron-right" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="flex flex-row items-center px-2 justify-between bg-gray-600 rounded-full my-2 py-1"
                    onPress={() => FetchNotifications()}
                  >
                    <View className="flex flex-row items-center  gap-x-2">
                      <Ionicons
                        name="notifications-circle"
                        size={dimensions.big_icon}
                        color={COLORS.white}
                      />
                      <Text className="text-white font-bold">
                        Notifications
                      </Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex flex-row items-center px-2 justify-between bg-gray-600 rounded-full my-2 py-1"
                    onPress={() =>
                      setLanguageModalVisible(!isLanguageModalVisible)
                    }
                  >
                    <View className="flex flex-row items-center  gap-x-2">
                      <FontAwesome
                        name="language"
                        size={dimensions.big_icon}
                        color={COLORS.white}
                      />
                      <Text className="text-white font-bold">
                        Change Language
                      </Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="rounded-full flex flex-row items-center gap-x-2"
                  style={{
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "orange",
                    borderRadius: 5
                  }}
                  onPress={handleLogout}
                >
                  <AntDesign name="logout" size={24} color={COLORS.white} />
                  <Text
                    className="font-bold"
                    style={{ color: "white", textAlign: "center" }}
                  >
                   {User?.user?.username?'Logout':'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isLanguageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10
            }}
            className="shadow-md shadow-black border border-slate-800"
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Select Language
            </Text>
            <TouchableOpacity onPress={() => changeLanguage("en")}>
              <Text style={{ fontSize: 16, paddingVertical: 10 }}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage("kin")}>
              <Text style={{ fontSize: 16, paddingVertical: 10 }}>
                Kinyarwanda
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>

   
    //Change Language Modal
  );
};

export default Menu;
