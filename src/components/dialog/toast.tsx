import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import RootSiblings from 'react-native-root-siblings';

let sibling: RootSiblings | null = null;

interface ToastContainerProps {
  message: string;
}

const ToastContainer = ({ message }: ToastContainerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.toast}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};



  export const showToast = (message: string) => {
    if(sibling){
      sibling.destroy();
    }
    sibling = new RootSiblings(<ToastContainer message={message} />);
    setTimeout(() => {
      if(sibling){
        sibling.destroy();
      }
    }, 3000);
  }

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  }
});