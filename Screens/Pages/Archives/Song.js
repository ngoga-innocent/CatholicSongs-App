import React,{useEffect, useState} from "react"
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Modal,ActivityIndicator } from "react-native"

import {  useSelector } from "react-redux"
import { COLORS } from "../../Components/Global"
import * as FileSystem from 'expo-file-system'

import * as Share from "expo-sharing"

import { WebView } from 'react-native-webview'
import { FontAwesome } from '@expo/vector-icons';

const Song = ({route}) => {
    const  CopiesGrouptype  = route?.params?.type
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCopies,setFilterdCopies]=useState([])
    const [openCopy, setOpenCopy] = useState("")
    const [openwebView,setOpenWebView]=useState(false)
    const type = ['Soft Copies', 'Lyrics', 'audio', 'video']
    const [downloading, setDownloading] = useState(false)
    const [downloadingItem,setDownloadingItem]=useState()
    const { copies } = useSelector((state) => state.Copies)
    
    useEffect(() => {
        
         if (CopiesGrouptype) {
            const filtering = copies.copies.filter((item) => item?.category == CopiesGrouptype)
            
             setFilterdCopies(filtering)
            
        }
         else {
             setFilterdCopies(copies.copies)
       }
    }, [CopiesGrouptype])
    // trying Opening and downloading document

    const webViewContent = `
    <html>
      <head>
        <title>PDF Viewer</title>
        <style>
          /* Customize the appearance of the download link/button */
          .download-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: purple;
            color: white;
            padding: 50px 50px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            z-index: 999;
          }
        </style>
      </head>
      <body>
        <!-- Add PDF viewer using Google Docs Viewer -->
        <div>
        <a href="${openCopy}" download="downloaded_file.pdf" class="download-button">Download PDF</a>
        <iframe src="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(openCopy)}" style="width:100%;height:90%;" frameborder="0"></iframe></div>
        
        <!-- Add a download button -->
        
      </body>
    </html>
  `;
    const Download = async (item) => {
        
        try {
            console.log(item.document)
          setOpenWebView(true);
        setOpenCopy(item.document)  // Show WebView after successful download
   
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }

    }
    const ShareFile = async (item) => {
        setDownloading(true)
        try {
            const fileUri = FileSystem.documentDirectory + `${item.name}.pdf`;
        const downloadResult = await FileSystem.downloadAsync(item.document, fileUri);
        
            await Share.shareAsync(downloadResult.uri)
            setDownloading(false)
        } catch (error) {
            console.log(error)
            setDownloading(false)
        }
    }
    return (
        <View className="flex-1 bg-primary pt-14  ">
            {openwebView == true &&
                <Modal className="flex-1" visible={openwebView} onRequestClose={() => setOpenWebView(false)}>
                    {/* <WebView style={{  flex:1 }} nestedScrollEnabled={true} scrollEnabled={true} startInLoadingState={true}
                      source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${openCopy}` }} /> */}
                     <WebView
                        style={{ flex: 1 }}
                        originWhitelist={['*']}
                        source={{ html: webViewContent }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                            console.error('WebView error:', nativeEvent);
                            
                        }}
                    />
                
            </Modal>
            }
            <View className="flex flex-row items-center justify-between ">
                    <Image onError={(error) => console.log('Image error:', error)} source={require('../../../assets/icon.png')} className="w-[15%] h-[100%] " resizeMode="contain" />
                    <View className=" flex flex-row items-center gap-x-1">
                        <TextInput className='bg-white w-[75%] pt-2 rounded-lg px-2 text-right' placeholder="search a Song" value={searchQuery} onChangeText={(e)=>setSearchQuery(e)} />
                        <TouchableOpacity>
                            <Text className="text-white font-bold">Search</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
 
                <ScrollView className="px-3 mt-2 flex-1 " showsVerticalScrollIndicator={false}>
                    <View className="flex mb-8 flex-row overflow-scroll items-center self-center gap-x-2">
                        {type.flatMap((item,index) => {
                            return (
                                <TouchableOpacity className="px-3 py-2 bg-white rounded-md z-10 shadow-md shadow-white" key={index}>
                                    <Text className="text-primary">{item }</Text>
                                </TouchableOpacity>
                            )
                        })}
                </View>
                {filteredCopies.length==0?<Text className="text-white text-center">No Available Copies within this Type</Text>:filteredCopies.flatMap((item, index) => {
                    return (
                        <TouchableOpacity onPress={()=>Download(item)} key={index} className="flex flex-row justify-between items-center py-2 my-1 px-3 rounded-md border border-gray-200">
                            
                                <View className="flex flex-row gap-x-3 items-center w-[70%]">
                                    <Text className="text-white w-[80%]">{item.name}</Text>
                                    <Text className="text-white text-xs w-[60%]">Par({item.composer|| 'Not Specified'})</Text>
                                </View>
                            <TouchableOpacity onPress={() => {
                                ShareFile(item)
                                setDownloadingItem(index)
                            }} >
                                    {downloading && downloadingItem==index?<ActivityIndicator color={COLORS.purple} size={30} />:<FontAwesome name="share-square" size={30} color={COLORS.purple} />}
                                </TouchableOpacity>
                            
                        </TouchableOpacity>
                    )
                })}
                

            
                
                </ScrollView>

        </View>
 )   
}

export default Song