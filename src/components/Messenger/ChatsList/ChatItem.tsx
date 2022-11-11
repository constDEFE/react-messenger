import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { Message, Style, UserSnapshot } from "../../../models/models";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { setCurrentChat } from "../../../redux/slices/chatSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { getNewId } from "../../../utils/functions";
import UserImg from "../../../assets/user-128.svg";
import { db } from "../../../firebase";
import OnlineIndicator from "../../OnlineIndicator";

interface UserItemProps {
  uid: string;
}

const styles: Style = {
  container: "h-[64px] w-full hover:bg-[#101010] flex items-center justify-between px-2 duration-75 ease-out cursor-pointer",
  selected: "h-[64px] w-full bg-[#252525] hover:bg-[#101010] flex items-center justify-between px-2 duration-75 ease-out cursor-pointer",
  left: "flex items-center gap-2",
  img: "w-[56px] bg-black/80 rounded-full",
  textContainer: "",
  login: "font-semibold",
  message: "truncate w-[100px] text-[0.95rem]",
  fromMe: "font-semibold",
  loginContainer: "flex items-center gap-2",
  new: "text-sm bg-blue-600 rounded-full px-[3px] font-medium",
};

const ChatItem = ({ uid }: UserItemProps) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [currentUser, setCurrentUser] = useState<UserSnapshot | null>(null);
  const { currentChat } = useAppSelector((state) => state.chat);
  const { userSnap } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const id = userSnap && currentUser ? getNewId(userSnap.uid, currentUser.uid) : null;

  const selectUser = async (target: UserSnapshot): Promise<void> => {
    if (userSnap && target && id) {
      dispatch(setCurrentChat(target));

      const document = await getDoc(doc(db, "lastMessage", id));
      const docSnap = document.data();

      if (docSnap && docSnap.from !== target) {
        await updateDoc(doc(db, "lastMessage", id), { unread: false });
      }
    }
  };

  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((snap) => {
      setCurrentUser(snap.data() as UserSnapshot);
    });

    if (id) {
      const unsubscribe = onSnapshot(doc(db, "lastMessage", id), (messages) => {
        setMessage((messages.data() as Message) || null);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div
      className={currentUser?.login === currentChat?.login ? styles.selected : styles.container}
      onClick={() => (currentUser ? selectUser(currentUser) : null)}
    >
      <div className={styles.left}>
        <img className={styles.img} src={currentUser?.image || UserImg} alt="/" />
        <div className={styles.textContainer}>
          <div className={styles.loginContainer}>
            <h4 className={styles.login}>{currentUser?.login}</h4>
            {message && message.from !== userSnap?.uid && message.unread && <span className={styles.new}>New</span>}
          </div>
          {message && (
            <p className={styles.message}>
              {message.from === userSnap?.uid && <span className={styles.fromMe}>Me: </span>}
              {message.message}
            </p>
          )}
        </div>
      </div>
      {currentUser && <OnlineIndicator online={currentUser.isOnline} />}
    </div>
  );
};

export default ChatItem;
