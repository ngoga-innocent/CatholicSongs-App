import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../Url";
const initialState = {
  musicians: [],
  musicianLoading: false,
  isError: false,
  errorMessage: "",
};

export const FetchMusician = createAsyncThunk(
  "FetchMusician",
  async (kwargs, { rejectwithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const res = await fetch(`${Url}/musician`, requestOptions);
      if (!res.ok) {
        return await res.json();
      }
      const result = await res.json();
      return result;
    } catch (error) {
      rejectwithValue(error.message);
    }
  }
);
const MusicianSlice = createSlice({
  name: "Musician",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(FetchMusician.pending, (state) => {
        state.musicianLoading = true;
      })
      .addCase(FetchMusician.fulfilled, (state, action) => {
        state.musicians = action.payload.musician;
        state.musicianLoading = false;
      })
      .addCase(FetchMusician.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload.detail;
      });
  },
});

export default MusicianSlice.reducer;
