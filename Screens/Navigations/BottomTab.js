import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Pages/SongPage/Home";
import Setting from "../Pages/Other/Setting";
import SongStack from "./SongStack";
import { Dimensions, Platform, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../Components/Global";
import HomePageNavigation from "./HomeNavigation";
import CommunityStack from "./CommunityStack";
export default function BottomTab() {
  const Tab = createBottomTabNavigator();
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
        tabBarStyle: {
          position: "absolute",

          backgroundColor: "#fff",
          height: "8%",
          left: "2%",
          right: "2%",
          alignSelf: "center",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
          shadowColor: "#d1d6eb",
          shadowOffset: 3,
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePageNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <FontAwesome
                name="home"
                size={24}
                color={focused ? COLORS.purple : COLORS.black}
              />
              <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                HOME
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Songs"
        component={SongStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <MaterialIcons
                name="library-music"
                size={24}
                color={focused ? COLORS.purple : COLORS.black}
              />
              <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                SONGS
              </Text>
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
            <View className="items-center justify-center">
              <MaterialIcons
                name="manage-accounts"
                color={focused ? COLORS.purple : COLORS.black}
                size={24}
              />
              <Text
                className="font-bold "
                style={{ color: focused ? COLORS.purple : COLORS.black }}
              >
                COMMUNITY
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Feather
                name="settings"
                size={24}
                color={focused ? COLORS.purple : COLORS.black}
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
      />
    </Tab.Navigator>
  );
}
