import react, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../Components/Global";
import { useNavigation } from "@react-navigation/native";
import { Register, LoginFunction } from "../../../redux/Features/AccountSlice";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { Avatar } from "react-native-elements";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Login = () => {
  const inset=useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, RegisterStatus, message, isLogged } = useSelector(
    (state) => state.Account
  );
  const {t}=useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, SetTitle] = useState("Login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber,setPhoneNumber]=useState("")
  // useEffect(() => {
  //     setIsLoggedIn(isLogged)
  //     if (isLogged) {
  //     navigation.navigate('Tab')
  // }
  // },[isLoggedIn])
  //handling Profile Image
  const ProfileImageHandle = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      quality: 0.5
    });
    if (!result.canceled) {
        console.log(result.assets[0].fileSize)
      if(result.assets[0].fileSize>10485760) return Alert.alert("Image size is too large.please try another Image")
      setProfileImage({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: result.assets[0].mimeType
      });
    } else {
      Alert.prompt("Profile Image upload cancelled");
    }
  };
  const RegisterSubmit = async () => {
    const userData = { username: name, email: email, password: password,phone_number:phoneNumber};
    if(profileImage) userData={...userData,...{profile: profileImage}}
    
    if(password !=confirmPassword) return Alert.alert("password Does not match")
    const result=await dispatch(Register(userData));
if(Register.fulfilled.match(result)){
    SetTitle("Login")
    Toast.show({
        text1: "Thanks for registering",
        text2: "You have successfully registered",
        type: "success",
        position: "top",
        visibilityTime: 10000
      });
      
}
     else if (Register.rejected.match(result)) {
      Toast.show({
        text1: "Error For Registration",
        text2: message,
        type: "error",
        position: "top",
        visibilityTime: 10000
      });
    }
  };
//   const userData = { username: name, password: password };
  const Login = async () => {
    const userData = { username: name, password: password };
    try {
      const result=await dispatch(LoginFunction(userData));
      if(LoginFunction.fulfilled.match(result)) {
        console.log(result);
        const jsonData=JSON.stringify(result.payload.user)
        const token=JSON.stringify(result.payload.token)
        await AsyncStorage.setItem("userData", jsonData);
        await AsyncStorage.setItem("token", result?.payload?.token);
        navigation.navigate("Tab")
      }
      else if (LoginFunction.rejected.match(result)) {
        Toast.show({
          text1: "Error For Login",
          text2: message,
          type: "error",
          position: "top",
          visibilityTime: 10000
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //     setTimeout(() => {
  //         dispatch(LoginFunction(userData))
  //     },2000)
  // }, [dispatch])

  useEffect(() => {
    if (isLogged) {
      navigation.navigate("Tab");
    }
  }, [navigation, isLogged]);
  return (
    <SafeAreaView className={`flex-1 w-full  bg-[${COLORS.Primary}]`} style={{
      paddingTop: inset.top,
      paddingBottom: inset.bottom,
      
    }}>
      <Spinner visible={isLoading} color={COLORS.green} size={20} />
      <Toast />
      <View className="py-6">
      <Text className="text-mygreen font-bold text-2xl text-center">
        {title}
      </Text>
      </View>
      <ScrollView
        className={`flex-1 `}
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        <View className="flex-1">
        <View className="items-center justify-center">
          <Image
            source={require("../../../assets/icon.png")}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white text-xl">
            {title == "Login" ? "Welcome back" : "Let's Get You Registered"}
          </Text>
        </View>

        <View className="flex-1 bg-bg rounded-t-3xl  mt-7">
          <View className="flex-1 bg-bg rounded-t-3xl items-center mt-20">
            <View className="-mt-5 flex flex-row mb-4">
              <TouchableOpacity
                onPress={() => SetTitle("Login")}
                className={`rounded-2xl border border-white w-32 items-center py-2 ${
                  title == "Login" ? "bg-mygreen z-10 " : "bg-bg"
                }`}
              >
                <Text className="font-bold">{t("login")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  SetTitle("Register");
                }}
                className={`-ml-8 rounded-2xl border border-white w-32 items-center py-2 ${
                  title == "Register" ? "bg-mygreen z-10" : "bg-bg"
                }`}
              >
                <Text className="font-bold">{t("register")}</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-orange-600 font-bold">{message}</Text>
            {title == "Login" && (
              <>
                <TextInput
                  value={name}
                  onChangeText={(e) => setName(e)}
                  className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-md text-black font-semibold`}
                  placeholder="Username/phone Number"
                />
                <TextInput
                  value={password}
                  secureTextEntry
                  onChangeText={(e) => setPassword(e)}
                  className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-md text-black font-semibold`}
                  placeholder="Password"
                />

                <TouchableOpacity
                  onPress={() => Login()}
                  className="border bg-primary w-[90%] bg-opacity-20 opacity-80 py-3 items-center rounded-lg my-4"
                >
                  <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
                <View className="flex flex-row gap-2 items-center">
                  <Text>Don't have an Account?</Text>
                  <TouchableOpacity>
                    <Text className="text-xl text-mypurple font-bold rounded-md px-3 ">
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {title == "Register" && (
              <>
                <TouchableOpacity
                  onPress={() => ProfileImageHandle()}
                  className="rounded-full px-1 py-1 border border-slate-900"
                >
                  {profileImage ? (
                    <Avatar
                      rounded
                      size="large"
                      source={{ uri: profileImage.uri }}
                    />
                  ) : (
                    <Avatar size="large" rounded icon={{ name: "photo" }} />
                  )}
                </TouchableOpacity>
                <Text className="font-bold">Profile Picture</Text>
                <TextInput
                  value={name}
                  onChangeText={(e) => setName(e)}
                  className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-lg text-black font-semibold`}
                  placeholder="Username"
                  autoFocus={true}
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={(e) => setPhoneNumber(e)}
                  className={`bg-white my-1 px-2 w-[90%]  py-2 rounded-lg text-black font-semibold`}
                  placeholder="078221436..."
                  
                />
                <TextInput
                  value={email}
                  onChangeText={(e) => setEmail(e)}
                  className="bg-white my-1 px-2  w-[90%]  py-2 rounded-lg text-black font-semibold"
                  placeholder="email"
                />
                <View className="flex flex-row justify-between items-center bg-white my-1 px-2 w-[90%] rounded-md ">
                  <TextInput
                    value={password}
                    secureTextEntry={passwordVisible}
                    onChangeText={(e) => setPassword(e)}
                    className={`bg-transparent text-black font-semibold py-2`}
                    placeholder="Password"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <AntDesign name="eye" size={24} color="black" />
                    ) : (
                      <Entypo name="eye-with-line" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                </View>
                <View className="flex flex-row justify-between items-center bg-white my-1 px-2 w-[90%] rounded-md ">
                  <TextInput
                    value={confirmPassword}
                    secureTextEntry={passwordVisible}
                    onChangeText={(e) => setConfirmPassword(e)}
                    className={`bg-transparent text-black font-semibold py-2`}
                    placeholder="Confirm Password"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <AntDesign name="eye" size={24} color="black" />
                    ) : (
                      <Entypo name="eye-with-line" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => RegisterSubmit()}
                  className="items-center w-[90%] my-2 py-3 bg-primary opacity-80 rounded-lg "
                >
                  <Text className="text-white font-bold">Register</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <TouchableOpacity
          onPress={() => navigation.navigate("Tab")}
          className=" items-center self-center"
        >
          <Text className="font-bold">Skip for Later</Text>
        </TouchableOpacity>
        </View>
        </View>
       
      </ScrollView>
    </SafeAreaView>
  );
};
export default Login;
