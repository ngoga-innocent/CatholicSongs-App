import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../Url";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialState = {
  musicians: [],
  musicianLoading: false,
  musician_skills:[],
  isError: false,
  errorMessage: "",
};
export const AddMusician=createAsyncThunk("AddMusician",async(kwargs,{rejectWithValue})=>{
  try {
    const token =await AsyncStorage.getItem("token")
    if (!token) {
      return rejectWithValue({ detail: "Please login to join the Community" });
    }
    const myHeaders=new Headers()
    myHeaders.append("Authorization",`Token ${token}`)
    myHeaders.append("Content-Type","application/json")
    const requestOptions={
      method:"POST",
      body:JSON.stringify(kwargs),
      headers:myHeaders
    }
    const res=await fetch(`${Url}/musician/`,requestOptions)
    const data=await res.json()
    if(!res.ok){
      return rejectWithValue(data)
    }
    return data
  } catch (error) {
    rejectWithValue({"detail":"Failed to join the Community"})
  }
})
export const FetchMusicianSkills=createAsyncThunk(
  "FetchMusicianSkills",
  async(kwargs,{rejectwithValue})=>{
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const res = await fetch(`${Url}/musician/musical_skills`, requestOptions);
      if (!res.ok) {
        return await res.json();
      }
      const result = await res.json();
      return result;
    } catch (error) {
      rejectwithValue(error.message);
    }
  }
)
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
      //Musician Skills
      builder
       .addCase(FetchMusicianSkills.pending, (state) => {
        state.musicianLoading=true
          
        })
       .addCase(FetchMusicianSkills.fulfilled, (state, action) => {
          state.musician_skills = action.payload.skills;
          state.musicianLoading=false;
        })
       .addCase(FetchMusicianSkills.rejected, (state, action) => {
          state.isError = true;
          
          state.musicianLoading=false
        });
        //Join MUSICIAN
        builder
       .addCase(AddMusician.pending, (state) => {
        state.musicianLoading=true
       })
       .addCase(AddMusician.fulfilled,(state,action)=>{
        state.musicians=[...state.musicians,action?.payload?.musician]
        state.musicianLoading=false
       })
       .addCase(AddMusician.rejected,(state)=>{
        state.musicianLoading=false
       })
  },
});

export default MusicianSlice.reducer;
