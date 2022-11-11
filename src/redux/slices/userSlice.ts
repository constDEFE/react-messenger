import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSnapshot } from "../../models/models";
import { User } from "firebase/auth";

interface UserState {
  user: User | null;
  userSnap: UserSnapshot | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  userSnap: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUserSnapshot: (state, action: PayloadAction<UserSnapshot | null>) => {
      state.userSnap = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setUserSnapshot, setLoading } = userSlice.actions;
export default userSlice.reducer;
