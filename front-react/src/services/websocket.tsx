import { createContext, useEffect, useRef } from "react";
import enrionments from "../environment/environment";

let SOCKET_URL = 'wss://' + enrionments.baseUrl + "/wss/ws/chat/";
export const WebsocketContext = createContext(new WebSocket(SOCKET_URL));

export const WebsocketProvider = ({ children }:{children:any}) => {
  const ws:any = useRef(null);
  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    ws.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebsocketContext.Provider value={ws}>
      {children}
    </WebsocketContext.Provider>
  );
};