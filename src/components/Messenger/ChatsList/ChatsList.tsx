import React, { useState, ChangeEvent, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Style, UserSnapshot } from "../../../models/models";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useDebounce } from "../../../hooks/useDebounce";
import { sendRequest } from "../../../utils/functions";
import { setChats } from "../../../redux/slices/chatSlice";
import FoundUser from "./FoundUser";
import ChatItem from "./ChatItem";
import { db } from "../../../firebase";

const styles: Style = {
  friends: "flex flex-col gap-2 border-r-2 border-r-[#202020] my-2 w-[360px]",
  searchBadQuery: "text-center font-medium my-3",
  search: "flex relative px-2 py-1",
  searchInput: "text-black w-full px-4 py-2 rounded-lg focus:outline-none font-medium",
  searchResult: "absolute flex flex-col items-center w-[280px] left-2 top-[60px] bg-[#1f1f24] shadow-[#0c0c0c] shadow-md rounded-xl",
  hidden: "hidden",
};

const ChatsList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 600);
  const { userSnap } = useAppSelector((state) => state.user);
  const { chats } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

  const handleClick = (targetUid: string): void => {
    if (userSnap) {
      try {
        sendRequest(userSnap.uid, targetUid);
      } catch (error: any) {
        dispatch(setChats([]));
        alert(error.message);
      }
    }

    setSearchQuery("");
  };

  useEffect(() => {
    if (userSnap) {
      const getUsers = async (): Promise<void> => {
        dispatch(setChats([]));
        setLoading(true);

        if (!debouncedSearch) {
          dispatch(setChats([]));
          return;
        }

        const docList = await getDocs(collection(db, "users"));
        const userList: UserSnapshot[] = [];

        docList.forEach((doc) => {
          const snap = doc.data() as UserSnapshot;

          if (userSnap && snap.uid === userSnap.uid) return;
          else return userList.push(snap);
        });

        const filteredList = userList.filter((user) =>
          user.login.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

        setLoading(false);
        dispatch(setChats(filteredList));
      };

      getUsers();
    }
  }, [debouncedSearch]);

  return (
    <section className={styles.friends}>
      <div className={styles.search}>
        <input
          placeholder="Search for a user..."
          value={searchQuery}
          className={styles.searchInput}
          type="text"
          onChange={handleInput}
        />
        <div className={searchQuery ? styles.searchResult : styles.hidden}>
          {loading && !chats.length && <h4 className={styles.searchBadQuery}>Loading...</h4>}
          {!!chats.length &&
            chats.map((chat, index) => (
              <FoundUser
                onClick={() => handleClick(chat.uid)}
                only={chats.length === 1}
                first={index === 0}
                currentUser={chat}
                key={`${chat.uid}FOUND_ID`}
              />
            ))}
          {!loading && !chats.length && <h4 className={styles.searchBadQuery}>No users match query.</h4>}
        </div>
      </div>
      <div>
        {userSnap?.friends.map((uid) => <ChatItem key={`${uid}FRIEND_ID`} uid={uid} />)}
      </div>
    </section>
  );
};

export default ChatsList;
