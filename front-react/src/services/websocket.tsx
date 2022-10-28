import { createContext } from "react";
import enrionments from "../environment/environment";
let SOCKET_URL =""
if((!process.env.NODE_ENV || process.env.NODE_ENV === 'development')){
 SOCKET_URL = 'ws://' + enrionments.baseUrl + "/ws/chat/"
}
else{
  SOCKET_URL = 'wss://' + enrionments.baseUrl + "/wss/ws/chat/";
}
export const WebSocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebSocketProvider = (props : any) => {

  return (
    <WebSocketContext.Provider value={props.socket}>
      {props.children}
    </WebSocketContext.Provider>
  );
};