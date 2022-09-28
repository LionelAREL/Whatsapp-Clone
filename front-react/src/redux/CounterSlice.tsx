import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import fetchData from '../services/fetch'
import AuthService from '../services/authentification'

export interface Session {
  user: {pseudo?:string,id?:string}|null,
  loading:boolean
}

const initialState: Session = {
    user: null,
    loading:false
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
    }
  },
})

// Action creators are generated for each case reducer function

export const {logoutSession, setSession, loading} = sessionSlice.actions

export default sessionSlice;