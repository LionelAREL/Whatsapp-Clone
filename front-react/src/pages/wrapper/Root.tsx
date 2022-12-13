import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/Store';
import Cookies from 'universal-cookie';
import AuthService from '../../services/authentification';
import {loading, setSession} from './../../redux/CounterSlice'
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function Root() {
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()
  const cookie = new Cookies();

  if(session.user != null && session.loading == false && cookie.get('sessionid')!=undefined){
      //connected
      console.log("root connected")
      return(
        <Navigate to="/chat" replace={false} />
      );
  }
  else if(session.loading == true || (cookie.get('sessionid')!=undefined && session.loading==false)){
      //chargement des données
      if(session.loading==false){
          // initialize loading 
          dispatch(loading())
          AuthService.getSession().then(session => {dispatch(setSession(session.user))})
          console.log(session)
      }
      return (
      <Container>
        <CircularProgress color="success" />
      </Container>
      );
  }
  else{
      //disconnected
      return(
        <Outlet/>
      )
  }
}

const Container = styled.div`
  display:grid;
  place-items: center;
  height: 100vh;
`