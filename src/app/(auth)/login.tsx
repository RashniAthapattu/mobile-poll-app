import React, { useState } from "react";
import {
  Alert,
  AppState,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supaBase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    else if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <>
      <View className="flex-1 justify-center p-6 bg-pink-50">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-pink-800 mb-2">
            Welcome
          </Text>
        </View>

        <View className="mb-4">
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            className="p-4 bg-white border border-pink-300 rounded-lg shadow-sm"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="mb-6">
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            className="p-4 bg-white border border-pink-300 rounded-lg shadow-sm"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <Pressable
          onPress={signInWithEmail}
          disabled={loading}
          className={`p-4 rounded-lg mb-3 ${
            loading ? "bg-pink-300" : "bg-pink-400"
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? "Loading..." : "Sign In"}
          </Text>
        </Pressable>

        <Pressable
          onPress={signUpWithEmail}
          disabled={loading}
          className={`p-4 rounded-lg ${loading ? "bg-pink-200" : "bg-pink-300"}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? "Loading..." : "Sign Up"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
