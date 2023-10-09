import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
 } from "firebase/auth";


const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const logout = () => {
    return signOut(auth);
  }


  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const singIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  useEffect(()=> {
    const unsibscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsibscribe;
  },[])

  return (
    <UserContext.Provider value={{ createUser, user, singIn, logout }}>
      {children}
      </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};