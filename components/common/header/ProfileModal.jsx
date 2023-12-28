import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  Button as RNButton,
  Image,
} from "react-native";
import { updateDoc, doc } from "@firebase/firestore";
import { firestore, upload } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";

import styles from "./profileModal.style";

const ProfileModal = ({ visible, onClose, user, userId, onUpdate }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [selectedImage, setSelectedImage] = useState(null);

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
    if (!firstName.trim() && !lastName.trim()) {      
      alert("Please enter a first name or last name.");
      return;
    }
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

    
    onUpdate(firstName, lastName);

    
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.Container}>
        <View style={styles.Inner}>
          <Text>Edit Profile</Text>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <RNButton title="Upload a photo" onPress={pickImageAsync} />

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
          <RNButton title="Update" onPress={handleUpdate} />
          <RNButton title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;
