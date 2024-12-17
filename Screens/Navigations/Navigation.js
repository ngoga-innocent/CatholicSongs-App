import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import BottomTab from "./BottomTab";
import Splash from "../Components/Splash";
import AuthStack from "./AuthScreen";
import React from "react";
import OnBoardingScreen from "../Pages/Other/OnBoardingScreen";

const RootStack = () => {
  const Stack = createNativeStackNavigator();

  const linking = {
    prefixes: ["umuzikigatorika://", "https://umuzikigatorika.onrender.com"],
    config: {
      screens: {
        Tab: {
          screens: {
            Home: {
              screens: {
                homepage: "home",
                song_category: "categories",
                notification: "notifications",
              },
            },
            archive:{
              screens: {
                single_event: "single_event/:id",
              },
            }
          },
        },
      },
    },
    async getInitialURL() {
      // Check if the app was opened with a deep link
      const url = await Linking.getInitialURL();
      if (url) {
        console.log(url);
        return url;
      }
      console.log('No initial URL');
      // Check if the app was opened from a push notification Background
      const response = await Notifications.getLastNotificationResponseAsync();
      console.log("url",response?.notification?.request?.content?.data);
      return response?.notification.request.content.data.url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }) => listener(url);

      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

      // Listen to push notifications Foreground
      const notificationSubscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
          const url = response.notification.request.content.data.url;
          console.log(url);
          if (url) {
            listener(url);
          }
        });

      return () => {
        // Cleanup subscriptions
        linkingSubscription.remove();
        notificationSubscription.remove();
      };
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          component={OnBoardingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Tab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
