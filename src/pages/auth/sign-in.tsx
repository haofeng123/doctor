import { View, Text, TextInput } from "react-native";
import { StyleSheet } from "react-native-unistyles";



const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text>SignIn</Text>
    </View>
  );
};

export default SignIn;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});