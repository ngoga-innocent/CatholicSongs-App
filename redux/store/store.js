import { configureStore } from "@reduxjs/toolkit";
import AccountReducer from "../Features/AccountSlice";
import CopuesSlice from "../Features/CopuesSlice";
import EventSlice from "../Features/EventSlice";
import MusicianSlice from "../Features/MusicianSlice";
import NotificationSlice from "../Features/NotificationSlice";

export const store = configureStore({
  reducer: {
    Account: AccountReducer,
    Copies: CopuesSlice,
    Events: EventSlice,
    Musicians: MusicianSlice,
    Notifications:NotificationSlice
  },
});
