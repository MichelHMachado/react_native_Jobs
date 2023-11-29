import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../firebaseConfig"; // Assuming auth is correctly exported in firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword
import { Stack, useRouter } from "expo-router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSignUpPress = async () => {
    try {
      // Import createUserWithEmailAndPassword from firebase/auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", user);
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Sign Up"
        onPress={() => {
          onSignUpPress();
          router.push("/");
        }}
      />
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
});

export default Signup;
