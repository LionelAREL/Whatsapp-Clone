import React, { useState } from 'react';
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

const Conversation = () => {
    const [messages,setMessages] = useState([]);
    //gestion des messages lus
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
            {messages.map((message,index) => <Message key={index} message={message} />)}
            </Chat>
            <InputContainer>
                <IconClick>
                    <Smiley/>
                </IconClick>
                <IconClick>
                    <Clip/>
                </IconClick>
                    <Input/>
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