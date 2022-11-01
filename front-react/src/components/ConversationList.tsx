import React, { useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import fetchData from '../services/fetch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoadingWrapper from './LoadingWrapper';
import { WebSocketContext } from '../services/websocket';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { checkPinMessageNavbar, isSelectedChat } from '../utils/utils';


const ConversationList = ({setSelectedConversation,setNoWatchedMessage,selectedConversation,currentDisplaySide}:any) => {
    const [chats,setChats] = useState([]);
    const [loading,setLoading] = useState(true)
    const chatSocket:any = useContext(WebSocketContext);
    const session = useSelector((state: RootState) => state.session)
    const theme:any = useTheme();
    useEffect(() => {
        getChats();
        function refreshOnMessage(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'chat_message_private' || data.type == 'chat_message_group'){
                console.log("ConvList recieve message");
                getChats();
            }
            if(data.type == "watched_message_group" || data.type == "watched_message_private"){
                console.log("ConvList recieve watched message");
                getChats();
            }
        }
        chatSocket.addEventListener("message",refreshOnMessage);

        return () => chatSocket.removeEventListener("message",refreshOnMessage)

    },[]);

    useEffect(() => {
        function refreshConvOnClick(e:any) {
            const data = JSON.parse(e.data);
            if((data.type == 'chat_message_private' && data.chat_id == selectedConversation?.id && selectedConversation?.chat_type=="chat_private") 
            || 
            (data.type == 'chat_message_group' && data.chat_group == selectedConversation?.id && selectedConversation?.chat_type=="chat_group")){
                clickConversation(null,selectedConversation);
                getChats();
            }
        }
        chatSocket.addEventListener("message",refreshConvOnClick)
        return () => chatSocket.removeEventListener("message",refreshConvOnClick)
    },[selectedConversation]);


    function getChats(){
        if(currentDisplaySide == 0){
            setLoading(true)
            fetchData.getChatsPrivate().then((data1) => {
                fetchData.getChatsGroup().then((data) => {
                    let temp = data1.concat(data);
                    temp.sort(function(a:any,b:any){
                        return (new Date(b.last_update).getTime() - new Date(a.last_update).getTime());
                    });
                    setChats(temp);
                    setNoWatchedMessage(checkPinMessageNavbar(temp));
                });
            });
            setLoading(false)
        }
    }

    function clickConversation(e:any,conversation:any){
        e?.preventDefault();
        //set view message
         if(conversation.chat_type == 'chat_private'){
                  //send watched message
            let user_to = conversation.users.id;
            let user_from = session.user.id
            console.log(`message private watched from ${user_from} to ${user_to}`)
            chatSocket.send(JSON.stringify({
                'type': 'watched_message_private',
                'user_from' : user_to,
                'user_to' : user_from,
            }));
            console.log("msg envoyé")
          }
          if(conversation.chat_type == 'chat_group'){
                //send watched message
                let chat_id = conversation.id;
                let user_from = session.user.id
                console.log(`message group watched from ${user_from} to ${chat_id}`)
                chatSocket.send(JSON.stringify({
                    'type': 'watched_message_group',
                    'user_from' : user_from,
                    'chat_group' : chat_id,
                }));
                console.log("msg envoyé")
            }   
    }

    return (
        <Container>
            <LoadingWrapper loading={loading}>
                {chats.map((conversation:any,key) => {
                    return (
                    <Conversation style={{background:isSelectedChat(conversation,selectedConversation) ? theme.colorConvSelected : theme.backgroundColor2 }} key={conversation.id} onClick={(e) => {clickConversation(e,conversation);setSelectedConversation(conversation);}} >
                        <ProfilImage/>
                        <Text>
                            {conversation.chat_type == 'chat_group'  ? conversation.chat_name : conversation.users.username}
                        </Text>
                        <Badge hidden={conversation.watched}>
                        </Badge> 
                    </Conversation>);
                
                
                
                })}
            </LoadingWrapper>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.backgroundColor};
    height: calc(100vh - 56px);
    min-height: 700px;
    overflow: scroll;
    border-right: 1px solid ${(props) => props.theme.borderColor};
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    overflow-y: scroll;
    ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
}
`;
const Conversation = styled.div`
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${(props) => props.theme.colorProfilDefault};
`;

const Text = styled.div`
    width: 80%;
    height: 70px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colorIcon};
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const Badge = styled.div`
    background-color: ${(props) => props.theme.dotColorNotification};
    position:relative;
    border-radius: 50%;
    height: 15px;
    width: 15px;
    right:20px;
`;

export default ConversationList;