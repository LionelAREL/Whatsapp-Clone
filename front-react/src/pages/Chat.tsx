import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Conversation from '../components/Conversation';
import Displayer from '../components/Displayer';
import NavBar from '../components/NavBar';
import enrionments from '../environment/environment';
import { WebsocketContext } from '../services/websocket';
import { isSelectedChat } from '../utils/compareUtils';



const Chat = () => {
    const [currentDisplaySide,setCurrentdispalySide] = useState(0);
    const [selectedConversation,setSelectedConversation] = useState<any>(null);
    const [noWatchedMessage,setNoWatchMessage] = useState<any>([])//[{type,to}]
    const chatSocket = useContext(WebsocketContext);

    useEffect(() => {
        chatSocket.onopen = function(e) {
            console.log("connexion to socket")
        };

        chatSocket.onclose = function(e) {
            console.error('socket closed unexpectedly');
        };

    },[])

        //gestion des messages recus par le websocket
        //Websocket
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log("onmessage",data);
            console.log(data.type)
        };

    return (
        <Container>
            <LeftSide>
                <NavBar setCurrentdispalySide={setCurrentdispalySide} />
                <Displayer currentDisplaySide={currentDisplaySide} />    
            </LeftSide>
            <Conversation/>
        </Container>
    );
};

const LeftSide = styled.div`
    height:100vh;
`;
const Container = styled.div`
    display:flex;
    flex-direction: row;
`;

export default Chat;