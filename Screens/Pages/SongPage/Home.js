import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../Components/Global";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCopies,
  FetchCopiesType,
} from "../../../redux/Features/CopuesSlice";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Url } from "../../../Url";
import Svg, { Circle, Rect, Path } from "react-native-svg";
import Toast from "react-native-toast-message";

const Home = () => {
  const navigation = useNavigation();
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [upload, setUpload] = useState(false);
  const [choosen, setChoosen] = useState("");
  const [showChoosepart, setShowChoosePart] = useState(false);
  const [name, setName] = useState("");
  const [composer, setComposer] = useState("");
  const [UploadedDocument, setUploadDocument] = useState();
  const [uploadingloading, setUploadingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { copies, isLoading, isError, copiesType } = useSelector(
    (state) => state.Copies
  );
  const { User } = useSelector((state) => state.Account);

  const panY = useRef(new Animated.Value(0)).current;
  // Dragrable Modal
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: panY }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 20) {
        setUpload(false);
      } else {
        Animated.spring(panY, {
          useNativeDriver: false,

          toValue: 0,
        }).start();
      }
    },
  });
  // #### Fecthing Copies
  useEffect(() => {
    async function GetCopies() {
      dispatch(FetchCopies());
      dispatch(FetchCopiesType());
    }
    GetCopies();
  }, []);

  // Filtering Copies
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredCopies(copiesType.types);
    } else {
      const filtered = copiesType.types.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCopies(filtered);
    }
  }, [searchQuery, copiesType.types, copies]);
  //Handle Upload Documents
  const UploadDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!result.canceled) {
      setName(result.assets[0].name);
      setUploadDocument(result.assets[0]);
    }
    console.log(result);
  };
  const Upload = async () => {
    if (!User.user) {
      navigation.navigate("Auth");
    } else {
      setUploadingLoading(true);
      const formData = new FormData();
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data");
      console.log(UploadedDocument);
      formData.append("name", name);
      formData.append("composer", composer);
      formData.append("document", {
        name: UploadedDocument.name,
        uri: UploadedDocument.uri,
        type: "application/pdf",
      });
      formData.append("uploader", User.user.id);
      formData.append("category", choosen);

      const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: formData,
      };
      console.log(formData);
      try {
        const res = await fetch(`${Url}/documents/`, requestOptions);

        if (!res.ok) {
          console.log(await res.json());
          setUploadingLoading(false);
          setSuccessMessage("Failed to Upload Please Try Again");
        } else {
          console.log(await res.json());
          setUploadingLoading(false);
          Toast.show({
            text1: "Success",
            text2: "Upload Success",
            type: "success",
            position: "bottom",
            visibilityTime: 2000,
          });
          setSuccessMessage("Upload Was SuccessFull");
          setName("");
          setComposer("");
          setChoosen();
          setUploadDocument();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.Primary,
      }}
      className="px-2 "
    >
      <Spinner color={COLORS.purple} size={25} visible={isLoading} />
      <Toast />
      <SafeAreaView>
        <View className="flex flex-row items-center justify-between fixed">
          <Image
            onError={(error) => console.log("Image error:", error)}
            source={require("../../../assets/icon.png")}
            className="w-[15%] "
            resizeMode="contain"
          />
          <View className=" flex flex-row items-center gap-x-1">
            <TextInput
              className="bg-white w-[75%] py-2 rounded-lg px-2 text-right"
              placeholder="search"
              value={searchQuery}
              onChangeText={(e) => setSearchQuery(e)}
            />
            <TouchableOpacity>
              <Text className="text-white font-bold">Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full  justify-center">
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => dispatch(FetchCopiesType())}
              />
            }
            showsVerticalScrollIndicator={false}
            scrollEnabled
            numColumns={2}
            className="w-full"
            contentContainerStyle={{ width: "100%" }}
            data={filteredCopies}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Songs", {
                      screen: "song",
                      params: {
                        type: item.id,
                      },
                    })
                  }
                  className="w-[45%] mx-[2%] my-[1%]    rounded-md z-10 shadow bg-white shadow-white "
                >
                  <Image
                    className=" h-20 flex-1 rounded-md"
                    resizeMode="cover"
                    source={
                      item?.thumbnail
                        ? { uri: item?.thumbnail }
                        : require("../../../assets/icon.png")
                    }
                  />
                  <Text className="text-black text-center text-md font-bold">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        onPress={() => setUpload(!upload)}
        className="absolute bottom-20 right-4 z-10 shadow-md shadow-white"
      >
        <Ionicons name="add-circle" size={50} color={COLORS.purple} />
      </TouchableOpacity>
      <Modal
        className="flex flex-col justify-end"
        transparent
        visible={upload}
        animationType="slide"
        onRequestClose={() => setUpload(!upload)}
      >
        <Animated.View
          {...panResponder.panHandlers}
          className="rounded-t-3xl items-center "
          style={{
            backgroundColor: "white",
            height: "50%",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: panY }],
          }}
        >
          <View className="w-14 h-1 bg-primary rounded-full mt-2" />
          {uploadingloading && (
            <ActivityIndicator color={COLORS.purple} size={20} />
          )}
          <Text className="text-purple font-bold">{successMessage}</Text>
          <TouchableOpacity
            onPress={() => UploadDocument()}
            className="rounded-full bg-slate-200 px-14 py-3 mt-3 w-[90%] self-center items-center "
          >
            <Text className="text-black font-bold">
              {`Choose a song` || UploadedDocument.name}
            </Text>
          </TouchableOpacity>
          <TextInput
            value={name}
            onChangeText={(e) => setName(e)}
            className="w-[90%] py-2 border rounded-md my-2 px-2"
            placeholder="Enter Song Name"
          />
          <TextInput
            value={composer}
            onChangeText={(e) => setComposer(e)}
            className="w-[90%] py-2 border rounded-md my-2 px-2"
            placeholder="Enter Song Composer"
          />
          <View className="justify-center items-center">
            <Text className="font-bold text-md">Song(s) Category </Text>
            <TouchableOpacity
              onPress={() => setShowChoosePart(!showChoosepart)}
              className="rounded-full  flex flex-row items-center justify-center px-14 py-3 mt-3 bg-slate-200 "
            >
              <Text className="font-bold">
                {choosen || `Choose song(s) Part`}
              </Text>
              <EvilIcons name="arrow-down" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {showChoosepart && (
            <View className="absolute top-20 bg-white z-10 w-[90%]  rounded-md shadow-md shadow-neutral-950 items-center h-[40%]">
              <FlatList
                data={filteredCopies}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setChoosen(item.id);
                        setShowChoosePart(!showChoosepart);
                      }}
                      className=" px-20 py-2 rounded-md my-1 bg-slate-200 "
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => Upload()}
            className="rounded-full bg-primary px-14 py-3 mt-3 "
          >
            <Text className="text-white font-bold">Upload</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};
export default Home;
