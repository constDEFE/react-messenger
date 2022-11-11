import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { UserSnapshot } from "./../models/models";
import { auth, db } from "../firebase";
import { storage } from "./../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const logout = async (uid: string): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { isOnline: false });
  await signOut(auth);
};

export const signIn = async (email: string, password: string): Promise<void> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  await updateDoc(doc(db, "users", user.uid), { isOnline: true });
};

export const signUp = async (email: string, password: string, login: string): Promise<void> => {
  const document = await getDoc(doc(db, "usernames", login));
  const exist = document.get("uid");

  if (exist) throw new FirebaseError("auth/login-already-in-use", "User with this login already exist.");

  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "usernames", login), { uid: user.uid });
  await setDoc(doc(db, "users", user.uid), {
    login,
    email,
    password,
    uid: user.uid,
    isOnline: true,
    createdAt: Timestamp.fromDate(new Date()),
    friends: [],
    requests: [],
    declined: [],
  });
};

export const getUserSnapshot = async (uid: string): Promise<UserSnapshot | null> => {
  const docSnap = await getDoc(doc(db, "users", uid));

  return docSnap.exists() ? (docSnap.data() as UserSnapshot) : null;
};

export const acceptRequest = async (user: UserSnapshot, target: UserSnapshot): Promise<void> => {
  const { requests, friends, declined } = user;
  const indexInReq = requests.indexOf(target.uid);
  const indexInDec = declined.indexOf(target.uid);
  const declinedCopy = [...declined];
  const requestsCopy = [...requests];
  const friendsCopy = [...friends];

  if (indexInDec !== -1) declinedCopy.splice(indexInDec, 1);
  if (indexInReq !== -1) requestsCopy.splice(indexInReq, 1);

  friendsCopy.push(target.uid);
  await updateDoc(doc(db, "users", user.uid), {
    requests: requestsCopy,
    friends: friendsCopy,
    declined: declinedCopy,
  });

  const { friends: targetFriends } = target;
  const targetFriendsCopy = [...targetFriends];

  targetFriendsCopy.push(user.uid);
  await updateDoc(doc(db, "users", target.uid), { friends: targetFriendsCopy });
};

export const declineRequest = async (user: UserSnapshot, targetUid: string): Promise<void> => {
  const index = user.requests.indexOf(targetUid);
  const { requests, declined } = user;
  const requestsCopy = [...requests];
  const declinedCopy = [...declined];

  requestsCopy.splice(index, 1);
  declinedCopy.splice(index, 1);

  await updateDoc(doc(db, "users", user.uid), {
    requests: requestsCopy,
    declined: declinedCopy,
  });
};

export const sendRequest = async (userUid: string, targetUid: string): Promise<void> => {
  const document = await getDoc(doc(db, "users", targetUid));
  const targetSnap = document.data() as UserSnapshot;

  const { requests, friends, declined } = targetSnap;

  if (
    requests.includes(userUid) ||
    friends.includes(userUid) ||
    declined.includes(userUid)
  ) {
    throw new Error("You've already sent a request to this user.");
  }

  const requestsCopy = [...requests];

  requestsCopy.push(userUid);
  await updateDoc(doc(db, "users", targetUid), { requests: requestsCopy });
};

export const getNewId = (firstId: string, secondId: string): string => firstId > secondId ? `${firstId + secondId}` : `${secondId + firstId}`;

export const uploadImage = async (image: File): Promise<string> => {
  const imageRef = ref(storage, `images/${new Date().getTime()} - ${image.name}`);
  const snap = await uploadBytes(imageRef, image);

  return await getDownloadURL(ref(storage, snap.ref.fullPath));
};
