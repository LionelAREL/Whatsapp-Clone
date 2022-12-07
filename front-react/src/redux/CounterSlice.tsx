import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import fetchData from '../services/fetch'
import AuthService from '../services/authentification'

export interface Session {
  user: any,
  loading:boolean,
  isDark:boolean,
  isCalling:boolean
}

const initialState: Session = {
    user: null,
    loading:false,
    isDark:true,
    isCalling:false,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    logoutSession:(state) => {
      state.user = null;
      state.loading = false;
    },
    setSession:(state,action: PayloadAction<any>) => {
        state.user = action.payload;
        state.loading = false;
    },
    loading:(state) => {
        state.loading = true;
    },
    setDark:(state,action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    setIsCalling:(state,action: PayloadAction<boolean>) => {
      state.isCalling = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function

export const {logoutSession, setSession, loading, setDark, setIsCalling } = sessionSlice.actions

export default sessionSlice;