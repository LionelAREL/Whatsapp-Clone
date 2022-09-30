import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/Store';
import Cookies from 'universal-cookie';
import AuthService from '../../services/authentification';
import {loading, setSession} from './../../redux/CounterSlice'

export default function Root() {
    const session = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch()
    const cookie = new Cookies();
    if(session.user != null && session.loading == false && cookie.get('sessionid')!=undefined){
        //connected
        return(
          <Navigate to="/chat" />
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
      console.log("123")
        //disconnected
        return(
          <Outlet/>
        )
    }
}