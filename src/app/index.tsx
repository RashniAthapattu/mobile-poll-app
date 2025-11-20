import { Link, Redirect, router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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

  if (!user) {
    return <Redirect href="/login" />;
  }
  useFocusEffect(
    useCallback(() => {
      const fetchPolls = async () => {
        try {
          setLoading(true);
          let { data, error } = await supabase.from("polls").select("*");

          if (error) {
            setError(error.message);
            return;
          }

          setPolls(data || []);
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchPolls();
    }, [])
  );

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
            className="m-2 p-4 bg-pink-500 rounded-lg items-center"
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
          <Link
            href={`/${item.id}`}
            className="m-2 p-4 bg-white border border-pink-300 mb-4 rounded-lg shadow-sm"
          >
            <View>
              <Text className="text-lg font-semibold text-pink-800">
                {item.question}
              </Text>
            </View>
          </Link>
        )}
      />
    </View>
  );
}
