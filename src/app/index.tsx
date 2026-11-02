import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Redirect, router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supaBase";
import { useAuth } from "../providers/AuthProvider";
import { Poll } from "../types/db";

export default function Index() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const fetchPolls = async () => {
        try {
          setLoading(true);
          let { data, error } = await supabase.from("polls").select("*");

          if (error) {
            setError(error.message);
            return;
          }

          setPolls(data || []);
        } catch {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchPolls();
    }, [user])
  );

  // Hooks must run on every render, so redirect only after they have been called
  if (!user) {
    return <Redirect href="/login" />;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ad1457" />
        <Text className="text-pink-600 mt-2">Loading polls...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading polls: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Polls",
          headerStyle: { backgroundColor: "#fce4ec" },
          headerTintColor: "#ad1457",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        }}
      />
      <FlatList
        data={polls}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <Pressable
            onPress={() => router.push("/newPoll")}
            className="m-2 p-4 bg-pink-400 rounded-lg items-center"
          >
            <Text className="text-white font-bold">Create New Poll</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="p-4 items-center">
            <Text className="text-gray-500">
              No polls found. Create your first poll!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="m-2 p-4 bg-white border border-pink-300 mb-4 rounded-lg shadow-sm">
            <Link href={`/${item.id}`} className="flex-1">
              <View>
                <Text className="text-lg font-semibold text-pink-800">
                  {item.question}
                </Text>
              </View>
            </Link>
            <Pressable
              onPress={async () => {
                try {
                  const { error } = await supabase
                    .from("polls")
                    .delete()
                    .eq("id", item.id);

                  if (error) {
                    console.error("Supabase error:", error);
                    Alert.alert("Error", "Failed to delete the poll");
                  } else {
                    setPolls((prev) =>
                      prev.filter((poll) => poll.id !== item.id)
                    );
                    Alert.alert("Success", "Poll deleted successfully");
                  }
                } catch (err) {
                  console.error("Unexpected error:", err);
                  Alert.alert("Error", "An unexpected error occurred");
                }
              }}
              className="absolute top-2 right-2 p-2"
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ad1457" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
