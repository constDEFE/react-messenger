import ChatsList from "../components/Messenger/ChatsList/ChatsList";
import { Style } from "../models/models";
import React from "react";
import Chat from "../components/Messenger/Chat/Chat";

const styles: Style = {
  main: "h-full flex",
};

const Home = () => {
  return (
    <section className={styles.main}>
      <ChatsList />
      <Chat />
    </section>
  );
};

export default Home;
