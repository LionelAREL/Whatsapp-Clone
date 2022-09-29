import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';
import CreateGroup from '../components/CreateGroup';
import Displayer from '../components/Displayer';
import FriendsRequest from '../components/FriendsRequest';
import NavBar from '../components/NavBar';
import SearchFriends from '../components/SearchFriends';
import { WebSocketContext } from '../services/websocket';



const Chat = () => {
    const [currentDisplaySide,setCurrentdispalySide] = useState(0);
    const [selectedConversation,setSelectedConversation] = useState<any>(null);
    const [noWatchedMessage,setNoWatchMessage] = useState<any>([])//[{type,to}]
    const chatSocket = useContext(WebSocketContext);

    useEffect(() => {
        chatSocket.onopen = function(e) {
            console.log("connexion to socket")
        };

        chatSocket.onclose = function(e) {
            console.error('socket closed unexpectedly');
        };
        chatSocket.onmessage = function(e:any) {
            const data = JSON.parse(e.data);
            console.log("onmessage",data);
        }

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
                <Displayer currentDisplaySide={currentDisplaySide} 
                ConversationList = {<ConversationList setSelectedConversation={setSelectedConversation} />}
                SearchFriends = {<SearchFriends setCurrentdispalySide={setCurrentdispalySide} />}
                FriendsRequest = {<FriendsRequest/>}
                CreateGroup = {<CreateGroup setCurrentdispalySide={setCurrentdispalySide}/>}
                />    
            </LeftSide>
            <Conversation selectedConversation={selectedConversation} />
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