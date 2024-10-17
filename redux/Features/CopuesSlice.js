import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue
} from "@reduxjs/toolkit";
import { Url } from "../../Url";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  copyLoading: false,
  copies: [],
  isError: false,
  message: "",
  copiesType: [],
  songCategories: []
};
export const UploadSong = createAsyncThunk(
  "Copies/UploadSong",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return rejectWithValue({ detail: "Please login to upload a New Song" });
    }

    // Initialize FormData
    const formData = new FormData();
    formData.append("name", kwargs?.song_name);
    formData.append("composer", kwargs?.song_composer);
    formData.append("part", kwargs?.choosenPart?.id);
    formData.append("category", kwargs?.chooseCategory?.id);

    // Append the PDF document
    formData.append("document", {
      name: kwargs?.selectedPdf?.name,
      uri: kwargs?.selectedPdf?.uri,
      type: "application/pdf"
    });

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);  // Only append Authorization header
    console.log(myHeaders)
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: myHeaders,  // No need to set Content-Type
      redirect: "follow"
    };
    
    try {
      const res = await fetch(`${Url}/documents/`, requestOptions);
      const data = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        detail: "Failed to upload new Song, please try again or contact support"
      });
    }
  }
);


export const FetchCopiesType = createAsyncThunk(
  "fetch/Type",
  async (kwargs, { rejectWithValue }) => {
    const res = await fetch(`${Url}/documents/Gettypes/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow"
    });
    if (!res.ok) {
      const errData = await res.json();
      return rejectWithValue({
        message: errData || "Failed to Get Copies"
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
      redirect: "follow"
    });
    if (!res.ok) {
      const errData = await res.json();

      return rejectWithValue({
        message: errData || "Failed to Get Copies"
      });
    }
    return await res.json();
  }
);
//Fetch SONG Category
export const SongCategory = createAsyncThunk(
  "Fetch/SongCategories",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
      const url = kwargs?.category_id
        ? `${Url}/documents/song_category?category_id=${kwargs.category_id}`
        : `${Url}/documents/song_category`;
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      // console.log(data);
      if (!res.ok) {
        return rejectWithValue(data.detail);
      }
      return data;
    } catch (error) {
      // console.log(error)
      return rejectWithValue(error);
    }
  }
);
//Get Songs By category
export const GetSong = createAsyncThunk(
  "Fetch/GetSongs",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
      let url = `${Url}/documents/song_category?`;

      if (kwargs?.category_id) {
        url += `category_id=${kwargs.category_id}&`;
      }

      if (kwargs?.page) {
        url += `page=${kwargs.page}&`;
      }
      if (kwargs?.season) {
        url += `season=${kwargs.season}&`;
      }
      // const url = kwargs?.category_id
      // && `${Url}/documents/song_category?category_id=${kwargs.category_id}`
      url =
        url.slice(-1) === "&" || url.slice(-1) === "?" ? url.slice(0, -1) : url;
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      // console.log(data);
      if (!res.ok) {
        return rejectWithValue(data.detail);
      }
      return data;
    } catch (error) {
      // console.log(error)
      return rejectWithValue(error);
    }
  }
);
//Search Songs
export const SearchSong = createAsyncThunk(
  "Fetch/SearchSong",
  async (kwargs, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
      const url = `${Url}/documents/search_song?q=${kwargs.search}`;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      console.log("search dispathced", data);
      if (!res.ok) {
        return rejectWithValue(data.detail);
      }
      if (data.songs.length < 1) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      // console.log(error)
      return rejectWithValue(error);
    }
  }
);
const CopiesSlice = createSlice({
  name: "CopiesSlice",
  initialState,
  reducers: {
    // Action to clear songs
    clearSongs: (state) => {
      state.copies = [];
    }
  },
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
      // console.log(action.payload);
    });

    //Getting Song Categories
    builder.addCase(SongCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(SongCategory.fulfilled, (state, action) => {
      state.songCategories = action.payload;
      state.isLoading = false;
    });
    builder.addCase(SongCategory.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    //Getting Song of Category
    builder.addCase(GetSong.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetSong.fulfilled, (state, action) => {
      state.copies = action.payload;
      state.isLoading = false;
    });
    builder.addCase(GetSong.rejected, (state, action) => {
      state.isError = action.payload.message;
      // console.log(action.payload);
    });
    //Search Songs
    builder.addCase(SearchSong.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(SearchSong.fulfilled, (state, action) => {
      state.copies = action.payload;
      state.isLoading = false;
    });
    builder.addCase(SearchSong.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      // console.log(action.payload);
    });
    // Upload Song
    builder.addCase(UploadSong.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(UploadSong.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(UploadSong.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      console.log(action.payload);
    });
  }
});
export const { clearSongs } = CopiesSlice.actions;

export default CopiesSlice.reducer;
