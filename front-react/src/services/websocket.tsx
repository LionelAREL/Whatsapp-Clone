import { createContext } from "react";
import enrionments from "../environment/environment";
export const SOCKET_URL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
 'ws://' + enrionments.baseUrl + "/ws/chat/" : 'wss://' + enrionments.baseUrl + "/wss/ws/chat/";
export const WebSocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebSocketProvider = (props : any) => {

  return (
    <WebSocketContext.Provider value={props.socket}>
      {props.children}
    </WebSocketContext.Provider>
  );
};