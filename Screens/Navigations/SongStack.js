import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Song from '../Pages/SongPage/Song'
import Home from '../Pages/SongPage/Home'
const SongStack = () => {
    const stack = createNativeStackNavigator()
    return (
        <stack.Navigator initialRouteName='Song_home' screenOptions={{
            headerShown:false
        }}>
            <stack.Screen name='Song_home' component={Home} />
            <stack.Screen name='song' component={Song}/>
        </stack.Navigator>
    )
}
export  default SongStack