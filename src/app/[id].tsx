import Feather from "@expo/vector-icons/Feather";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import SelectionModal from "../components/modals/selectionModal";
import { supabase } from "../lib/supaBase";
import { useAuth } from "../providers/AuthProvider";
import { Poll, Vote } from "../types/db";

export default function Questions() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPoll = async () => {
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        Alert.alert("Error fetching poll");
      } else {
        setPoll(data);
      }
    };

    const fetchVote = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", Number(id))
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (data) {
        setUserVote(data);
        setSelectedOption(data.option ?? "");
      }
    };

    fetchPoll();
    fetchVote();
  }, [id, user]);

  const submitVote = async () => {
    if (!selectedOption) {
      Alert.alert("Select an option first");
      return;
    }

    const newVote: any = {
      option: selectedOption,
      poll_id: poll!.id,
      user_id: user?.id,
    };

    if (userVote) {
      newVote.id = userVote.id;
    }

    const { data, error } = await supabase
      .from("votes")
      .upsert([newVote], { onConflict: "id" })
      .select()
      .single();

    if (error) {
      Alert.alert("Failed to submit vote");
      return;
    }

    setUserVote(data);
    setIsModalVisible(true);
  };

  if (!poll) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="pink" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Poll Questions",
          headerStyle: { backgroundColor: "#fce4ec" },
          headerTintColor: "#ad1457",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        }}
      />

      <View className="flex-1 p-4">
        <View>
          <Text className="text-xl font-bold text-pink-800 mb-4">
            {poll.question}
          </Text>
        </View>

        {poll.options.map((option: string, index: number) => (
          <Pressable
            key={index}
            onPress={() => setSelectedOption(option)}
            className="m-2 p-4 bg-white border rounded-lg border-pink-300 shadow-sm flex-row items-center gap-6"
          >
            <Feather
              name={option === selectedOption ? "check-square" : "square"}
              size={20}
              color="pink"
            />
            <Text className="text-lg font-semibold text-pink-800">
              {option}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={submitVote}
          className="mt-4 p-4 bg-pink-300 rounded-lg items-center"
        >
          <Text className="text-white font-bold">Submit</Text>
        </Pressable>

        <SelectionModal
          text={`You selected ${selectedOption}`}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            router.push("/");
          }}
          selectedOption={selectedOption}
        />
      </View>
    </>
  );
}
