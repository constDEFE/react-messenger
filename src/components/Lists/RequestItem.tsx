import { acceptRequest, declineRequest, getUserSnapshot } from '../../utils/functions';
import React, { useState, useEffect } from "react";
import { Style, UserSnapshot } from "../../models/models";
import { useAppSelector } from "../../hooks/useAppSelector";
import { MdOutlineClose } from "react-icons/md";
import { BiCheck } from 'react-icons/bi';
import UserImg from '../../assets/user-128.svg';

interface RequestItemProps {
  uid: string;
  declined?: boolean;
}

const styles: Style = {
  container: "p-2 rounded-md flex items-center justify-between shadow-md shadow-[#181717] bg-[#28282c]",
  hidden: "hidden",
  row: "flex items-center gap-2",
  imgContainer: "bg-[#050505] shadow-[#0c0c0c] rounded-full",
  img: "rounded-full w-20",
  login: "font-semibold",
  buttons: "mr-4 flex items-center justify-center gap-2",
  button: "cursor-pointer hover:scale-110 duration-150 ease-out",
};


const RequestItem = ({ uid, declined }: RequestItemProps) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSnapshot | null>(null)
  const { userSnap } = useAppSelector((state) => state.user);

  const handleAccept = async (): Promise<void> => {
    if (userSnap && currentUser) {
      await acceptRequest(userSnap, currentUser);
      setHidden(true);
    }
  }

  const handleDecline = async (): Promise<void> => {
    if (userSnap && currentUser) {
      await declineRequest(userSnap, currentUser.uid);
      setHidden(true)
    }
  }

  useEffect(() => {
    getUserSnapshot(uid).then((snap) => {
      setCurrentUser(snap);
    })
  }, [])

  return (
    <div className={hidden ? styles.hidden : styles.container}>
      <div className={styles.row}>
        <div className={styles.imgContainer}>
          {currentUser && currentUser.image ? <img className={styles.img} src={currentUser.image} alt="/"/> : (
            <img className={styles.img} src={UserImg} alt="/"/>
          )}
        </div>
        <div>
          <h4 className={styles.login}>{currentUser?.login}</h4>
          <p>{currentUser?.email}</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <BiCheck onClick={handleAccept} className={styles.button} size={38} />
        {!declined && (
          <MdOutlineClose
            onClick={handleDecline}
            className={styles.button}
            size={38}
          />
        )}
      </div>
    </div>
  );
};

export default RequestItem;
