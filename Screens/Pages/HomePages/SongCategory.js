import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header_Songs from "../../Components/Header_Songs";
import { GetSong } from "../../../redux/Features/CopuesSlice";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { COLORS } from "../../Components/Global";
import { viewPdf, downloadPdf, downloadAndSavePdf }from "../../Components/SongDownload/DownloadUtils";
import CustomModal from "../../Components/SongDownload/CustomModal";

const SongCategories = ({ route }) => {
  const dispatch = useDispatch();

  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading,setIsDownloading]=useState(false);
  const [fileUri, setFileUri] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [songs, setSongs] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const { copies, copyLoading } = useSelector((state) => state.Copies);

  // Fetch category songs
  const getCategorySongs = async () => {
    const result = await dispatch(GetSong({ category_id: route?.params?.category?.id }));
    if (GetSong.fulfilled.match(result)) return;
  };

  useEffect(() => {
    getCategorySongs();
  }, []);

  useEffect(() => {
    if (copies?.songs) {
      setSongs(copies.songs);
    }
  }, [copies?.songs]);

  const loadMoreSongs = async () => {
    if (copyLoading || !hasMore) return;
    const result = await dispatch(GetSong({ page: currentPage + 1, category_id: route?.params?.category?.id }));
    if (result.payload?.songs?.length > 0) {
      setSongs([...songs, ...result.payload?.songs]);
      setCurrentPage(currentPage + 1);
      if (!result.payload.next) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };

  // Handle song press to show modal
  const handleSongPress = (song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  // Define modal options
  const modalOptions = [
    {
      text: "View",
      onPress: () => viewPdf(selectedSong?.document),
    },
    {
      text: "Share",
      onPress: () =>
        downloadPdf(
          selectedSong?.document,
          selectedSong?.name,
          selectedSong?.composer,
          setDownloadProgress,
          setFileUri,
          setIsDownloading
        ),
    },
    {
      text: "Save a Song",
      onPress: () =>
        downloadAndSavePdf(
          selectedSong?.document,
          selectedSong?.name,
          selectedSong?.composer,
          setDownloadProgress,
          setIsDownloading
        ),
    },
  ];

  return (
    <View className="flex-1 bg-black">
      <Header_Songs title={route?.params?.category} />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          const isCloseToBottom =
            nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 20;
          if (isCloseToBottom) loadMoreSongs();
        }}
      >
        {songs?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSongPress(item)}
            className="flex flex-row items-center py-2 px-3 border-b border-gray-300"
          >
            <FontAwesome6 name="file-pdf" size={27} color="#F40F02" />
            <View className="flex-1 ml-3">
              <Text className="text-white font-bold">{item.name}</Text>
              <Text className="text-gray-400">by {item.composer}</Text>
            </View>
            {item==selectedSong && isDownloading &&<View className='rounded-full bg-white px-1 py-1'>
              <Text>{downloadProgress}</Text>
            </View>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={`${selectedSong?.name} by ${selectedSong?.composer}`}
        options={modalOptions}
      />
    </View>
  );
};

export default SongCategories;
