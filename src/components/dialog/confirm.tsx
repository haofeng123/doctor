import { Text, View, Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import RootSiblings from "react-native-root-siblings";

let sibling: RootSiblings | null = null;

export interface ConfirmOptions {
  title: string;
  content: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

interface ConfirmContainerProps extends ConfirmOptions {
  onClose: () => void;
}

const ConfirmContainer = ({
  title,
  content,
  onCancel,
  onConfirm,
  onClose,
  cancelText = "Cancel",
  confirmText = "Confirm",
}: ConfirmContainerProps) => {
  const handleCancel = () => {
    onClose();
    onCancel?.();
  };

  const handleConfirm = () => {
    onClose();
    onConfirm?.();
  };

  return (
    <View style={styles.mask}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.confirmButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const hideConfirm = () => {
  if (sibling) {
    sibling.destroy();
    sibling = null;
  }
};

export const showConfirm = (options: ConfirmOptions) => {
  if (sibling) {
    sibling.destroy();
  }
  sibling = new RootSiblings(
    <ConfirmContainer
      {...options}
      onClose={hideConfirm}
    />
  );
  return hideConfirm;
};

const styles = StyleSheet.create({
  mask: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#1890ff",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
