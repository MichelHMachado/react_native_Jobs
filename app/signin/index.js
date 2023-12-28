import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const onSignInPress = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the main app screen or any other page on successful sign-in
      router.push("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
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

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
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
