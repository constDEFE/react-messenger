import { Style } from "../models/models";
import React from "react";

const styles: Style = {
  loadingContainer: "w-screen h-[90vh] flex items-center justify-center",
  loading: "text-3xl font-bold tracking-wide text-zinc-400 pointer-events-none",
};

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <h2 className={styles.loading}>Loading...</h2>
    </div>
  );
};

export default Loading;
