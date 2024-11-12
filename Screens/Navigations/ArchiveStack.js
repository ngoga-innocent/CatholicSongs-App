import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import Song from '../Pages/Archives/Song'
// import Home from '../Pages/Archives/Home'
import Archives from '../Pages/Archives/Home'
import SingleEvent from '../Pages/Archives/SingleEvent'
const ArchiveStack = () => {
    const stack = createNativeStackNavigator()
    return (
        <stack.Navigator initialRouteName='Song_home' screenOptions={{
            headerShown:false
        }}>
            <stack.Screen  name='home' component={Archives} />
            <stack.Screen name='single_event' component={SingleEvent} />
        </stack.Navigator>
    )
}
export  default ArchiveStack