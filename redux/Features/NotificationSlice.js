import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../Url";

const initialState = {
  isLoading: false,
  notifications: []
};
export const GetNotifications = createAsyncThunk(
  "fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const requestOptions = {
        headers: myHeaders,
        redirect: "follow",
        method: "GET"
      };
      const res = await fetch(`${Url}/notification`, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({
        details: "failed to fetch notifications please try again"
      });
    }
  }
);
const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetNotifications.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(GetNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.isLoading = false;
      })
      .addCase(GetNotifications.rejected, (state) => {
        state.isLoading = false;
      });
  }
});
export default NotificationSlice.reducer
