import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header_Songs from "../../Components/Header_Songs";
import { GetSong, clearSongs } from "../../../redux/Features/CopuesSlice";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
// import DownloadPDF from "../../Components/Download";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { dimensions } from "../../Components/Global";
const SongCategories = ({ route }) => {
  const dispatch = useDispatch();
 
  //states
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [fileUri, setFileUri] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { copies,isLoading } = useSelector((state) => state.Copies);
  const [loading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState(copies?.songs);

    // console.log("retrieved songs", copies);

  //Getting  Songs of choosen Category
  async function getCategorySongs() {
    // await dispatch(clearSongs())
    const result = await dispatch(
      GetSong({ category_id: route?.params?.category?.id })
    );
    if (GetSong.fulfilled.match(result)) {
      // console.log(result)
      return;
    }
    if (GetSong.fulfilled.match(result)) {
      //   console.log("error", result);
      return;
    }
  }
  //USEEFFECTS 
  useEffect(() => {
    getCategorySongs();
   
  }, []);

  useEffect(() => {
    if (copies?.songs) {
      setSongs(copies.songs);
    }
  }, [copies?.songs]);
  //Load mORE SONGS
  const loadMoreSongs = async () => {
    if (isLoading || !hasMore) return; // Prevent multiple requests
    setIsLoading(true);

    const result = await dispatch(
      GetSong({
        page: currentPage + 1,
        category_id: route?.params?.category?.id
      })
    );
    // console.log("has more",result)
    if (result.payload && result?.payload?.songs?.length > 0) {
      setSongs([...songs, ...result.payload?.songs]); // Append new songs to the list
      setCurrentPage(currentPage + 1); // Update the page number
      if (!result.payload.next) setHasMore(false); // If there's no 'next' page, stop loading more
    } else {
      setHasMore(false); // No more songs available
    }

    setIsLoading(false);
  };
  
  //Handle Download
  const downloadPdf = async (pdfUrl, name, composer) => {
    console.log(pdfUrl);
    setFileUri([...fileUri, pdfUrl]);
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        FileSystem.documentDirectory + name + "~" + composer + ".pdf", // File path to save the downloaded PDF
        {},
        handleDownloadProgress
      );

      const { uri } = await downloadResumable.downloadAsync();
      setFileUri(uri);
      Alert.alert(
        "Download complete!",
        "The file has been downloaded successfully."
      );

      // Optional: Share the downloaded PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "Failed to download the PDF.");
    }
  };

  // Function to track download progress
  const handleDownloadProgress = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(Math.floor(progress * 100));
  };
  return (
    <View className="flex-1 bg-black">
      <Header_Songs title={route?.params?.category} />
      <View className="px-3 my-2">
        <Text style={{}} className="text-3xl text-white font-bold">
          {route?.params?.category?.name}
        </Text>
      </View>
      {(isLoading || loading) && <ActivityIndicator />}
      <ScrollView
        className="my-2"
        scrollEventThrottle={16} // Controls how often the scroll is checked
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent &&
            nativeEvent.layoutMeasurement &&
            nativeEvent.contentOffset
          ) {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            // Handle scrolling logic, e.g., checking if at the bottom of the page
            const isCloseToBottom =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height -20 ;
            if (isCloseToBottom) {
              // Trigger a function to load more content
              loadMoreSongs();
            }
          }
        }}
      >
        {songs?.length<1?<Text className="text-white">No song found Please try again</Text>:songs?.map((item, index) => {
          // console.log(JSON.stringify(item))
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                downloadPdf(item?.document, item.name, item?.composer)
              }
              className="flex flex-row my-3 items-center justify-between py-2 px-3 gap-y-2 border-b border-gray-300 rounded-lg"
            >
              <Text className="text-white">{index + 1}</Text>
              <View className="flex flex-row items-center gap-x-2 flex-1 ">
                <FontAwesome6 name="file-pdf" size={27} color="#F40F02" />

                {/* Name and Composer in the same line */}
                <View className="flex flex-row flex items-center flex-wrap">
                  <Text className="text-gray-200 text-lg font-bold">
                    {item.name} by{" "}
                  </Text>

                  <Text className="text-gray-400 ">{item.composer}</Text>
                </View>
              </View>
              {fileUri?.includes(item?.document) && (
                <View className="h-8 w-8 rounded-full bg-slate-400 flex flex-col items-center justify-center">
                  <Text
                    className="text-green-300 font-bold"
                    style={{ fontSize: 8 }}
                  >
                    {downloadProgress}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SongCategories;
