import { setLoading, setUser, setUserSnapshot } from "./redux/slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { getUserSnapshot } from "./utils/functions";
import { useAppSelector } from "./hooks/useAppSelector";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      currentUser === null && dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getUserSnapshot(user.uid).then((snap) => {
        dispatch(setUserSnapshot(snap));
        dispatch(setLoading(false));
      });
    }
  }, [user]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
