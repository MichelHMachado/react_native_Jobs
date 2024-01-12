import React from "react";
import { useStorageState } from "../../hook/useStorageState";
import { login, logout } from "../../firebaseConfig";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      setSession(user.uid);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setSession(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
