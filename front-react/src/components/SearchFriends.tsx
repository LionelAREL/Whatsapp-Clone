import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/Store';
import fetchData from '../services/fetch';
import { WebsocketContext } from '../services/websocket';
import { backgroundColor, backgroundColor2, borderColor, colorIcon } from '../style/variable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';


const SearchFriend = () => {
    const [friendsSearch,setFriendsSearch] = useState([]);
    const session = useSelector((state: RootState) => state.session)
    const chatSocket:any = useContext(WebsocketContext);

    const search = (e:any) =>{
        if (e.key === 'Enter') {
            let searchUser:any = document.querySelector("#search-friends");
            let username = searchUser.value; 
            fetchData.getSearchUsers(username).then((data) => {setFriendsSearch(data);console.log(data)});
        }
    }

    const sendInvitation = (user:any) =>{
        console.log(`friend_request from ${session?.user?.id} to ${user.id}`)
        chatSocket.send(JSON.stringify({
            'type': 'friend_request',
            'user_from': session?.user?.id,
            'user_to': user.id,
        }));
        console.log("msg envoyé");
    }

    return (
        <Container>
            <Input id="search-friends" onKeyDown={search} />
            <ContainerList>
                {
                    friendsSearch.map((friend:any) => {
                        return(
                            <FriendSearch>
                                <ProfilImage/>
                                <Text>
                                    <div>

                                    {friend.username}
                                    </div>
                                    <div>
                                        <ButtonDemand onClick={() => sendInvitation(friend)}>demand</ButtonDemand>
                                    </div>
                                </Text>
                            </FriendSearch>
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
    background-color: ${backgroundColor2};
    border: none;
    height: 25px;
    border-radius: 5px;
`;

const ContainerList = styled.div`
    display: flex;
    flex-direction: column;
`;

const FriendSearch = styled.div`
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


export default SearchFriend;