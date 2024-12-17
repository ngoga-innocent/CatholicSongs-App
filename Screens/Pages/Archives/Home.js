import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";
import { COLORS, dimensions } from "../../Components/Global";
import { useDispatch, useSelector } from "react-redux";
import { AddNewEvent, FetchEvent, FetchTrendings } from "../../../redux/Features/EventSlice";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import { WebView } from "react-native-webview";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker"
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ESkeleton from "../../Components/ESkeleton";
const Archives = () => {
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isfocused=useIsFocused()
  const navigation=useNavigation();
  const {t}=useTranslation()
  const [location, setLocation] = useState({ x: null, y: null });
  const [showpopup, setShowPopup] = useState(false);
  const [showAddevent, setShowAddEvent] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventThumbnail, setEventThumbnail] = useState([]);
  const CARD_WIDTH = dimensions.width * 0.98;
  const CARD_HEIGHT = dimensions.height * 0.32;
  const SPACING = dimensions.width *0.02;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const currentIndex = useRef(0);

  const CreateNewRepertoire = (e) => {
    const locate = e.nativeEvent;
    // console.log(locate);
    setLocation({ x: locate.locationX, y: locate.pageY });
    setShowPopup(!showpopup);
    // navigation.navigate('CreateNewRepertoire');
  };

  //Use effects
  useEffect(() => {
    FetchEvents();
    TrendingSongs();
  }, [isfocused]);
  useEffect(() => {
    // Function to auto-scroll
    const autoScroll = () => {
      const totalCards = events.length;
      currentIndex.current += 1;

      if (currentIndex.current >= totalCards) {
        currentIndex.current = 0; // Loop back to the first card
      }

      scrollViewRef.current?.scrollTo({
        x: currentIndex.current * (CARD_WIDTH + SPACING),
        animated: true
      });
    };
    // Set up interval for auto-scrolling
    autoScrollInterval.current = setInterval(autoScroll, 5000); // Scroll every 3 seconds

    // Cleanup on component unmount
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);
  //On change Date
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowCalendar(false);
    setEventDate(currentDate);
  };
  //Selecting Events and new released songs
  const { events, trendings, eventLoading, tredingLoading } = useSelector(
    (state) => state.Events
  );
  //Fetching events
  // console.log("evets", events);
  // console.log("tredings", trendings);
  const FetchEvents = async () => {
    const result = await dispatch(FetchEvent());
    console.log(result);
    if (FetchEvent.rejected.match(result)) {
      Toast.show({
        text1: "Failed to Get Events",
        text2: result.payload,
        autoHide: true,
        type: "error"
      });
      // console.log(result.payload);
      return;
    }
  };
  //Fetching Trendings Songs
  const TrendingSongs = async () => {
    const result = await dispatch(FetchTrendings());
    // console.log(result);
    if (FetchTrendings.rejected.match(result)) {
      Toast.show({
        text1: "Failed to Get Trending Songs",
        text2: result.payload,
        autoHide: true,
        type: "error"
      });
      // console.log(result.payload);
      return;
    }
  };
  //Image Picking
  const PickImages=async()=>{
    let result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      // allowsEditing: true,
      // aspect: [4, 3],
      allowsMultipleSelection:true
      
    });
    if (!result.canceled) {
      setEventThumbnail([...eventThumbnail,{
        uri:result?.assets[0].uri,
        name:result?.assets[0].fileName,
        type: result?.assets[0].type
      }]);
    }
  }
  const AddNewEventfunction=async()=>{
      const result=await dispatch(AddNewEvent({
        "title":eventTitle,
        "description":eventDescription,
        "location":eventLocation,
        "date":eventDate,
        "thumbnail":eventThumbnail
      }))
      if(AddNewEvent.fulfilled.match(result)){
        setShowAddEvent(false)
        Toast.show({
          text1:"Successfully added event",
          type:"success",
          autoHide:true
        })
        FetchEvents();

      }
      if(AddNewEvent.rejected.match(result)){
        setShowAddEvent(false)
        Toast.show({
          text1:"Failed To add event",
          text2:result.payload.details,
          type:"error",
          autoHide:true
        })
      }
  }
  return (
    <ScrollView className="bg-black flex-1 flex flex-col px-2" >
      <View
        className="bg-black z-50 flex flex-row justify-between bg-black z-50 items-center text-center  px-2"
        style={{ paddingTop: inset.top,zIndex:50 }}
      >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome6
            name="circle-chevron-left"
            size={35}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl text-center">
          {t('event')}
        </Text>
        <TouchableOpacity onPress={(e) => CreateNewRepertoire(e)}>
          <Octicons name="plus-circle" size={40} color={COLORS.white} />
        </TouchableOpacity>
        {showpopup && (
          <View
            className=""
            style={{
              position: "absolute",
              top: location.y,
              right: location.x,
              backgroundColor: "white",
              padding: dimensions.height * 0.02,
              borderRadius: dimensions.width * 0.04,
              zIndex: 1000
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowPopup(!showpopup);
                setShowAddEvent(!showAddevent);
              }}
              className="border-b border-r rounded-lg px-2 py-3 border-gray-600"
            >
              <Text className="font-bold">Add New Event</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className=" border-l rounded-lg px-2 py-3">
              <Text className="font-bold">Add New Released Song</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </View>
      {eventLoading && <View className="flex flex-col gap-y-1">
      {[...Array(4)].map((_,index)=>{
        return(
          <View key={index} className='my-1'>
            <ESkeleton  />
          </View>
        )
      })}
      </View>}
      {eventLoading && <ActivityIndicator color='white' collapsable/>}
      {events.length >1 && <View className="my-3">
        <Text>Events</Text>
        {events?.length < 1 ? (
          <Text>No Events</Text>
        ) : (
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CARD_WIDTH } // for snapping to the nearest card
            decelerationRate="normal"
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf:"center",
              paddingHorizontal: (dimensions.width - CARD_WIDTH) / 2,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
          >
            {events?.map((item, index) => {
              const inputRange = [
                (index - 1) * (CARD_WIDTH + SPACING),
                index * (CARD_WIDTH + SPACING),
                (index + 1) * (CARD_WIDTH + SPACING)
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.5, 1, 0.5],
                extrapolate: "clamp"
              });

              return (
                <Animated.View
                  key={index}
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,

                    transform: [{ scale }]
                  }}
                  className="rounded-lg flex flex-col relative "
                >
                  <TouchableOpacity onPress={()=>navigation.navigate('single_event',{
                    event:item
                  })} className="flex-1 h-[100%] border border-slate-700 " style={{position: "absolute",
                      borderRadius: dimensions.width * 0.03,width: "100%",
                      height: "100%"}}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      borderRadius: dimensions.width * 0.03
                    }}
                  />
                  <LinearGradient
                    colors={["rgba(0,255,255,0.4)", "transparent"]}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 10
                    }}
                  />
                  <View
                    style={{
                      paddingVertical: 7,
                      paddingHorizontal: 10,
                      
                      position: "absolute",
                      bottom: 0,
                      
                      borderTopEndRadius:25,
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                  >
                    <Text className="text-white text-sm font-semibold">
                      {item?.location}
                    </Text>
                    <Text className="text-white text-lg font-bold">
                      {item?.title?.toUpperCase()}
                    </Text>
                    <View className="flex flex-row items-center gap-x-2">
                      <Text className="text-white">
                        {new Date(item?.date || null).toLocaleDateString()}
                      </Text>
                      <Text className="text-white">
                        {new Date(item?.date || null).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </Text>
                    </View>
                  </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        )}
      </View>}
      <View className="flex flex-row gap-x-1 self-end mx-2">
        {events?.map((item, index) => {
          return (
            <View
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentIndex.current == index
                  ? "bg-orange-200"
                  : "border border-orange-200"
              }`}
            />
          );
        })}
      </View>
      <View>
        <Text className="text-white text-xl font-bold my-4 mx-4">
          {t('Miss')}
        </Text>
        {trendings?.length < 1 ? (
          <Text>No Trending Songs</Text>
        ) : (
          <ScrollView

          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex:1 }}
        >
          {trendings?.map((item, index) => {
            // Extract YouTube video ID and format the embed link
            const videoId = item?.link.split("youtu.be/")[1] || item?.link.split("v=")[1]?.split("&")[0];
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`;
        
            return (
              <TouchableOpacity
              className="border border-gray-900 rounded-lg mx-auto"
                key={index}
                style={{
                  width: dimensions.width * 0.90,
                  height: dimensions.height * 0.3,
                  marginVertical: 10,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <WebView
                  style={{ flex: 1,width:'100%',height:'100%' }}
                  javaScriptEnabled={true}
                  source={{ uri: item?.link }}
                  allowsFullscreenVideo={true}
                  startInLoadingState={true}
                  mediaPlaybackRequiresUserAction={true} // Prevent autoplay
                  nestedScrollEnabled={true} // Enable smooth scrolling
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={showAddevent}
        onRequestClose={() => setShowAddEvent(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end" // Ensures modal content slides up from the bottom
          }}
        >
          <TouchableWithoutFeedback onPress={() => setShowAddEvent(false)}>
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
                  Add Your Event
                </Text>
                {eventLoading && (
                  <ActivityIndicator
                    color={COLORS.black}
                    size={dimensions.width * 0.02}
                  />
                )}
                {/* Add your form, content, or other views here */}
                <ScrollView
                  className="gap-y-2 py-12 "
                  contentContainerStyle={{
                    alignItems: "start"
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    className="text-center"
                    style={{ width: dimensions.width * 0.85 }}
                  >
                    <Text className="text-lg font-bold text-gray-500">
                      Event Title
                    </Text>
                    <TextInput
                      value={eventTitle}
                      onChangeText={(e) => setEventTitle(e)}
                      placeholder="Big Sing Concert 4 ..."
                      style={{ width: dimensions.width * 0.85 }}
                      className="w-full border-gray-400 border rounded-md py-3 px-2"
                    />
                  </View>
                  <View className="" style={{ width: dimensions.width * 0.85 }}>
                    <Text className="text-lg font-bold text-gray-500">
                      Describe the Event
                    </Text>
                    <TextInput
                      value={eventDescription}
                      onChangeText={(e) => setEventDescription(e)}
                      placeholder="Music is the life join us to enjoy music ..."
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
                      Event Location
                    </Text>
                    <TextInput
                      value={eventLocation}
                      onChangeText={(e) => setEventLocation(e)}
                      placeholder="KCC"
                      className="w-[100%] border-gray-400 border rounded-md py-3 px-2"
                    />
                  </View>
                  <View
                    className="flex flex-col gap-x-2"
                    style={{ width: dimensions.width * 0.85 }}
                  >
                    <Text className="text-lg font-bold text-gray-500">
                      Event Date:
                    </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowCalendar(true)}
                        className="px-5 py-3 bg-gray-300 rounded-md"
                      >
                        <Text>
                          {/* {eventDate.toDateString() || `Choose Date`} */}
                          {eventDate.toLocaleString() || `Choose Date`}
                        </Text>
                      </TouchableOpacity>
                      {showCalendar && (
                        <DateTimePicker
                          mode="datetime"
                          display="default"
                          value={eventDate}
                          onChange={onChange}
                        />
                      )}
                    </View>
                    
                  </View>
                  <Text className="text-lg font-bold text-gray-500">Add Event Images</Text>
                    <TouchableOpacity onPress={()=>PickImages()} className="w-full bg-gray-300 py-3 items-center justify-center rounded-md">
                      <Text>{`${eventThumbnail?.length }files choosen `|| `Choose Event Images`}</Text>
                    </TouchableOpacity>
                  <TouchableOpacity onPress={()=>AddNewEventfunction()}
                    style={{ width: dimensions.width * 0.85 }}
                    className="flex-1  self-center items-center bg-primary py-4  rounded-lg"
                  >
                    <Text className="text-white font-bold">Add an Event</Text>
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
export default Archives;
