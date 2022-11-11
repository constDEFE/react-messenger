import { useAppSelector } from "../hooks/useAppSelector";
import { logout } from "../utils/functions";
import { Style } from "../models/models";
import { Link } from "react-router-dom";
import React from "react";
import { setUserSnapshot } from "../redux/slices/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";

const styles: Style = {
  nav: "flex justify-between px-8 py-4 items-center border-b-2 border-b-[#202020]",
  logo: "font-bold text-2xl tracking-wide",
  links: "flex items-center gap-4 text-xl font-medium tracking-wide",
};

const Navbar = () => {
  const { user, userSnap } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch()

  const handleLogout = async (): Promise<void> => {
    if (userSnap) {
      await logout(userSnap.uid);
      dispatch(setUserSnapshot(null));
    }
  }

  return (
    <nav className={styles.nav}>
      <h2 className={styles.logo}>
        <Link to={"/"}>Chat</Link>
      </h2>
      <ul className={styles.links}>
        {user && userSnap ? (
          <>
            <li>
              <Link to={"/profile"}>Profile</Link>
            </li>
            <li>
              <Link onClick={handleLogout} to={"/signin"}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={"/signin"}>Sign In</Link>
            </li>
            <span>|</span>
            <li>
              <Link to={"/signup"}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
