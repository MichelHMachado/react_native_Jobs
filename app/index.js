// Home.js
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, images, SIZES } from "../constants";
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
      // Check if the user is authenticated
      if (authUser) {
        try {
          // Get the user document from Firestore using the UID
          const userDocRef = collection(firestore, "users");
          const userQuery = query(userDocRef, where("uid", "==", authUser.uid));
          const userDocSnapshot = await getDocs(userQuery);
          setUserId(userDocSnapshot.docs[0].id);
          // Check if the user document exists
          if (!isEmpty(userDocSnapshot.docs)) {
            const userData = userDocSnapshot.docs[0].data();

            setUser({
              uid: authUser.uid,
              name: userData.firstName + " " + userData.lastName,
              photo: authUser?.photoURL, // Assuming there is a "photo" field in your user document
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear the user state
      setUser(null);
      setUserId(null);
      router.push("/"); // Redirect to the home page or any other page after signing out
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  console.log(user);
  // Modify the handleUpdateUserProfile function to accept separate firstName and lastName parameters
  const handleUpdateUserProfile = useCallback(
    async (firstName, lastName) => {
      try {
        // Update the user information in Firestore
        const userDocRef = doc(firestore, "users", userId);
        await updateDoc(userDocRef, {
          firstName,
          lastName,
        });

        // Update the user state
        setUser((prevUser) => ({
          ...prevUser,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
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
              iconUrl={user?.photo ?? images.profile}
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
          <TouchableOpacity
            onPress={() => {
              router.push("/signup");
            }}
            style={{ ...buttonStyle, backgroundColor: "blue" }}
          >
            <Text>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/signin");
            }}
            style={{ ...buttonStyle, backgroundColor: "gray" }}
          >
            <Text>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            style={{ ...buttonStyle, backgroundColor: "red" }}
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
        userId={userId}
        onUpdate={(firstName, lastName) =>
          handleUpdateUserProfile(firstName, lastName)
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const buttonStyle = {
  flex: 1,
  width: "150px",
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
  marginTop: 10,
  paddingVertical: 10,
  paddingHorizontal: 20,
};
