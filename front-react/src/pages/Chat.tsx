import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Conversation from '../components/Conversation';
import ConversationList from '../components/displayers/ConversationList';
import CreateGroup from '../components/displayers/CreateGroup';
import Displayer from '../components/displayers/Displayer';
import FriendsRequest from '../components/displayers/FriendsRequest';
import NavBar from '../components/NavBar';
import SearchFriends from '../components/displayers/SearchFriends';
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
    },[chatSocket])

    React.useEffect(() => {
          //fonction callback du listener
          function setBadgeOnMessageReceive(e:any) {
              const data = JSON.parse(e.data);
              console.log(selectedConversation,data)
            if((data.type == 'chat_message_private' && (selectedConversation === null || data.chat_id !== selectedConversation?.id) && (selectedConversation === null || selectedConversation?.chat_type=="chat_private")) 
            || 
            (data.type == 'chat_message_group' && (selectedConversation === null || data.chat_group !== selectedConversation?.id) && (selectedConversation === null || selectedConversation?.chat_type=="chat_group"))
            ||
            (selectedConversation?.chat_type !== data.type && ((data.type == 'chat_message_group' && data.chat_group !== selectedConversation?.id) || (data.type == 'chat_message_private' && data.chat_id !== selectedConversation?.id)))
            ){
                setNoWatchedMessage(false);
            }
        }

        //met le badge a la convList quand on recoit un message
        chatSocket.addEventListener("message",setBadgeOnMessageReceive);

        return () => {chatSocket.removeEventListener("message",setBadgeOnMessageReceive)}
    },[selectedConversation])

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
    min-width: 350px;
    overflow: hidden !important;
    height:100vh;
    min-height: 700px;
    `;
const Container = styled.div`
    height:100vh;
    display:flex;
    flex-direction: row;
    @media(max-width: 1170px) {
        overflow-y:hidden;
    }
    @media(max-height: 700px) {
        overflow-y:scroll;
    }
`;

export default Chat;