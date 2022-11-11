import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { setCurrentChat, setMessages } from "../../../redux/slices/chatSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { getNewId } from "../../../utils/functions";
import { Style } from "../../../models/models";
import TextForm from "./TextForm";
import UserImg from "../../../assets/user-128.svg";
import Message from "./Message";
import { db } from "../../../firebase";

const styles: Style = {
  chat: "w-full flex flex-col justify-between",
  noChat: "flex justify-center",
  chatNavigation: "px-2 p-1 flex border-b-[#202020] border-b-2 items-center gap-2",
  messagesContainer: "h-full p-4 flex flex-col gap-4 overflow-y-scroll overflow-x-hidden",
  selectChat: "mt-64 font-bold tracking-wide text-3xl text-[#414141] pointer-events-none",
  closeButton: "hover:scale-[1.15] duration-200 ease-out",
  userCard: "flex items-center gap-2",
  chatImg: "rounded-full bg-black/80 h-[56px]",
  chatLogin: "text-xl font-semibold",
  loadingContainer: "h-full w-full flex items-center justify-center",
  loading: "text-2xl font-bold tracking-wide text-zinc-400",
};

const Chat = () => {
  const { currentChat, messages } = useAppSelector((state) => state.chat);
  const { userSnap } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const closeChat = () => {
    dispatch(setCurrentChat(null));
    dispatch(setMessages([]));
  };

  useEffect(() => {
    if (currentChat && userSnap) {
      setLoading(true);

      const id = getNewId(userSnap.uid, currentChat.uid);
      const messagesRef = collection(db, "messages", id, "chat");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arr: any[] = [];
        querySnapshot.forEach((doc) => arr.push(doc.data()));

        dispatch(setMessages(arr));
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentChat]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView();
  }, [messages])

  return (
    <section className={styles.chat}>
      {currentChat ? (
        <>
          <div className={styles.chatNavigation}>
            <button onClick={closeChat}>
              <BiLeftArrowAlt className={styles.closeButton} size={33} />
            </button>
            <div className={styles.userCard}>
              <img
                className={styles.chatImg}
                src={currentChat.image || UserImg}
                alt="/"
              />
              <h4 className={styles.chatLogin}>{currentChat.login}</h4>
            </div>
          </div>
          {loading ? (
            <div className={styles.loadingContainer}>
              <h2 className={styles.loading}>Loading...</h2>
            </div>
          ) : (
            <div className={styles.messagesContainer}>
              {!!messages.length &&
                userSnap &&
                messages.map((message, index) => (
                  <Message
                    message={message}
                    key={`${index}MESSAGE_ID`}
                    senderUid={userSnap.uid}
                  />
                ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          <TextForm />
        </>
      ) : (
        <div className={styles.noChat}>
          <h2 className={styles.selectChat}>
            Select chat to start Conversation
          </h2>
        </div>
      )}
    </section>
  );
};

export default Chat;
