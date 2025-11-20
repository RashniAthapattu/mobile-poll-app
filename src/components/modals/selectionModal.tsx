import { Modal, Pressable, Text, View } from "react-native";

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedOption: string;
  text: string;
}

export default function SelectionModal({
  visible,
  onClose,
  selectedOption,
  text,
}: SelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-pink-100 bg-opacity-50">
        <View className="w-4/5 p-6 bg-white rounded-lg items-center">
          <Text className="text-lg font-bold text-gray-800 mb-4">{text}</Text>
          <Pressable
            onPress={onClose}
            className="mt-4 p-4 bg-pink-300 rounded-lg items-center"
          >
            <Text className="text-white font-bold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
