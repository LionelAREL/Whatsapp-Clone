import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';
import CreateGroup from '../components/CreateGroup';
import Displayer from '../components/Displayer';
import FriendsRequest from '../components/FriendsRequest';
import NavBar from '../components/NavBar';
import SearchFriends from '../components/SearchFriends';
import enrionments from '../environment/environment';
import {SOCKET_URL, WebSocketProvider} from '../services/websocket';



const Chat = () => {
    const [currentDisplaySide,setCurrentdispalySide] = useState(0);
    const [selectedConversation,setSelectedConversation] = useState<any>(null);
    const [noWatchedMessage,setNoWatchedMessage] = useState(true)
    const [chatSocket,setChatSocket] = useState(new WebSocket(SOCKET_URL));

    function setAndConnectWebsocket(){
        setChatSocket(new WebSocket(SOCKET_URL));
    }

    useEffect(() => {
        chatSocket.onopen = function(e) {
            console.log("connexion to socket")
        };
        //relancement de la connection lors de la fermeture
        chatSocket.onclose = function(e) {
            console.error('socket closed unexpectedly');
            setTimeout(function() {
                setAndConnectWebsocket();
              }, 1000);
        };

        //fonction callback du listener
        const setBadgeOnMessageReceive = (e:any) => {
            const data = JSON.parse(e.data);
            if(data.type == 'chat_message_private' || data.type == 'chat_message_group'){
                setNoWatchedMessage(false);
            }
        }

        //met le badge a la convList quand on recoit un message
        chatSocket.addEventListener("message",setBadgeOnMessageReceive);

        return () => {chatSocket.removeEventListener("message",setBadgeOnMessageReceive)}
    },[chatSocket])

    return (
        <WebSocketProvider socket={chatSocket}>
            <Container>
                <LeftSide>
                    <NavBar setCurrentdispalySide={setCurrentdispalySide} currentDisplaySide={currentDisplaySide} noWatchedMessage={noWatchedMessage}/>
                    <Displayer currentDisplaySide={currentDisplaySide} 
                    ConversationList = {<ConversationList setSelectedConversation={setSelectedConversation} setNoWatchedMessage={setNoWatchedMessage} selectedConversation={selectedConversation} currentDisplaySide={currentDisplaySide} />}
                    SearchFriends = {<SearchFriends setCurrentdispalySide={setCurrentdispalySide} />}
                    FriendsRequest = {<FriendsRequest/>}
                    CreateGroup = {<CreateGroup setCurrentdispalySide={setCurrentdispalySide}/>}
                    />    
                </LeftSide>
                <Conversation selectedConversation={selectedConversation} />
            </Container>
        </WebSocketProvider>
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