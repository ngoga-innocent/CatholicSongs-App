import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { FetchEvent, FetchTrendings } from "../../../redux/Features/EventSlice";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video } from "expo-av";
import { FetchMusician } from "../../../redux/Features/MusicianSlice";
import { FetchCopies } from "../../../redux/Features/CopuesSlice";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const HomePage = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  //State Declaration
  const { events, trendings, eventLoading, tredingLoading } = useSelector(
    (state) => state.Events
  );
  const { musicians, musicianLoading } = useSelector(
    (state) => state.Musicians
  );
  const { User } = useSelector((state) => state.Account);
  const { copies, copyLoading } = useSelector((state) => state.Copies);
  const [currentEventIndex, setEventCurrentIndex] = useState(0);
  const [choosenCopy, setChoosenCopy] = useState();
  const [choosenCopyIndex, setChoosenCopyIndex] = useState();
  //use Effect Section
  useEffect(() => {
    async function dispatchFunction() {
      dispatch(FetchEvent());
      dispatch(FetchTrendings());
      dispatch(FetchMusician());
      dispatch(FetchCopies());
      //   console.log(trendigs);
    }
    dispatchFunction();
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollViewRef.current) {
        const nextPage =
          currentEventIndex == events.length - 1 ? 0 : currentEventIndex + 1;
        scrollViewRef.current.scrollTo({
          x: width * nextPage,
          animated: true,
        });
        setEventCurrentIndex(nextPage);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentEventIndex, events, dispatch]);

  // constants Setting Up
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  //Use Selecto Content

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      className="flex-1 bg-primary relative"
      style={{ flex: 1 }}
      stickyHeaderIndices={[0]}
    >
      <View className=" h-28    bg-primary w-full items-end py-2 flex flex-row border border-t-0 border-white rounded-b-3xl justify-between  px-4">
        <View className="flex flex-row items-center max-w-[60%] ">
          <Avatar
            source={require("../../../assets/Invite.png")}
            rounded
            size="medium"
            containerStyle={{ borderWidth: 1, borderColor: "white" }}
          />
          <View className="mx-2">
            <Text className="text-white font-bold text-md">
              Hello,Ngoga Innocent Patrick
            </Text>
            <Text className="text-slate-500 text-xs">
              Welcome to Catholic Music
            </Text>
          </View>
        </View>
        <TouchableOpacity className="relative">
          <View className="  right-0 top-0 z-10 rounded-full flex flex-row-reverse  ">
            <Text className="text-white z-20 text-xs animate-pulse">10</Text>
            <View className="-mr-4">
              <Ionicons
                name="notifications-circle-sharp"
                size={50}
                color="purple"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {eventLoading && <ActivityIndicator size={30} color="purple" />}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / width);
          setEventCurrentIndex(index);
        }}
        className="flex-1"
        style={{ flex: 1, width: width }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {events.length > 0 &&
          events?.map((item, index) => {
            return (
              <View
                key={index}
                className=" items-center self-center justify-center px-2 pt-4 rounded-md"
                style={{
                  width: width,
                  height: height / 3.2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  className=" z-20 w-full h-full self-center rounded-2xl"
                  resizeMode="cover"
                  style={{}}
                />
              </View>
            );
          })}
      </ScrollView>
      <View className="flex flex-row self-center gap-x-2 my-1">
        {events.length > 0 &&
          events.map((item, index) => {
            return (
              <View
                key={index}
                className={`rounded-full h-2 ${
                  currentEventIndex == index
                    ? "w-5 bg-mypurple"
                    : "w-2 bg-slate-600"
                } `}
              />
            );
          })}
      </View>
      <View className="flex flex-row justify-between px-3 py-2 my-1">
        <Text className="text-white text-lg font-bold">Trending Songs</Text>
        <TouchableOpacity>
          <Text className="text-mypurple font-bold text-lg">See All</Text>
        </TouchableOpacity>
      </View>
      {tredingLoading && <ActivityIndicator size={30} color="purple" />}
      <ScrollView
        className="flex-1  mx-2 "
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {trendings.length > 0 ? (
          trendings.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{ height: height / 3.8, width: width / 2.5 }}
                className="rounded-lg mr-2 z-10  border border-white"
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  className="flex-1 rounded-lg "
                  resizeMode="cover"
                />

                {/* <YoutubePlayer
                videoId={item.link.split("=")[1]}
                height={500}
                // style={{ height: height / 2, flex: 1 }}
              /> */}
              </TouchableOpacity>
            );
          })
        ) : (
          <Text className="text-white font-bold">No trendings Available</Text>
        )}
      </ScrollView>

      <View className="flex flex-row justify-between px-3 py-2 my-1">
        <Text className="text-white text-lg font-bold">Recommended</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Communinty")}>
          <Text className="text-mypurple font-bold text-lg">Musicians</Text>
        </TouchableOpacity>
      </View>
      {musicianLoading && <ActivityIndicator size={30} color="purple" />}
      <ScrollView horizontal pagingEnabled className="mx-1 py-2 gap-x-1">
        {musicians.length > 0 ? (
          musicians.slice(0, 15).map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Communinty", {
                    screen: "musician_profile",
                    params: {
                      id: item.id,
                    },
                  })
                }
                key={index}
                className="items-center mx-1"
              >
                <Avatar
                  source={
                    item.user_data.profile
                      ? { uri: item?.user_data?.profile }
                      : require("../../../assets/DefualtAvatar.jpg")
                  }
                  size="large"
                  rounded
                />
                <Text className="text-white font-bold">
                  {item?.user_data?.username}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>No recommended Musician</Text>
        )}
      </ScrollView>
      <Text className="text-white text-lg text-center my-1">
        Recent Uploaded Songs
      </Text>
      <View className="relative flex-1">
        {copies?.copies?.length > 0 ? (
          copies?.copies?.slice(0, 10).map((item, index) => {
            return (
              <View
                key={index}
                className=" flex-row  items-center justify-between mx-2 border border-slate-300 py-4 my-1  rounded-md px-2 "
                style={{ position: "relative" }}
              >
                <View>
                  <Text className="text-white">{item.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setChoosenCopy(item);
                    setChoosenCopyIndex(index);
                  }}
                >
                  <Entypo name="dots-three-vertical" size={24} color="white" />
                  {choosenCopyIndex == index && (
                    <View
                      className=" overflow-hidden  bg-white -bottom-4 py-2 -right-2 w-20 items-center rounded-md"
                      style={{
                        elevation: 50000,
                        zIndex: 5000,
                        position: "absolute",
                      }}
                    >
                      <TouchableOpacity
                        className="py-2 "
                        onPress={() => {
                          setChoosenCopyIndex();
                        }}
                      >
                        <Text className="font-bold">View</Text>
                      </TouchableOpacity>
                      <View className="h-1 w-[90%] bg-black bg-opacity-10" />
                      <TouchableOpacity className="py-2">
                        <Text className="font-bold">share</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity className="my-1">
                        <Text>View</Text>
                      </TouchableOpacity> */}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text className="text-white font-bold  text-center">
            No Uploaded Song Found
          </Text>
        )}
      </View>
      <Text className="text-white mx-4 py-4 text-2xl">
        Catholic Songs Advertising Songs
      </Text>

      {/* <YoutubePlayer
        videoId="c9clqS02Djc"
        height={500}
        // style={{ height: height / 2, flex: 1 }}
      /> */}
    </ScrollView>
  );
};

export default HomePage;
