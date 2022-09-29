import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from "react-router-dom";
import { RootState } from '../../redux/Store';
import Cookies from 'universal-cookie';
import AuthService from '../../services/authentification';
import {loading, setSession} from './../../redux/CounterSlice'
import { WebSocketProvider } from '../../services/websocket';

const ProtectedRoute = () => {
    const session = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch()
    const cookie = new Cookies();
    if(session.user != null && session.loading == false && cookie.get('sessionid')!=undefined){
        //connected
        return (
            <div>
                <WebSocketProvider>
                    <Outlet/>
                </WebSocketProvider>
            </div>
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
        <div>
            loading
        </div>
        );
    }
    else{
        //disconnected
        return(
            <div>
                you must be connected
            </div>
        )
    }
};

export default ProtectedRoute;