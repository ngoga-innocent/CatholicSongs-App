import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../Url";

const initialState = {
  events: [],
  trendings: [],
  eventLoading: false,
  trendingLoading: false,
  isError: false,
  erroMessage: ""
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
        headers: myheaders
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
        headers: myheaders
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
export const AddNewEvent = createAsyncThunk(
  "create an Event",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers({ "Content-Type": "application/json" });
      myHeaders.append("Content-Type", "multipart/form-data");
      const formData = new FormData();
      formData.append("title", kwargs.title);
      formData.append("description", kwargs.description);
      formData.append("location", kwargs.location);
      formData.append("date", kwargs.date);
      formData.append("thumbnail", kwargs.thumbnail[0]);
      kwargs.thumbnail.forEach((event_image) => {
        formData.append("other_image", event_image);
      });
      const body = formData;
      const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: body
      };
      const res = await fetch(`${Url}/advertise/`, requestOptions);
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      return rejectWithValue({
        details: "Failed to Create an event please try again Later"
      });
    }
  }
);
export const AddNewReleasedSong = createAsyncThunk(
  "Create new release",
  async (kwargs, { rejectWithValue }) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: JSON.stringify(kwargs)
    };
    try {
      const res = await fetch(`${Url}/advertise/trendings/`, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ details: "unexpected Error" });
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
    builder
      .addCase(AddNewEvent.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(AddNewEvent.fulfilled, (state, action) => {
        state.eventLoading = false;
      })
      .addCase(AddNewEvent.rejected, (state) => {
        state.eventLoading = false;
      });
    builder
      .addCase(AddNewReleasedSong.pending, (state) => {
        state.trendingLoading = true;
      })
      .addCase(AddNewReleasedSong.fulfilled, (state, action) => {
        state.trendings = [...state.trendings, ...action.payload.response];
        state.trendingLoading = false;
      })
      .addCase(AddNewReleasedSong.rejected, (state) => {
        state.trendingLoading = false;
      });
  }
});

export default EventSlice.reducer;
