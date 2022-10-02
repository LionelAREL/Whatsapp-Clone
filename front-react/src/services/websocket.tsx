import { createContext, useEffect, useRef } from "react";
import enrionments from "../environment/environment";
const SOCKET_URL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
 'ws://' + enrionments.baseUrl + "/ws/chat/" : 'wss://' + enrionments.baseUrl + "/wss/ws/chat/"  ;
export const WebSocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebSocketProvider = ({ children }:{children:any}) => {

  const socket = new WebSocket(SOCKET_URL);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};