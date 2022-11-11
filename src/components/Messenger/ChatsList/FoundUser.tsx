import { Style, UserSnapshot } from "../../../models/models";
import React from "react";
import OnlineIndicator from "../../OnlineIndicator";

interface FoundUserProps {
  onClick: () => void;
  first: boolean;
  only: boolean;
  currentUser: UserSnapshot;
}

const styles: Style = {
  container:"hover:bg-[#2c2c31] bg-inherit flex items-center justify-between w-full px-2",
  send: "flex items-center gap-2 text-sm cursor-pointer py-2",
};

const FoundUser = ({ onClick, first, only, currentUser }: FoundUserProps) => {
  return (
    <>
      <div
        className={`${styles.container} ${only ? "rounded-xl" : first ? "rounded-t-xl" : "rounded-b-xl"}`}>
        <h3>{currentUser.login}</h3>
        <div onClick={onClick} className={styles.send}>
          <p>send request</p>
          <OnlineIndicator online={currentUser.isOnline} />
        </div>
      </div>
    </>
  );
};

export default FoundUser;
