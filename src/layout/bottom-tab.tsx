import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/pages/home';
import User from '@/pages/me';

const Tab = createBottomTabNavigator();

const HomeBottomTab = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name="User" component={User} options={{ title: 'User' }} />
    </Tab.Navigator>
  )
}


export default HomeBottomTab;