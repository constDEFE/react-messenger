import { Message as IMessage, Style } from "../../../models/models";
import Moment from "react-moment";
import React from "react";

interface MessageProps {
  message: IMessage;
  senderUid: string;
}

const styles: Style = {
  message: "rounded-t-2xl max-w-[500px] px-2 pt-2 pb-1 text-right ",
  sender: "rounded-bl-2xl bg-[#377cca] self-end",
  receiver: "rounded-br-2xl bg-[#3f3f3f] self-start",
  text: "text-left break-words",
  img: "max-w-[400px] rounded-lg self-center",
  time: "text-sm",
};

const Message = ({ message, senderUid }: MessageProps) => {
  return (
    <div className={`${styles.message} ${senderUid === message.from ? styles.sender : styles.receiver}`}>
      <p className={styles.text}>{message.message}</p>
      {message.media && <img className={styles.img} src={message.media} alt="/" />}
      <p className={styles.time}>
        <Moment fromNow>{message.createdAt.toDate()}</Moment>
      </p>
    </div>
  );
};

export default Message;
