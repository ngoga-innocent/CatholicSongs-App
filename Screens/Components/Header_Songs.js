import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, dimensions } from "./Global";
import { useDispatch,useSelector } from "react-redux";
import { FetchCopiesType, GetSong, SearchSong } from "../../redux/Features/CopuesSlice";
import Toast from "react-native-toast-message";
export default HeaderSongs = ({ title }) => {
  const inset = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [location,setLocation]=useState({"x":null,"y":null})
  const [sort,setSort]=useState(false)
  const dispatch = useDispatch();
  const {copiesType}=useSelector(state=>state.Copies)
  
  const handleSearch = async () => {
    // console.log("button pressed")
    const result = await dispatch(SearchSong({ search: search }));
    if (SearchSong.fulfilled.match(result)) {
        
      // console.log("Search result",result.payload)
    }
    if (SearchSong.rejected.match(result)) {
      return Toast.show({
        text1: "No song Fond",
        type: "info",
        autoHide: true,
        visibilityTime:8000,
        position: "top"
      });
      // console.log("Search error",result.payload)
    }
  };
  //Handle Sorting
  const SortBy = async(e) => {
    // console.log("Sort by button pressed")
    
    setSort(!sort)
    setLocation({x:e.nativeEvent?.locationX, y:e.nativeEvent?.pageY})
    const result=await dispatch(FetchCopiesType())
    if(FetchCopiesType.fulfilled.match(result)){
      // console.log("Fetch Type result",result.payload)
    }
    if(FetchCopiesType.rejected.match(result)){
        // console.log("Fetch Type error",result.payload)
  
    }
    
  };
  const handleSeasonSort=async(season_id)=>{
        const result=await dispatch(GetSong({category_id:title?.id,season:season_id}))
        if(GetSong.fulfilled.match(result)){
            setSort(!sort)
            // console.log("Season sort result",result.payload)
        }
        if(GetSong.rejected.match(result)){
            setSort(!sort)
            console.log("Season sort error",result.payload)
        }
  }
  return (
    <View
      className="flex z-50 flex-row items-center justify-between relative py-2 px-1  bg-black "
      style={{ paddingTop: inset.top }}
    >
      <View className="z-50 w">
            <Toast />
        </View>
      <Text className="text-white font-bold text-lg"> {} </Text>
      <View className="flex-1 border px-3 mr-2 flex flex-row items-center justify-between border-white rounded-full">
        <TextInput
          className="py-1 text-white "
          placeholder={`${title?.name || ' search a song or composer'}`}
          placeholderTextColor='gray'
          value={search}
          onChangeText={(e) => setSearch(e)}
        />
        <TouchableOpacity onPress={() => handleSearch()}>
          <AntDesign name="search1" size={dimensions.big_icon*0.8} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={(e) => SortBy(e)}>
        <Ionicons name="filter" size={30} color={COLORS.white} />
      </TouchableOpacity>
      {sort && <View className="absolute z-50 bg-white py-2 px-6 rounded-lg" style={{
        position:'absolute',
        top:location.y + 12,
        right:location.x
      }}>
        <ScrollView>
        {copiesType?.types?.map((item,index)=>{
            return(
                <TouchableOpacity onPress={()=>handleSeasonSort(item.id)} key={index} className="px-2 py-2 border-b ">
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            )
        })}
        </ScrollView>
      </View>}
    </View>
  );
};
