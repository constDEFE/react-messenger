import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getNewId, uploadImage } from "../../../utils/functions";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { BiPaperPlane } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { Style } from "../../../models/models";
import { db } from "../../../firebase";

const styles: Style = {
  form: "p-2 flex gap-2 border-t-[#202020] border-t-2 justify-between items-center",
  label: "cursor-pointer",
  upload: "hover:scale-110 duration-150 ease-out",
  uploadInput: "hidden",
  textArea: "w-full text-lg overflow-hidden max-h-[180px] h-[44px] min-h-[44px] text-black focus:outline-none rounded-3xl px-4 py-2",
  send: "hover:scale-110 duration-150 ease-out",
};

const TextForm = () => {
  const [message, setMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentChat } = useAppSelector((state) => state.chat);
  const { userSnap } = useAppSelector((state) => state.user);
  const id = userSnap && currentChat ? getNewId(userSnap.uid, currentChat.uid) : null;

  const handleMessage = (event: ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value);
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => event.preventDefault();

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    setLoading(true);
    setImage(target.files ? target.files[0] : null);
  };

  const sendMessage = async () => {
    if (!message) return;

    if (id && userSnap && currentChat) {
      const text = message;
      setMessage("");

      const downloadURL = image ? await uploadImage(image) : null;
      setLoading(false);

      await addDoc(collection(db, "messages", id, "chat"), {
        message: text,
        from: userSnap.uid,
        to: currentChat.uid,
        createdAt: Timestamp.fromDate(new Date()),
        media: downloadURL || "",
      });

      await setDoc(doc(db, "lastMessage", id), {
        message: text,
        from: userSnap.uid,
        to: currentChat.uid,
        createdAt: Timestamp.fromDate(new Date()),
        media: downloadURL || "",
        unread: true,
      });

      setImage(null);
    }
  };

  const handleEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="img" className={styles.label}>
        <FiUpload className={`${styles.upload} ${loading ? "animate-bounce" : null}`} size={33} />
      </label>
      <input
        onChange={handleImage}
        className={styles.uploadInput}
        type="file"
        id="img"
        accept="image/*"
      />
      <textarea
        onChange={handleMessage}
        onKeyDown={handleEnter}
        value={message}
        maxLength={1024}
        className={styles.textArea}
        placeholder="Enter message"
      />
      <div>
        <button type="submit" onClick={sendMessage}>
          <BiPaperPlane className={styles.send} size={33} />
        </button>
      </div>
    </form>
  );
};

export default TextForm;
