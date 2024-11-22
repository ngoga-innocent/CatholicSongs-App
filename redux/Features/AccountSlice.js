import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import { Url } from "../../Url";

import AsyncStorage from "@react-native-async-storage/async-storage";
const initialState = {
  User: {},
  isLoading: false,
  isError: false,
  isLogged: false,
  RegisterStatus: false,
  message: "",
  token: "",
};
export const Register = createAsyncThunk(
  "user/Register",
  async (userData, { rejectWithValue }) => {
    // console.log(userData);
    const formData = new FormData();
    formData.append("username", userData?.username);
    formData.append("email", userData?.email);
    formData.append("password", userData?.password);
    formData.append("phone_number",userData?.phone_number)
    userData?.profile &&formData.append("profile", userData.profile);
    const res = await fetch(`${Url}/account/Register`, {
      method: "POST",
      body: formData,
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    if (!res.ok) {
      const errData = await res.json();
      console.log(errData);
      return rejectWithValue({
        isError: true,
        message:
          errData.error.username ||
          "Error during Registration Please try again",
      });
    }
    const final = await res.json();
    return final;
  }
);
export const LoginFunction = createAsyncThunk(
  "user/Login",
  async (userData, { rejectWithValue }) => {
    console.log(userData);
    const res = await fetch(`${Url}/account/Login`, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errData = await res.json();
      // console.log(errData)
      return rejectWithValue({
        message: errData.detail,
        isError: true,
        status: errData.status,
      });
    }
    const final = await res.json();
    await AsyncStorage.setItem("token", final.token);
    return final;
  }
);
export const verifyToken = createAsyncThunk(
  "Account/verifyToken",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${Url}/account/TokenVerification`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok){
      return rejectWithValue(result?.detail || "Failed to verify the token");
    }
    return result;
  }
);
export const setToken = createAction("account/setToken", (token) => ({
  payload: token,
}));
export const Logout = createAction("account/logout");
const AccountSlice = createSlice(
  {
    name: "Account",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(Register.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(Register.fulfilled, (state, actions) => {
        state.isLoading = false;
        // state.user = actions.payload
        state.RegisterStatus = true;
        // console.log(state.user)
      });
      builder.addCase(Register.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload.message;
        console.log(action.payload.message);
        state.isLoading = false;
      });
      builder.addCase(LoginFunction.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(LoginFunction.fulfilled, (state, action) => {
        state.User = action.payload;
        state.isLoading = false;
        state.isLogged = true;
        console.log(action.payload);
        //await AsyncStorage.setItem("token",action.payload.token)
      });
      builder.addCase(LoginFunction.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload.message;
        state.isLoading = false;
        // console.log(action.payload);
      });
      builder.addCase(setToken, (state, action) => {
        state.token = action.payload;
      });
      builder.addCase(Logout, (state) => {
        state.isLogged = false;
        state.token = "";
        state.User = null;
      });
      builder.addCase(verifyToken.pending,(state)=>{
        console.log("pending Token Verification")
      }).addCase(verifyToken.fulfilled,(state,action)=>{
        console.log("Token Veriication payload",action)
      }).addCase(verifyToken.rejected,(state,action)=>{
        console.log(action.payload)
      })
    },
  }
  // reducers: {
  //     register: (state,action) => {
  //         const user = {
  //             id: nanoid(),
  //             name: action.payload.name,
  //             email: action.payload.email,
  //             password:action.payload.password

  //         }
  //         console.log(action.payload)
  //         state.user.push(user)
  //     }
  // }
);

// export const { register } = AccountSlice.actions
export default AccountSlice.reducer;
