import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "../Pages/Archives/Home";
// import Setting from "../Pages/Other/Setting";
import SongStack from "./ArchiveStack";
import { Dimensions, Platform, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from "../Components/Global";
import HomePageNavigation from "./HomeNavigation";
import CommunityStack from "./CommunityStack";
import ArchiveStack from "./ArchiveStack";
export default function BottomTab() {
  const Tab = createBottomTabNavigator();
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  return (
    <Tab.Navigator
    initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
        tabBarActiveBackgroundColor:COLORS.black,
        
        tabBarStyle: {
          position: "absolute",

          backgroundColor: COLORS.black,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderTopWidth: 0, // Remove the top border (divider)
         
        },
        tabBarStyle: {
          backgroundColor:COLORS.black
        }
      }}
    >
      
      <Tab.Screen
        name="archive"
        component={ArchiveStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={`${focused?'bg-white px-5 rounded-full':null} py-1 items-center justify-center`}>
              <MaterialIcons
                name="library-music"
                size={30}
                color={focused ? COLORS.black : COLORS.white}
              />
              {/* <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                SONGS
              </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomePageNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={`${focused?'bg-white px-5 rounded-full':null} py-1 items-center justify-center`}>
              <FontAwesome
                name="home"
                size={30}
                color={focused ? COLORS.black : COLORS.white}
              />
              {/* <Text
                className="font-bold "
                style={{ color: focused ? COLORS.white : COLORS.black }}
              >
                HOME
              </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Communinty"
        component={CommunityStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={`${focused?'bg-white px-5 rounded-full':null} py-1 items-center justify-center`}>
             
              <MaterialCommunityIcons name="account-music" size={30}  color={focused ? COLORS.black : COLORS.white} />
              {/* <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                COMMUNITY
              </Text> */}
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Feather
                name="settings"
                size={24}
                color={focused ? COLORS.purple : COLORS.white}
              />

              <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                SETTINGS
              </Text>
            </View>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}
