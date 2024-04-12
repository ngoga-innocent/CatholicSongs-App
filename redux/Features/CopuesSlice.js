import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { Url } from "../../Url";

const initialState = {
  copyLoading: false,
  copies: [],
  isError: false,
  message: "",
  copiesType: [],
};

export const FetchCopiesType = createAsyncThunk(
  "fetch/Type",
  async (kwargs, { rejectWithValue }) => {
    const res = await fetch(`${Url}/documents/Gettypes/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    });
    if (!res.ok) {
      const errData = await res.json();
      return rejectWithValue({
        message: errData || "Failed to Get Copies",
      });
    }
    const final = await res.json();
    return final;
  }
);
export const FetchCopies = createAsyncThunk(
  "Fetch/Copies",
  async (kwargs, { rejectWithValue }) => {
    const res = await fetch(`${Url}/documents`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    });
    if (!res.ok) {
      const errData = await res.json();

      return rejectWithValue({
        message: errData || "Failed to Get Copies",
      });
    }
    return await res.json();
  }
);
const CopiesSlice = createSlice({
  name: "CopiesSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FetchCopiesType.pending, (state) => {
      state.copyLoading = true;
    });
    builder.addCase(FetchCopiesType.fulfilled, (state, action) => {
      state.copiesType = action.payload;
      state.copyLoading = false;
    });
    builder.addCase(FetchCopiesType.rejected, (state, action) => {
      state.isError = true;
      state.message = action.payload.message;
    });

    //Getting Copiesss

    builder.addCase(FetchCopies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(FetchCopies.fulfilled, (state, action) => {
      state.copies = action.payload;
      state.isLoading = false;
    });
    builder.addCase(FetchCopies.rejected, (state, action) => {
      state.isError = action.payload.message;
      console.log(action.payload);
    });
  },
});

export default CopiesSlice.reducer;
