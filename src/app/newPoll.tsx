import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supaBase";
import { useAuth } from "../providers/AuthProvider";

export default function NewPoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const deleteOption = (index: number) => {
    if (options.length <= 2) {
      Alert.alert("Error", "You need at least 2 options");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const createPoll = async () => {
    setError("");

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    const validOptions = options.filter((option) => option.trim() !== "");
    if (validOptions.length < 2) {
      setError("Please enter at least 2 options");
      return;
    }

    const { data, error: supabaseError } = await supabase
      .from("polls")
      .insert([
        {
          question: question.trim(),
          options: validOptions,
        },
      ])
      .select();

    if (supabaseError) {
      Alert.alert("Failed to create the poll");
      console.log(supabaseError);
      return;
    }

    Alert.alert("Success", "Poll created successfully!");
    router.back();
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: "Create New Poll",
          headerStyle: { backgroundColor: "#fce4ec" },
          headerTintColor: "#ad1457",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        }}
      />
      <View>
        <Text className="text-xl font-bold text-pink-800 mb-4">Question</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          className="m-2 p-4 bg-white border rounded-lg border-pink-300 shadow-sm"
          placeholder="Type your question"
        />
      </View>
      <View className="mt-6">
        <Text className="text-xl font-bold text-pink-800 mb-4">Options</Text>
        {options.map((option, index) => (
          <View key={index} className="flex-row items-center">
            <TextInput
              onChangeText={(text) => updateOption(index, text)}
              value={option}
              className="flex-1 m-2 p-4 bg-white border rounded-lg border-pink-300 shadow-sm"
              placeholder={`Option ${index + 1}`}
            />
            <Pressable
              onPress={() => deleteOption(index)}
              className="p-2 mr-4 absolute right-0"
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ad1457" />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={addOption}
        className="mt-6 p-4 bg-pink-300 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Add Option</Text>
      </Pressable>
      <Pressable
        onPress={createPoll}
        className="mt-4 p-4 bg-pink-400 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Create Poll</Text>
      </Pressable>
      {error ? (
        <Text className="text-red-500 mt-4 text-center">{error}</Text>
      ) : null}
    </View>
  );
}
