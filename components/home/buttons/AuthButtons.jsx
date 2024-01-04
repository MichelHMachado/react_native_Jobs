// AuthButtons.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "../../../firebaseConfig";

const AuthButton = ({ text, onPress, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor }]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const AuthButtons = ({ onClose }) => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup");
    onClose();
  };

  const handleSignIn = () => {
    router.push("/signin");
    onClose();
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  return (
    <>
      <AuthButton
        text="Sign Out"
        onPress={handleSignOut}
        backgroundColor="red"
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "white",
    borderWidth: 1,
    borderColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AuthButtons;
