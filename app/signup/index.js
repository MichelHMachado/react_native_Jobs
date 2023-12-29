import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { auth, firestore } from "../../firebaseConfig";
import { collection, addDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const router = useRouter();

  const onSignUpPress = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await addDoc(collection(firestore, "users"), {
        uid: user.uid,
        firstName,
        lastName,
        email,
      });

      // Redirect to welcome page or any other page
      router.push("/");
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        id="first-name-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        id="last-name-input"
      />
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

      <Button
        testID="signup-button"
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
