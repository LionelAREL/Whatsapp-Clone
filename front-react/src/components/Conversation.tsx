import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import Message from './Message';
import backgroundDark from './../assets/bg-light.png'
import backgroundLight from './../assets/background.png'
import fetchData from '../services/fetch';
import { WebSocketContext } from '../services/websocket';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import VideoCalling from './VideoCalling';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import { ClientConfig, createClient } from 'agora-rtc-react';
import AWS from "aws-sdk";



const Conversation = ({selectedConversation}:any) => {
    const [messages,setMessages] = useState([]);
    const [config,setConfig] = useState({token:"",appId:"d2160e16d6634613aba0588ea88fc4d8",callingType:""})
    const chatSocket = useContext(WebSocketContext)
    const session = useSelector((state: RootState) => state.session)

    const useClient = createClient({mode: "rtc",codec: "vp8"} as ClientConfig);
    const client = useClient();

    const [file, setFile] = useState<any>(undefined);

    const S3_BUCKET ='whatsapp-clone-bucket-files';
    const REGION ='eu-west-3';
    const ACCESS_KEY ='AKIA2LKTDJEARTZNKV56';
    const SECRET_ACCESS_KEY ='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';

    const awsConfig = {
        bucketName: S3_BUCKET,
        region: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
    }

    AWS.config.update({
        region: awsConfig.region,
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
      });
      
      const s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        params: { Bucket: S3_BUCKET }
      });

      function uploadFile() {
        if (!file) {
          return new Promise((resolve, reject) => {
            resolve(file)
          });
        }

        var fileName = Date.now().toString() + "-" + file.image_url.name;
        var folderKey = encodeURIComponent(session.user.id) + "/";
      
        var fileKey = folderKey + fileName;
        console.log(file)
        // Use S3 ManagedUpload class as it supports multipart uploads
        var upload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: awsConfig.bucketName,
            Key: fileKey,
            Body: file.image_url,
            ContentType:file.image_url.type
          }
        });
      
        return upload.promise();
      }
    

    function scrollToBottom(){
        let scroll_to_bottom:any = document.getElementById('scroll');
		scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    }

    function getMessage(){
        console.log("selected conv : " ,selectedConversation)
        if (selectedConversation != null){
            if(selectedConversation.chat_type == "chat_private"){
                fetchData.getMessagesPrivate(selectedConversation.id,1).then(data => {setMessages(data.results);})
            }
            else{
                fetchData.getMessagesGroup(selectedConversation.id,1).then(data => {setMessages(data.results);})
            }
        }
    }
    
    function sendMessage () {
        uploadFile().then((data:any) => {
            console.log("NIIIIICE SEND WiTH WEBSOCKET", data,data.Location)

            const messageInputDom = document.querySelector('#send');
            const message:any = (messageInputDom as any).value;
            const user_from = session.user.id
            if(selectedConversation.chat_type == 'chat_private'){
                    let user_to:any = selectedConversation.users.id 
                    console.log(`message private from ${user_from} to user ${user_to} with message : ${message}`)
            chatSocket.send(JSON.stringify({
                    'type': 'chat_message_private',
                    'user_from' : user_from,
                    'user_to' : user_to,
                    'message': message,
                    'format': file ? "FL" : "DM",
                    'file' : data.Location,
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
                    'format': file ? "FL" : "DM",
                    'file' : data.Location,
                }));
                (messageInputDom as any).value = '';
                console.log("msg envoyé")
            }
            
            setFile(undefined)
        });
    };
    
    useEffect(() => {
        getMessage();
        scrollToBottom();
    },[selectedConversation])
    
    useEffect(() => {
        function refreshConvListOnMessageReceive(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'chat_message_private' || data.type == 'chat_message_group' || data.type == 'watched_message_private' || data.type == 'watched_message_group'){
                console.log("recieve message from Conv");
                getMessage();
            }
        }
        chatSocket.addEventListener("message",refreshConvListOnMessageReceive)
        
        return () => chatSocket.removeEventListener("message",refreshConvListOnMessageReceive)
    },[selectedConversation]);
    
    useEffect(() => {
        scrollToBottom();
    },[messages]);
    
    function handleCall(callingType="video"){
        const user_from = session.user.id
        if(selectedConversation.chat_type == 'chat_private'){
            let user_to:any = selectedConversation.users.id 
            console.log(`message private from ${user_from} to user ${user_to} for calling`)
            chatSocket.send(JSON.stringify({
                'type': 'chat_calling_private',
                'user_from' : user_from,
                'user_to' : user_to,
                'message': callingType,
            }));
            console.log("msg envoyé")
        }
        else{
            let chat_group = selectedConversation.id
            console.log(`message group from ${user_from} to chat ${chat_group} for calling`)
            chatSocket.send(JSON.stringify({
                'type': 'chat_calling_group',
                'user_from' : user_from,
                'chat_group' : chat_group,
                'message': callingType,
            }));
            console.log("msg envoyé")
        }
    }
    
    const handleFileChange = (e:any) => {
        let newData = { ...file };
        newData["image_url"] = e.target.files[0];
        setFile(newData);
    };

    return (
        <Container>
            { session.isCalling ?<CallContainer> <VideoCalling client={client} config={config} ></VideoCalling> </CallContainer> : null }
            <Header>
                <LeftHeader>
                    <IconClick>
                        <ProfilImage/>
                    </IconClick>
                    <IconClick>
                        <Name>
                            <div>{selectedConversation?.users.username}{selectedConversation?.chat_name}</div>
                        </Name>
                    </IconClick>
                </LeftHeader>
                <RightHeader>
                {selectedConversation ? <>
                    <IconClick onClick={() => handleCall("video")}>
                        <VideocamIconCustom sx={{ fontSize: 30 }}/>
                    </IconClick>
                    <IconClick onClick={() => handleCall("audio")}>
                        <PhoneIconCustom />
                    </IconClick>
                </> : null}
                    <IconClick>
                        <Options/>
                    </IconClick>
                </RightHeader>
            </Header>
            <Chat id='scroll' style={{background:`repeat url(${session.isDark ? backgroundDark : backgroundLight}`}}>
            {messages.map((message:any) => {return <Message key={message.id} message={message} setConfig={setConfig} />})}
            </Chat>
            <InputContainer>
                <IconClick>
                    <Smiley/>
                </IconClick>
                <IconClick>
                <label htmlFor="file" style={{cursor:"pointer"}}>
                    <Clip/>
                </label>
                <InputFile
                    id="file"
                    type="file" 
                    name="image_url"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange} />
                </IconClick>
                { file ? <FileName>{ file.image_url.name }</FileName> : null}
                    <Input placeholder="enter your message" id='send' onKeyDown={(e) =>e.key === 'Enter' ? sendMessage() : ""}/>
                <IconClick>
                    <Micro/>
                </IconClick>
            </InputContainer>
        </Container>
    );
};

const InputFile = styled.input`
    display: none;
`
const FileName = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
    white-space: wrap;
    max-width: 100px;
    word-break: break-all;
    
    @supports (-webkit-line-clamp: 3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
`

const CallContainer = styled.div`
    position: absolute;
    top:55px;
    width: 70%;
    height: 400px;
    z-index: 100;
`
const IconInputMessageSize = "80px"; 

const Container = styled.div`
    width:70%;
    height:100vh;
    `;
    const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.backgroundColor};
    border-left: 1px ${(props) => props.theme.borderColor2} solid;
    height:55px;
    `;
const Name = styled.div`
    color:${(props) => props.theme.fontColor};
`;
const LeftHeader = styled.div``
const RightHeader = styled.div``
const ProfilImage = styled(AccountCircleIcon)`
    color:${(props) => props.theme.colorProfilDefault};
    width: ${(props) => props.theme.profilHeaderSize} !important;
    height:${(props) => props.theme.profilHeaderSize} !important;
    background-size:1000px !important;
    border-radius: 50px;
    background-image: #ffffff;
`;
const IconClick = styled(IconButton)`
    margin:0 4px !important;
    color:${(props) => props.theme.colorIcon}
`;
const Search = styled(SearchIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const Options = styled(MoreVertIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const VideocamIconCustom = styled(VideocamIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const PhoneIconCustom = styled(PhoneIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const InputContainer = styled.div`
    background-color:${(props) => props.theme.backgroundColor};
    height:70px;
    width:70%;
    min-width: 700px;
    position:absolute;
    display: flex;
    bottom: 0px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    @media (max-height:755px) {
        top:686px;
        
    };
`;
const Micro = styled(MicIcon)`
    width: ${(props) => props.theme.iconInputMessageSize};
    color:${(props) => props.theme.colorIcon};
`;
const Smiley = styled(TagFacesIcon)`
    width: ${(props) => props.theme.iconInputMessageSize};
    color:${(props) => props.theme.colorIcon};
`;
const Clip = styled(AttachFileIcon)`
    width: ${(props) => props.theme.iconInputMessageSize};
    color:${(props) => props.theme.colorIcon};
`;
const Input = styled.input`
    color:${(props) => props.theme.colorIcon};
    width:85vw;
    min-width: 400px;
    height:30px;
    border-radius:5px;
    border:none;
    text-decoration: none !important;
    text-indent: 10px; 
    outline:none;
    background-color: ${(props) => props.theme.inputColor};
`;
const Chat = styled.div`
    height: calc(100% - 125px);
    min-height: 700px !important;
    overflow: scroll;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
        scrollbar-width: none; /* for Firefox */
        overflow-y: scroll;
        ::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
        }
    `
export default Conversation;