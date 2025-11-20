import { supabase } from "@/src/lib/supaBase";
import { router, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Profile",
          headerStyle: { backgroundColor: "#fce4ec" },
          headerTintColor: "#ad1457",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        }}
      />
      <View className="mb-8">
        <Text className="text-xl font-bold text-center text-pink-800 mb-2">
          Welcome {user?.email}!
        </Text>
      </View>
      <Pressable
        onPress={() => supabase.auth.signOut()}
        className="m-4 p-4 bg-pink-500 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/")}
        className="m-4 p-4 bg-pink-500 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Go to Polls</Text>
      </Pressable>
    </>
  );
}
