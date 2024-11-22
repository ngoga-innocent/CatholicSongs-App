import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Header from "../../Components/Header";
import { useSelector, useDispatch } from "react-redux";
import * as Network from "expo-network";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import "../../Components/i18n";
import {
  SongCategory,
  FetchCopiesType,
  UploadSong,
} from "../../../redux/Features/CopuesSlice";
import CircularProgress from "../../Components/CircleAnimation";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { COLORS, dimensions } from "../../Components/Global";
import * as DocumentPicker from "expo-document-picker";
import Menu from "../../Components/Menu";
import { verifyToken } from "../../../redux/Features/AccountSlice";
const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //Select Categories
  const { songCategories, copiesType, copyLoading } = useSelector(
    (state) => state.Copies
  );
  const {User}=useSelector(state=>state.Account)
  const [upload, setUpload] = useState(false);
  const [showpart, setShowPart] = useState(false);
  const [choosenPart, setChoosenPart] = useState("");
  const [location, setLocation] = useState({ x: null, y: null });
  const [showCategory, setShowCategory] = useState(false);
  const [choosenCategory, setChoosenCategory] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [song_name, setSongName] = useState("");
  const [song_composer, setSongComposer] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  // console.log(songCategories)
  //Dispatch
  useEffect(() => {
    checkNetwork();
    FetchCategories();
  }, []);
  async function checkNetwork() {
    const network = await Network.getNetworkStateAsync();
    //  console.log(network)
    return network.isConnected;
  }
  //Fetxhing song category
  async function FetchCategories() {
    dispatch(verifyToken())
    if (!checkNetwork()) {
      
        
      
      Toast.show({
        text1: "No Active internet Connection",
        text2: "Continueing in Offline mode",
        type: "info",
        position: "top",

        autoHide: true,
      });
      return;
    }
    const result = await dispatch(SongCategory());
    // console.log(result)
    if (SongCategory.fulfilled.match(result)) {
      console.log(result.payload);
      return;
    }
    if (SongCategory.rejected.match(result)) {
      // console.log(result.payload)
      Toast.show({
        text1: "Failed to fetch Song Categories",
        text2: "Please try again later",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
  }
  //Handle Uplaod state
  const updateUploadState = (data) => {
    setUpload(data);
    console.log("uploadstate", data);
  };
  // const handlePersist = (e) => {
  //   e.p;
  // };
  //Handle Fetch Categories Types or Mass Seasons
  const FetchCopyTypes = async (e) => {
    setLocation({ x: e.nativeEvent?.locationX, y: e.nativeEvent?.pageY });
    setShowCategory(!showCategory);
    if (!checkNetwork()) {
      Toast.show({
        text1: "No Active internet Connection",
        text2: "Continueing in Offline mode",
        type: "info",
        position: "top",

        autoHide: true,
      });
      return;
    }

    if (copiesType?.types?.length > 0) {
      return;
    }
    const result = await dispatch(FetchCopiesType());
    // console.log(result)
    if (FetchCopiesType.fulfilled.match(result)) {
      console.log(result.payload);
      setShowCategory(true);
      return;
    }
    if (FetchCopiesType.rejected.match(result)) {
      // console.log(result.payload)
      Toast.show({
        text1: "Failed to fetch Song Copies",
        text2: "Please try again later",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
  };
  //Documeent Pickeer for Uploading
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      console.log(result);
      if (!result.canceled) {
        setSelectedPdf(result.assets[0]); // You can access the file details here
        console.log("PDF URI:", result);
      } else {
        return;
      }
    } catch (error) {
      console.log("Error picking PDF:", error);
    }
  };
  //Upload New Song
  const uploadNewSong = async () => {
    if (!selectedPdf) {
      Toast.show({
        text1: "Please select a PDF",
        text2: "",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
    if (!song_name) {
      Toast.show({
        text1: "Please enter song name",
        text2: "",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
    if (!song_composer) {
      Toast.show({
        text1: "Please enter song composer",
        text2: "",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
    const body = {
      song_name: song_name,
      song_composer: song_composer,
      document: {
        uri: selectedPdf?.uri,
        name: selectedPdf?.name || song_name,
        type: selectedPdf?.mimeType,
      },
      chooseCategory: choosenCategory,
      choosenPart: choosenPart,
    };
    const result = await dispatch(UploadSong(body));
    console.log(result)
    if (UploadSong.fulfilled.match(result)) {
      Toast.show({
        text1: "Song Uploaded Successfully",
        text2: "",
        type: "success",
        position: "top",

        autoHide: true,
      });
      setUpload(false);
      return;
    }
    if (UploadSong.rejected.match(result)) {
      Toast.show({
        text1: "Failed to upload Song",
        text2: "Please try again later",
        type: "error",
        position: "top",

        autoHide: true,
      });
      return;
    }
  };

  return (
    <View className="bg-black w-[100%] h-[100%]">
      <Header
        title={t("app_name")}
        uploadState={updateUploadState}
        setToggleMenu={setToggleMenu}
        toggleMenu={toggleMenu}
      />

      {/* Toast outside of ScrollView */}
      <View className="z-50" style={{ zIndex: 10000 }}>
        <Toast />
      </View>
      <View>
        <Menu
          toggleMenu={toggleMenu}
          uploadState={updateUploadState}
          setToggleMenu={setToggleMenu}
        />
      </View>
      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1 px-2"
        refreshControl={
          <RefreshControl
            onRefresh={() => dispatch(SongCategory())}
            refreshing={copyLoading}
          />
        }
      >
        {/* Circular Progress */}
        {copyLoading && <ActivityIndicator color="white" />}
        <CircularProgress
          songs_number={
            songCategories?.songs_number > 999
              ? `999+`
              : songCategories?.songs_number
          }
        />

        {/* Category List */}
        <View className="my-4 mt-8 flex-1">
          {songCategories?.categories?.map((category) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("song_category", {
                  category: category,
                })
              }
              key={category.id}
              className="py-2 px-4 bg-white rounded-lg shadow-md shadow-black flex flex-row items-center justify-between"
            >
              <Text className="font-bold text-lg">{category.name}</Text>
              <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                <Text>
                  {category?.song_count < 99 ? category?.song_count : "99+"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View>
        <Modal
          className="flex-1"
          animationType="slide"
          transparent
          onRequestClose={() => setUpload(false)}
          visible={upload}
        >
          <View
            className="flex-1 "
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            {/* When clicking outside (on the background), close the modal */}
            <TouchableWithoutFeedback onPress={() => setUpload(false)}>
              <View className="flex-1 ">
                {/* Inner modal content, which should not trigger modal close */}
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View
                    className="absolute bottom-0 w-full flex flex-col rounded-t-3xl bg-white  items-center h-[70%]"
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text className="text-xl font-bold">Add New Song </Text>
                    {/* Any other inner elements like buttons */}
                    {copyLoading && <ActivityIndicator />}
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      className="py-3"
                    >
                      <TouchableOpacity
                        onPress={() => pickPdf()}
                        className="bg-gray-300 py-3 px-2 items-center justify-center w-[100%] rounded-md mt-3 "
                        style={{ width: dimensions.width * 0.8 }}
                      >
                        <Text className="font-bold text-lg">
                          {selectedPdf?.name || `Choose a Song`}
                        </Text>
                      </TouchableOpacity>

                      <View className="w-full text-center  my-2 mt-2">
                        <Text>Song's Name</Text>
                        <TextInput
                          value={song_name}
                          onChangeText={(e) => setSongName(e)}
                          placeholder="Akira Dawe"
                          className="my-1 border border-gray-400 w-[100%] py-3 px-2 rounded-md "
                        />
                      </View>
                      <View className="w-full text-center ">
                        <Text>Song's Composer</Text>
                        <TextInput
                          value={song_composer}
                          onChangeText={(e) => setSongComposer(e)}
                          placeholder="Joe Doe"
                          className="my-1 border border-gray-400 w-[100%] py-3 px-2 rounded-md "
                        />
                      </View>
                      <Text className="mt-3 mb-1 ">Mass Part</Text>
                      <TouchableOpacity
                        onPress={() => setShowPart(!showpart)}
                        className=" bg-gray-300 py-2 px-2 items-center justify-center w-[100%] rounded-md "
                        style={{ width: dimensions.width * 0.8 }}
                      >
                        <Text className="font-bold text-lg">
                          {choosenPart.name || `Song Part`}
                        </Text>
                      </TouchableOpacity>
                      {showpart && (
                        <ScrollView
                          className="flex-1 absolute w-full rounded-lg"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.9)",
                            zIndex: 70,
                          }}
                        >
                          {songCategories?.categories?.map((item, index) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setChoosenPart(item);
                                  setShowPart(false);
                                }}
                                key={index}
                                style={{
                                  padding: 10,
                                  borderBottomWidth: 1,
                                  borderColor: "gray",
                                  backgroundColor: "white",
                                }}
                              >
                                <Text>{item.name}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                      <Text className="mt-3 mb-1 font-bold  text-gray-700">
                        Liturgy Season
                      </Text>
                      <TouchableOpacity
                        onPress={(e) => FetchCopyTypes(e)}
                        className="bg-gray-300 py-2 px-2 items-center justify-center w-[100%] rounded-md "
                        style={{ width: dimensions.width * 0.8 }}
                      >
                        <Text className="font-bold text-lg">
                          {choosenCategory.name || `Song Category`}
                        </Text>
                      </TouchableOpacity>
                      {showCategory && (
                        <ScrollView
                          className="absolute -bottom-10 flex-1 w-full rounded-lg border bg-gray-200 border-gray-200"
                          style={{ zIndex: 70 }}
                        >
                          {copiesType?.types?.map((item, index) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setChoosenCategory(item);
                                  setShowCategory(false);
                                }}
                                key={index}
                                style={{
                                  padding: 10,
                                  borderBottomWidth: 1,
                                  borderColor: "gray",
                                  backgroundColor: "white",
                                }}
                              >
                                <Text>{item.name}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                      <TouchableOpacity
                        onPress={() => uploadNewSong()}
                        className="bg-primary py-3 px-2 mb-4 items-center justify-center w-[100%] rounded-md mt-3 "
                        style={{ width: dimensions.width * 0.8 }}
                      >
                        <Text className="font-bold text-white text-lg">
                          Upload Song
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default HomePage;
