// Home.js
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
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "@firebase/firestore";
import { isEmpty } from "lodash";
import ProfileModal from "../components/common/header/ProfileModal";

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = collection(firestore, "users");
          const userQuery = query(userDocRef, where("uid", "==", authUser.uid));
          const userDocSnapshot = await getDocs(userQuery);
          setUserId(userDocSnapshot.docs[0].id);

          if (!isEmpty(userDocSnapshot.docs)) {
            const userData = userDocSnapshot.docs[0].data();

            setUser({
              uid: authUser.uid,
              name: userData.firstName + " " + userData.lastName,
              photo: authUser?.photoURL,
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateUserProfile = useCallback(
    async (firstName, lastName, photo) => {
      try {
        const userDocRef = doc(firestore, "users", userId);
        await updateDoc(userDocRef, {
          firstName,
          lastName,
        });

        setUser((prevUser) => ({
          ...prevUser,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          photo,
        }));
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    },
    [userId]
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
              iconUrl={user?.photo ? { uri: user.photo } : images.profile}
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
        userId={userId}
        onUpdate={(firstName, lastName, photo) =>
          handleUpdateUserProfile(firstName, lastName, photo)
        }
      />
    </SafeAreaView>
  );
};

export default Home;
