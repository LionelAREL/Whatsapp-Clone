import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { backgroundColor, backgroundColor2, borderColor, colorIcon } from '../style/variable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import fetchData from '../services/fetch';

const FriendsRequest = () => {
    const [friendsRequest,setFriendsRequest] = useState([]);

    useEffect(() => {
        fetchData.getRequestFriends().then((data:any) => {
            setFriendsRequest(data.map((request_user:any) => <div className='request-friends' key={request_user.id}>{request_user.username} <div><button>accepter</button> <button>refuser</button></div></div>))
        });   
    },[]);
    return (
        <Container>
            <ContainerList>
            {
                    friendsRequest.map((friend:any) => {
                        return(
                            <FriendRequest>
                                <ProfilImage/>
                                <Text>
                                    <div>

                                    {friend.username}
                                    </div>
                                    <div>
                                        <ButtonDemand >Accept</ButtonDemand>
                                        <ButtonDemand >Decline</ButtonDemand>
                                    </div>
                                </Text>
                            </FriendRequest>
                        );
                    })
                }
            </ContainerList>
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