import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Musicians from "../Pages/Community/Musicians";
import MusicianProfile from "../Pages/Community/MusicianProfile";

const CommunityStack = () => {
  const stack = createNativeStackNavigator();
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Musicians" component={Musicians} />
      <stack.Screen name="musician_profile" component={MusicianProfile} />
    </stack.Navigator>
  );
};
export default CommunityStack;
