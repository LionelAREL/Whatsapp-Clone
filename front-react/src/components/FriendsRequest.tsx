import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { backgroundColor, backgroundColor2, borderColor, colorIcon } from '../style/variable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import fetchData from '../services/fetch';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { WebSocketContext } from '../services/websocket';
import LoadingWrapper from './LoadingWrapper';

const FriendsRequest = () => {
    const [friendsRequest,setFriendsRequest] = useState([]);
    const session = useSelector((state: RootState) => state.session)
    const chatSocket:any = useContext(WebSocketContext);
    const [loading,setLoading] = useState(true)

    function getFriendsRequest(){
        setLoading(true)
        fetchData.getRequestFriends().then((data:any) => {
            setFriendsRequest(data);
            setLoading(false)
        });   
    }

    useEffect(() => {
        getFriendsRequest();
        chatSocket.onmessage = function(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'friend_request'){
                console.log("recieve friends request");
                getFriendsRequest();
            }
        }
    },[]);

    const sendResponse = (user:any,accept:any) => {
        console.log(`friend response from ${session.user.id} to ${user.id} is ${accept}`);
        chatSocket.send(JSON.stringify({
            'type': 'friend_response',
            'user_from': session.user.id,
            'user_to': user.id,
            'accept': accept,
        }));
        console.log("msg envoyé");
        getFriendsRequest();
    }

    return (
        <Container>
            <LoadingWrapper loading={loading}>
                <ContainerList>
                {
                        friendsRequest.map((friend:any) => {
                            return(
                                <FriendRequest key={friend.id}>
                                    <ProfilImage/>
                                    <Text>
                                        <div>
                                        {friend.username}
                                        </div>
                                        <div>
                                            <ButtonDemand onClick={() => sendResponse(friend,true)}>Accept</ButtonDemand>
                                            <ButtonDemand onClick={() => sendResponse(friend,false)}>Decline</ButtonDemand>
                                        </div>
                                    </Text>
                                </FriendRequest>
                            );
                        })
                    }
                {
                    friendsRequest.length == 0 && <div>no invitation</div> && loading
                }
                </ContainerList>
            </LoadingWrapper>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${backgroundColor};
    height: 100%;
    border-right: 1px solid #303d45;
`;

const Input = styled.input`
    width:80%;
    margin: 20px auto;
    background-color: ${backgroundColor};
    border: none;
    height: 22px;
    border-radius: 5px;
`;

const ContainerList = styled.div`
    display: flex;
    flex-direction: column;
`;

const FriendRequest = styled.div`
    background-color: #111b21;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    
`;

const Text = styled.div`
    width: 80%;
    height: 70px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: ${colorIcon};
    justify-content: space-between;
    border-top: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};
`;

const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${colorIcon};
`;
const ButtonDemand = styled(Button)``;


export default FriendsRequest;