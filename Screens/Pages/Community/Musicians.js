import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchMusician,
  FetchMusicianSkills,
  AddMusician
} from "../../../redux/Features/MusicianSlice";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, dimensions } from "../../Components/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
const Musicians = () => {
  const { t } = useTranslation();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [filter_key, setFilterKey] = useState("");
  const [filter_type, setFilterType] = useState([]);
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [showJoinCommunity, setShowJoinCommunity] = useState(false);
  const [choosenSkills, setChoosenSkills] = useState([]);
  const [localtion, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone_Number, setPhoneNumber] = useState("");
  const height = Dimensions.get("screen").height;

  const navigation = useNavigation();
  const { musicians, musicianLoading, isError, musician_skills } = useSelector(
    (state) => state.Musicians
  );
  console.log(musician_skills);
  useEffect(() => {
    if (musicians.length == 0) {
      dispatch(FetchMusician());
    }
  }, [dispatch]);
  useEffect(() => {
    fetchMusicianSkills();
  }, []);
  //Filtering
  useEffect(() => {
    if (filter_key != "") {
      const filtered = musicians.filter(
        (musician) =>
          musician?.user_data?.username
            .toLowerCase()
            .includes(filter_key.toLowerCase()) ||
          musician?.user_data?.first_name
            .toLowerCase()
            .includes(filter_key.toLowerCase()) ||
          musician?.user_data?.last_name
            .toLowerCase()
            .includes(filter_key.toLowerCase())
      );
      setFilteredMusicians(filtered);
    } else {
      setFilteredMusicians(musicians);
    }
  }, [filter_key, musicians]);

  useEffect(() => {
    if (filter_type.length > 0) {
      const filteredMusiciansArray = filter_type.map((filterType) =>
        musicians.filter((musician) =>
          musician.skills_data.some(
            (skill) => skill.name.toLowerCase() == filterType.toLowerCase()
          )
        )
      );
      let filteredMusicians = [];
      if (filteredMusiciansArray.length > 0) {
        filteredMusicians = filteredMusiciansArray.reduce((acc, val) =>
          acc.filter((accMusician) =>
            val.some((valMusician) => valMusician.id === accMusician.id)
          )
        );
      }
      setFilteredMusicians(filteredMusicians);
    } else {
      setFilteredMusicians(musicians);
    }
  }, [filter_type]);
  //Fetch Musician skills
  const fetchMusicianSkills = async () => {
    const result = await dispatch(FetchMusicianSkills());
    if (FetchMusicianSkills.rejected.match(result)) {
      console.log("Failed to fetch musician skills", result.payload);
    }
  };
  const skills = ["organist", "pianist", "conductor"];
  const handleJoinCommunity = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      navigation.navigate("Auth", {
        screen: "Login"
      });
      return;
    }
    setShowJoinCommunity(!showJoinCommunity);
  };
  //Joining Community
  const JoinCommunity = async () => {
    //console.log("Joining community", choosenSkills, localtion, description, phone_number)
    const result = await dispatch(
      AddMusician({
        skills: choosenSkills,
        location: localtion,
        description: description,
        phone_number: phone_Number
      })
    );
    if (AddMusician.rejected.match(result)) {
      console.log("Failed to join community", result);
      setShowJoinCommunity(false);
      Toast.show({
        text1: result?.payload?.detail?.user
          ? "Already Joined the community"
          : result?.payload?.detail,
        text2: "Please try again later or contact the Administrator",
        type: "error",
        autoHide: true
      });

      return;
    }
    if (AddMusician.fulfilled.match(result)) {
      setShowJoinCommunity(false);
      Toast.show({
        text1: "You have successfully joined the community",
        type: "success",
        autoHide: true
      });
      dispatch(FetchMusician());
      return;
    }
  };
  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      className="relative bg-black px-2"
      contentContainerStyle={{ paddingBottom: height / 5, flexGrow: 10 }}
    >
      <View className="bg-black pt-14 pt-3 pb-2 mb-2">
        <View className="z-50 w-full items-center justify-center">
          <Toast />
        </View>
        <View
          style={{ paddingTop: inset.top }}
          className="mb-2 flex flex-row items-center justify-between"
        >
          <Text className="text-xl  font-bold text-white">
            {t("community")}
          </Text>
          
          <TouchableOpacity
            onPress={handleJoinCommunity}
            className="bg-white py-2 px-4 rounded-full flex flex-row gap-x-1 items-center justify-center"
          >
            <Text classsName="font-bold text-lg">Join</Text>
            <AntDesign name="rightcircle" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row rounded-full border border-white mb-2  items-center px-2">
          <FontAwesome
            name="search"
            size={24}
            color="white"
            className="rotate-90"
          />
          <TextInput
            className="flex-1 bg-transparent text-slate-200 py-1 w-[100%] self-end mr-3 rounded-md my-1 px-2"
            placeholder={t("search_musician")}
            placeholderTextColor="white"
            value={filter_key}
            onChangeText={(e) => setFilterKey(e)}
          />

          <MaterialIcons name="filter-alt" size={24} color="white" />
        </View>

        <View className="sticky top-2 flex flex-row justify-end gap-x-2 mx-3 items-center">
          <Text className="text-white font-bold">{t("filter")}:</Text>
          {skills.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  filter_type.includes(item)
                    ? setFilterType(filter_type.filter((type) => type !== item))
                    : setFilterType([...filter_type, item]);
                }}
                key={index}
                className={`${
                  filter_type.includes(item) ? `bg-green-600` : `bg-slate-300`
                } flex-1 items-center px-2 rounded-md py-2`}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {musicianLoading && (
        <ActivityIndicator
          color={COLORS.white}
          size={dimensions.width * 0.02}
        />
      )}
      <View className="w-full flex flex-row flex-wrap  gap-2 my-2 mt-3">
        {filteredMusicians.length > 0 ?
          filteredMusicians.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("musician_profile", {
                    id: item.id
                  })
                }
                key={index}
                className="flex flex-row w-full  rounded-3xl px-2 py-1 items-center rounded-md items-center"
              >
                <Avatar
                  source={
                    item?.user_data?.profile != null
                      ? { uri: item?.user_data?.profile }
                      : require("../../../assets/DefualtAvatar.jpg")
                  }
                  rounded
                  size="medium"
                />
                <View className="flex flex-col flex-1 mx-2 ">
                  <View className="flex flex-row items-center justify-between ">
                    <Text
                      className="font-bold  text-md text-gray-200"
                      style={{ fontSize: 16 }}
                    >
                      {item?.user_data?.username}
                    </Text>
                    <View className="flex flex-row items-center gap-x-2">
                      <View className="flex flex-row items-center justify-between">
                        <Text className="  text-gray-500 font-bold">
                          Verified
                        </Text>
                        {item?.verified ? (
                          <Ionicons
                            name="checkmark-circle-sharp"
                            size={12}
                            color="green"
                          />
                        ) : (
                          <Entypo
                            name="circle-with-cross"
                            size={12}
                            color="red"
                          />
                        )}
                      </View>
                    </View>
                  </View>
                  <View className="">
                    <View className="flex flex-row flex-wrap gap-x-1 ">
                      {item?.skills_data?.length > 0 &&
                        item?.skills_data?.map((skill, skillindex) => {
                          return (
                            <View key={skillindex}>
                              <Text className="text-gray-400">
                                {skill.name}
                                {skillindex === item?.skills_data?.length - 1
                                  ? null
                                  : ","}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }):<Text className="text-gray-300">No Musician available for noww</Text>}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={showJoinCommunity}
        onRequestClose={() => setShowJoinCommunity(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end" // Ensures modal content slides up from the bottom
          }}
        >
          <TouchableWithoutFeedback onPress={() => setShowJoinCommunity(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animatable.View
            animation="slideInUp"
            className="bg-white items-center h-[60%] rounded-t-3xl px-4 py-3 w-full"
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={{ width: "100%", alignItems: "center" }}
                className="mb-4"
              >
                <Text className="text-xl font-bold mb-4 self-start text-gray-400">
                  {t("join")}
                </Text>
                {musicianLoading && (
                  <ActivityIndicator
                    color={COLORS.black}
                    size={dimensions.width * 0.02}
                  />
                )}
                {/* Add your form, content, or other views here */}
                <ScrollView
                  className="gap-y-2"
                  contentContainerStyle={{
                    alignItems: "start"
                  }}
                >
                  <Text className=" mb-2 font-bold text-gray-500 text-lg">
                    {t("skills")}
                  </Text>
                  {musicianLoading ? (
                    <ActivityIndicator
                      color={COLORS.black}
                      size={dimensions.width * 0.02}
                    />
                  ) : (
                    <View className="flex flex-row flex-wrap w-[100%] items-center ">
                      {musician_skills?.length > 0 &&
                        musician_skills?.map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                if (choosenSkills.includes(item.id)) {
                                  // If it is, remove it from the array
                                  setChoosenSkills(
                                    choosenSkills.filter(
                                      (skill) => skill !== item.id
                                    )
                                  );
                                } else {
                                  // If it's not, add it to the array
                                  setChoosenSkills([...choosenSkills, item.id]);
                                }
                              }}
                              className={`${
                                choosenSkills.includes(item.id)
                                  ? "bg-mygreen"
                                  : "bg-gray-400"
                              }  py-2 px-3 mx-2 rounded-md`}
                              key={index}
                            >
                              <Text>{item?.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  )}
                  <View
                    className="text-center"
                    style={{ width: dimensions.width * 0.85 }}
                  >
                    <Text className="text-lg font-bold text-gray-500">
                      {t("location")}
                    </Text>
                    <TextInput
                      value={localtion}
                      onChangeText={(e) => setLocation(e)}
                      placeholder="Kigali ..."
                      style={{ width: dimensions.width * 0.85 }}
                      className="w-full border-gray-400 border rounded-md py-3 px-2"
                    />
                  </View>
                  <View className="" style={{ width: dimensions.width * 0.85 }}>
                    <Text className="text-lg font-bold text-gray-500">
                      {t("description")}
                    </Text>
                    <TextInput
                      value={description}
                      onChangeText={(e) => setDescription(e)}
                      placeholder="Am musician wwith the ability to support choir in music ..."
                      multiline
                      style={{
                        width: dimensions.width * 0.85,
                        maxHeight: dimensions.height * 0.12
                      }}
                      className="w-full border-gray-400 border rounded-lg py-3 px-2"
                    />
                  </View>
                  <View className="" style={{ width: dimensions.width * 0.85 }}>
                    <Text className="text-lg font-bold text-gray-500">
                      {t("contact")}
                    </Text>
                    <TextInput
                      value={phone_Number}
                      onChangeText={(e) => setPhoneNumber(e)}
                      placeholder="+25078888888"
                      className="w-[100%] border-gray-400 border rounded-md py-3 px-2"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => JoinCommunity()}
                    style={{ width: dimensions.width * 0.85 }}
                    className="flex-1  self-center items-center bg-primary py-4  rounded-lg"
                  >
                    <Text className="text-white font-bold">{t("join")}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </Animatable.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Musicians;
