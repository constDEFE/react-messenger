import { Timestamp } from "firebase/firestore";

export type Style = {
  [key: string]: string;
};

export interface UserSnapshot {
  login: string;
  email: string;
  uid: string;
  isOnline: boolean;
  password: string;
  createdAt: Timestamp;
  friends: string[];
  requests: string[];
  declined: string[];
  image: string;
  imagePath: string;
}

export interface Message {
  from: string;
  to: string;
  message: string;
  media: string;
  unread: boolean;
  createdAt: Timestamp;
}
