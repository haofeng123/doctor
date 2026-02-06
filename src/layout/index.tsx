import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeBottomTab from "./bottom-tab";
import ScheduleDetail from "@/pages/schedule-detail";



const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ 
      headerBackTitle: '',
      headerBackButtonDisplayMode: 'minimal',
    }}>
      <Stack.Screen name="MainTab" component={HomeBottomTab} options={{ headerShown: false }} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetail} />
    </Stack.Navigator>
  );
}




const Layout = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default Layout;