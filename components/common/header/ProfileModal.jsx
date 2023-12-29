import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { updateDoc, doc } from "@firebase/firestore";
import { firestore, upload } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";

import styles from "./profileModal.style";
import AuthButtons from "../../home/buttons/AuthButtons";

const ProfileModal = ({ visible, onClose, user, userId, onUpdate }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await updateDoc(doc(firestore, "users", userId), {
        firstName,
        lastName,
      });

      if (selectedImage) {
        const imageBlob = await fetch(selectedImage).then((res) => res.blob());

        await upload(imageBlob, user, () => {
          console.log("Image uploaded");
        });
      }

      onUpdate(firstName, lastName, selectedImage);

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.Container}>
        <View style={styles.Inner}>
          <Text
            style={{
              backgroundColor: "#2596be",
              borderRadius: 4,
              color: "white",
              padding: 8,
            }}
          >
            Edit Profile
          </Text>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={{ marginTop: 8 }}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={{ marginTop: 8 }}
          />
          <TouchableOpacity style={styles.AuthButtons} onPress={pickImageAsync}>
            <Text>Upload a photo</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 200,
                height: 200,
                resizeMode: "cover",
                marginBottom: 10,
              }}
            />
          )}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <TouchableOpacity style={styles.AuthButtons} onPress={handleUpdate}>
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.AuthButtons} onPress={onClose}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View>
          <AuthButtons onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;
