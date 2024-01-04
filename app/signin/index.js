import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { auth, loginWithGoogle } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
    androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID,
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_ID,
  });

  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const onSignInPress = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setError("Invalid email or password. Please try again, or sign up.");
      console.error("Error during sign in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        id="email-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        id="password-input"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button title="Sign In" onPress={onSignInPress} />

      <Button
        title="Sign In with Google"
        onPress={() => {
          promptAsync();
          router.push("/");
        }}
      />

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/signup")}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  signupText: {
    marginTop: 10,
    textAlign: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default SignIn;
