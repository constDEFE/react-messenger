import React, { ChangeEvent, useEffect, useState } from "react";
import { deleteField, updateDoc, doc } from "firebase/firestore";
import { getUserSnapshot } from "../utils/functions";
import { setUserSnapshot } from "../redux/slices/userSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { storage, db } from "../firebase";
import DeclinedList from "../components/Lists/DeclinedList";
import RequestsList from "../components/Lists/RequestsList";
import { HiCamera } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { Style } from "../models/models";
import Loading from "../components/Loading";
import UserImg from "../assets/user-128.svg";
import {
  deleteObject,
  getDownloadURL,
  uploadBytes,
  ref,
} from "firebase/storage";

const styles: Style = {
  section: "h-full flex justify-center pt-60",
  container: "flex flex-col gap-6",
  userCard: "rounded-div w-full flex gap-4 items-center w-[480px]",
  lists: "flex flex-col gap-4",
  imgWrapper: "relative",
  imgCross: "absolute z-10 top-2 right-2 text-slate-100 hover:text-slate-400 duration-100 ease-out",
  hidden: "hidden",
  imgContainer: "bg-[#050505] select-none min-h-[128px] min-w-[128px] relative rounded-full shadow-lg shadow-[#0c0c0c]",
  imgOverlay: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-70 duration-200 ease-out w-full h-full bg-black rounded-full",
  img: "rounded-full w-[128px] h-[128px]",
  inputOverlay: "rounded-full h-full w-full",
  label: "cursor-pointer rounded-full flex justify-center items-center w-full h-full",
  input: "hidden w-full h-full",
  textContainer: "w-full",
  userName: "text-3xl font-semibold",
  email: "text-xl font-medium",
  divider: "my-2 h-[3px] bg-slate-300 rounded-full",
  joined: "text-sm",
  loadingContainer: "loading-container",
  loading: "loading",
};

const Profile = () => {
  const [image, setImage] = useState<File | null>(null);
  const { userSnap, isLoading } = useAppSelector((state) => state.user);

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setImage(target.files ? target.files[0] : null);
  };

  const removeImage = async (): Promise<void> => {
    if (userSnap) {
      try {
        await deleteObject(ref(storage, userSnap.imagePath));
        await updateDoc(doc(db, "users", userSnap.uid), {
          image: deleteField(),
          imagePath: deleteField(),
        });
        const newUserSnap = await getUserSnapshot(userSnap.uid);

        setUserSnapshot(newUserSnap);
      } catch (error: any) {
        alert("failed to remove image.");
      }
    }
  };

  useEffect(() => {
    if (userSnap && image) {
      const updateImage = async (): Promise<void> => {
        try {
          if (userSnap.image) deleteObject(ref(storage, userSnap.imagePath));

          const imageRef = ref(storage, `profile/${new Date().getTime()} - ${image.name}`);
          const imageSnap = await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(ref(storage, imageSnap.ref.fullPath));

          await updateDoc(doc(db, "users", userSnap.uid), {
            image: imageUrl,
            imagePath: imageSnap.ref.fullPath,
          });
        } catch (error: any) {
          alert("Failed to update image");
        }
      };

      updateImage();
    }
  }, [image]);

  return isLoading ? (
    <Loading />
  ) : (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.userCard}>
          <div className={styles.imgWrapper}>
            {userSnap?.image && (
              <ImCross
                className={styles.imgCross}
                size={22}
                onClick={removeImage}
              />
            )}
            <div className={styles.imgContainer}>
              <img
                className={styles.img}
                src={userSnap?.image || UserImg}
                alt="/"
              />
              <div className={styles.imgOverlay}>
                <div className={styles.inputOverlay}>
                  <label className={styles.label} htmlFor="photo">
                    <HiCamera size={40} />
                  </label>
                  <input
                    type="file"
                    onChange={selectImage}
                    accept="image/*"
                    className={styles.input}
                    id="photo"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.userName}>{userSnap?.login}</h2>
            <p className={styles.email}>{userSnap?.email}</p>
            <hr className={styles.divider} />
            {userSnap && (
              <p className={styles.joined}>
                Joined on: {userSnap.createdAt.toDate().toDateString()}
              </p>
            )}
          </div>
        </div>
        {userSnap && (
          <div className={styles.lists}>
            <RequestsList data={userSnap.requests} />
            <DeclinedList data={userSnap.declined} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
