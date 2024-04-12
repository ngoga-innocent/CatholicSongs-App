import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from '../Pages/HomePages/HomePage'

const HomePageNavigation = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown:false
        }}>
            <Stack.Screen name='homepage' component={HomePage} />
        </Stack.Navigator>
    )
}

export default HomePageNavigation