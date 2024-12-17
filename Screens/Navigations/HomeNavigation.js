import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from '../Pages/HomePages/HomePage'
import SongCategories from '../Pages/HomePages/SongCategory'
import Notification from '../Pages/HomePages/Notification'
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
const HomePageNavigation = () => {
    const Stack = createNativeStackNavigator()
    
    return (
        <Stack.Navigator  screenOptions={{
            headerShown:false,
            
        }}>
            <Stack.Screen name='homepage' component={HomePage} />
            <Stack.Screen name='song_category' component={SongCategories} />
            <Stack.Screen name='notification' component={Notification} />
            
        </Stack.Navigator>
    )
}

export default HomePageNavigation