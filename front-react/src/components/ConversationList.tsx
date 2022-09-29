import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import fetchData from '../services/fetch';
import { backgroundColor, borderColor, colorIcon } from '../style/variable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoadingWrapper from './LoadingWrapper';
import { WebSocketContext } from '../services/websocket';


const ConversationList = ({setSelectedConversation}:any) => {
    const [chats,setChats] = useState([]);
    const [loading,setLoading] = useState(true)
    const chatSocket:any = useContext(WebSocketContext);


    useEffect(() => {
        getChats();
        chatSocket.onmessage = function(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'chat_message_private' || data.type == 'chat_message_group'){
                console.log("recieve message");
                getChats();
                //notification 
            }
        }
    },[]);

    const getChats = () => {
        setLoading(true)
        fetchData.getChatsPrivate().then((data1) => {
            fetchData.getChatsGroup().then((data) => {
                let temp = data1.concat(data);
                temp.sort(function(a:any,b:any){
                    return (new Date(b.last_update).getTime() - new Date(a.last_update).getTime());
                });
                setChats(temp);
            });
        });
        setLoading(false)
    }
    return (
        <Container>
            <LoadingWrapper loading={loading}>
                {chats.map((conversation:any,key) => {
                    return (
                    <Conversation key={conversation.id} onClick={(e) => {e.preventDefault();setSelectedConversation(conversation);console.log("chat selected : ",conversation)}} >
                        <ProfilImage/>
                        <Text>
                            {conversation.chat_type == 'chat_group'  ? conversation.chat_name : conversation.users.username}
                        </Text>
                        {/* <Badge>
                        </Badge> */}
                    </Conversation>);
                
                
                
                })}
            </LoadingWrapper>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${backgroundColor};
    height: 100%;
    border-right: 1px solid ${borderColor};
`;
const Conversation = styled.div`
    background-color: #111b21;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${colorIcon};
`;

const Text = styled.div`
    width: 80%;
    height: 70px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: ${colorIcon};
    border-top: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};
`;

const Badge = styled.div`
    background-color: green;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin-left: 20px;
`;

export default ConversationList;