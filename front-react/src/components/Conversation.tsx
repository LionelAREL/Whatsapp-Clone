import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { backgroundColor, colorIcon, profilHeaderSize } from '../style/variable';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import Message from './Message';
import background from './../assets/email-pattern.webp'
import fetchData from '../services/fetch';
import { WebSocketContext } from '../services/websocket';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const Conversation = ({selectedConversation}:any) => {
    const [messages,setMessages] = useState([]);
    //gestion des messages lus
    const chatSocket = useContext(WebSocketContext)
    const session = useSelector((state: RootState) => state.session)

    function getMessage(){
        if (selectedConversation != null){
            if(selectedConversation.chat_type == "chat_private"){
                fetchData.getMessagesPrivate(selectedConversation.id,1).then(data => {setMessages(data.results);console.log(data.results)})
            }
            else{
                fetchData.getMessagesGroup(selectedConversation.id,1).then(data => {setMessages(data.results);console.log(data.results)})
            }
        }
    }

    async function sendMessage () {
        const messageInputDom = document.querySelector('#send');
        const message:any = (messageInputDom as any).value;
        const user_from = session.user.id
        console.log(session.user.id)
        console.log(selectedConversation)
        if(selectedConversation.chat_type == 'chat_private'){
            let user_to:any = selectedConversation.users.id 
            console.log(`message private from ${user_from} to user ${user_to} with message : ${message}`)
            chatSocket.send(JSON.stringify({
                'type': 'chat_message_private',
                'user_from' : user_from,
                'user_to' : user_to,
                'message': message,
            }));
            (messageInputDom as any).value = '';
            console.log("msg envoyé")
        }
        else{
            let chat_group = selectedConversation.id
            console.log(`message group from ${user_from} to chat ${chat_group} with message : ${message}`)
            chatSocket.send(JSON.stringify({
                'type': 'chat_message_group',
                'user_from' : user_from,
                'chat_group' : chat_group,
                'message': message,
            }));
            (messageInputDom as any).value = '';
            console.log("msg envoyé")
        }
        getMessage();
    };



    useEffect(() => {
        getMessage();
        
    },[selectedConversation])

    useEffect(() => {
        chatSocket.onmessage = function(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'chat_message_private' || data.type == 'chat_message_group'){
                console.log("recieve message");
                getMessage();
            }
        }
    });


    return (
        <Container>
            <Header>
                <LeftHeader>
                    <IconClick>
                        <ProfilImage/>
                    </IconClick>
                    <IconClick>
                        <Name>
                            name
                        </Name>
                    </IconClick>
                </LeftHeader>
                <RightHeader>
                    <IconClick>
                        <Search/>
                    </IconClick>
                    <IconClick>
                        <Options/>
                    </IconClick>
                </RightHeader>
            </Header>
            <Chat>
            {messages.map((message:any,key) => {return <Message key={key} message={message} />})}
            </Chat>
            <InputContainer>
                <IconClick>
                    <Smiley/>
                </IconClick>
                <IconClick>
                    <Clip/>
                </IconClick>
                    <Input id='send' onKeyDown={(e) =>e.key === 'Enter' ? sendMessage() : ""}/>
                <IconClick>
                    <Micro/>
                </IconClick>
            </InputContainer>
        </Container>
    );
};
const iconInputMessageSize = "80px"; 

const Container = styled.div`
    width:70vw;
    height:100vh
`;
const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${backgroundColor};
    border-left: 1px #303d45 solid;
`;
const Name = styled.div`
    color:${colorIcon};
`;
const LeftHeader = styled.div``
const RightHeader = styled.div``
const ProfilImage = styled(AccountCircleIcon)`
    color:${colorIcon};
    width: ${profilHeaderSize} !important;
    height:${profilHeaderSize} !important;
`;
const IconClick = styled(IconButton)`
    margin:0 4px !important;
`;
const Search = styled(SearchIcon)`
    color:${colorIcon};
`;
const Options = styled(MoreVertIcon)`
    color:${colorIcon};
`;
const Chat = styled.div`
    padding: 20px;
    min-height: 90%;
    background:repeat url(${background})
`
const InputContainer = styled.div`
    background-color:${backgroundColor};
    height:70px;
    width:70vw;
    position:absolute;
    bottom:0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;
const Micro = styled(MicIcon)`
    width: ${iconInputMessageSize};
    color:${colorIcon};
`;
const Smiley = styled(TagFacesIcon)`
    width: ${iconInputMessageSize};
    color:${colorIcon};
`;
const Clip = styled(AttachFileIcon)`
    width: ${iconInputMessageSize};
    color:${colorIcon};
`;
const Input = styled.input`
    color:${colorIcon};
    width:85%;
    height:30px;
    border-radius:5px;
    background-color: #2a3942;
    border:none;
    text-decoration: none !important;
`;
export default Conversation;