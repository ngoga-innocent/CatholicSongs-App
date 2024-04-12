import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../Url";

const initialState = {
  events: [],
  trendings: [],
  eventLoading: false,
  trendingLoading: false,
  isError: false,
  erroMessage: "",
};
export const FetchEvent = createAsyncThunk(
  "FetchEvents",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myheaders = new Headers();
      myheaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myheaders,
      };
      const res = await fetch(`${Url}/advertise`, requestOptions);
      if (!res.ok) {
        return await res.json();
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const FetchTrendings = createAsyncThunk(
  "FetchTrendings",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myheaders = new Headers();
      myheaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myheaders,
      };
      const res = await fetch(`${Url}/advertise/trendings`, requestOptions);
      if (!res.ok) {
        return await res.json();
      }
      const result = await res.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const EventSlice = createSlice({
  name: "EventSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(FetchEvent.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(FetchEvent.fulfilled, (state, action) => {
        state.events = action.payload.events;
        state.eventLoading = false;
      })
      .addCase(FetchEvent.rejected, (state, action) => {
        state.isError = action.error;
        state.eventLoading = false;
      });
    builder
      .addCase(FetchTrendings.pending, (state) => {
        state.trendingLoading = true;
      })
      .addCase(FetchTrendings.fulfilled, (state, action) => {
        state.trendings = action.payload.trending;
        state.trendingLoading = false;
      })
      .addCase(FetchTrendings.rejected, (state, action) => {
        state.isError = true;
        state.erroMessage = action.payload;
      });
  },
});

export default EventSlice.reducer;
