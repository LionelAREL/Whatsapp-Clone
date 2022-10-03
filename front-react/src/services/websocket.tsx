import { createContext } from "react";
import enrionments from "../environment/environment";
let SOCKET_URL = 'ws://' + enrionments.baseUrl + "/ws/chat/";
export const WebSocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebSocketProvider = (props : any) => {

  return (
    <WebSocketContext.Provider value={props.socket}>
      {props.children}
    </WebSocketContext.Provider>
  );
};