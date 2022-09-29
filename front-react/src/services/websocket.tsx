import { createContext, useEffect, useRef } from "react";
import enrionments from "../environment/environment";

let SOCKET_URL = 'ws://' + enrionments.baseUrl + "/ws/chat/";
export const WebSocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebSocketProvider = ({ children }:{children:any}) => {

  const socket = new WebSocket(SOCKET_URL);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};