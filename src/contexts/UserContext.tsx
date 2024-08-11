// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";
import User, { UserData } from "../models/userModel";

interface UserContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  userData: null,
  loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userInstance = new User(user);
        const fetchedUserData = await userInstance.fetch();
        setUserData(fetchedUserData);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
