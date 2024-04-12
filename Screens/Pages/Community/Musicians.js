import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FetchMusician } from "../../../redux/Features/MusicianSlice";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const Musicians = () => {
  const dispatch = useDispatch();
  const [filter_key, setFilterKey] = useState("");
  const [filter_type, setFilterType] = useState([]);
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const height = Dimensions.get("screen").height;

  const navigation = useNavigation();
  const { musicians, musicianLoading, isError } = useSelector(
    (state) => state.Musicians
  );
  useEffect(() => {
    if (musicians.length == 0) {
      dispatch(FetchMusician());
    }
  }, [dispatch]);
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
  const skills = ["organist", "pianist", "conductor"];
  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      className="relative bg-primary"
      contentContainerStyle={{ paddingBottom: height / 6.5, flexGrow: 10 }}
    >
      <View className="bg-primary pt-14 pb-2 mb-2">
        <View className="flex flex-row rounded-full border border-white mb-2 mx-2 items-center px-2">
          <FontAwesome
            name="search"
            size={24}
            color="white"
            className="rotate-90"
          />
          <TextInput
            className="flex-1 bg-transparent text-slate-200 py-2 w-[90%] self-end mr-3 rounded-md my-1 px-2"
            placeholder="Search a musician"
            placeholderTextColor="white"
            value={filter_key}
            onChangeText={(e) => setFilterKey(e)}
          />
          <TouchableOpacity>
            <MaterialIcons name="filter-alt" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="sticky top-2 flex flex-row justify-end gap-x-2 mx-3 items-center">
          <Text className="text-white font-bold">filter by:</Text>
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
      <View className="w-full flex flex-row flex-wrap  gap-2 mt-3">
        {filteredMusicians.length > 0 &&
          filteredMusicians.map((item, index) => {
            return (
              <View
                key={index}
                className="flex flex-col justify-between w-[47%] bg-white rounded-md items-center py-2"
              >
                <Avatar
                  source={
                    item?.user_data?.profile != null
                      ? { uri: item?.user_data?.profile }
                      : require("../../../assets/DefualtAvatar.jpg")
                  }
                  rounded
                  size="large"
                />
                <Text className="font-bold">{item?.user_data?.username}</Text>
                <View className="flex flex-row justify-between gap-x-2">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-xs font-bold">advised</Text>
                    {item?.recommended ? (
                      <Ionicons
                        name="checkmark-circle-sharp"
                        size={12}
                        color="green"
                      />
                    ) : (
                      <Entypo name="circle-with-cross" size={12} color="red" />
                    )}
                  </View>
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-xs font-bold">Verified</Text>
                    {item?.verified ? (
                      <Ionicons
                        name="checkmark-circle-sharp"
                        size={12}
                        color="green"
                      />
                    ) : (
                      <Entypo name="circle-with-cross" size={12} color="red" />
                    )}
                  </View>
                </View>
                <View className=" items-center justify-center mx-2 my-2">
                  <Text className="font-bold underline">Skills</Text>
                  <View className="flex flex-row flex-wrap gap-x-1 items-center justify-center">
                    {item?.skills_data?.length > 0 &&
                      item?.skills_data?.map((skill, skillindex) => {
                        return (
                          <View key={skillindex}>
                            <Text>{skill.name},</Text>
                          </View>
                        );
                      })}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("musician_profile", {
                      id: item.id,
                    })
                  }
                  className="z-10 my-1 mt-2 bg-green-400 flex-end  w-[95%] self-center items-center  py-2 rounded-md"
                >
                  <Text className="font-bold">Profile</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default Musicians;
