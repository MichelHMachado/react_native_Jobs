import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, images, SIZES } from "../constants";
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import ProfileModal from "../components/common/header/ProfileModal";

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateUserProfile = useCallback(
    async (firstName, lastName, photo) => {
      try {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: photo ?? user.photoURL,
        });
        setUser((prevUser) => ({
          ...prevUser,
          displayName: `${firstName} ${lastName}`,
          photo,
        }));
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    },
    [user]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={user?.photoURL ? { uri: user.photoURL } : images.profile}
              dimension="100%"
              handlePress={() => setModalVisible(!isModalVisible)}
            />
          ),
          headerTitle: "",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            user={user}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/search/${searchTerm}`);
              }
            }}
            onUpdateUserProfile={handleUpdateUserProfile}
          />
          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>

      <ProfileModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
        onUpdate={(firstName, lastName, photo) =>
          handleUpdateUserProfile(firstName, lastName, photo)
        }
      />
    </SafeAreaView>
  );
};

export default Home;
