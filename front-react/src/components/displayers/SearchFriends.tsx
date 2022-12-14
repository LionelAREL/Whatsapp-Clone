import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/Store';
import fetchData from '../../services/fetch';
import { WebSocketContext } from '../../services/websocket';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import LoadingWrapper from '../loaders/LoadingWrapper';



const SearchFriend = ({setCurrentdispalySide}:any) => {
    const [friendsSearch,setFriendsSearch] = useState([]);
    const session = useSelector((state: RootState) => state.session);
    const chatSocket:any = useContext(WebSocketContext);
    const [lastSearch,setLastSearch] = useState("");
    const [loading,setLoading] = useState(false);


    function search(e:any){
        if (e?.key === 'Enter') {
            let searchUser:any = document.querySelector("#search-friends");
            let username = searchUser.value; 
            setLastSearch(searchUser.value);
            setLoading(true)
            fetchData.getSearchUsers(username).then((data) => {setFriendsSearch(data)});
            setLoading(false)

        }
    }

    function sendInvitation(user:any){
        console.log(`friend_request from ${session?.user?.id} to ${user.id}`)
        chatSocket.send(JSON.stringify({
            'type': 'friend_request',
            'user_from': session?.user?.id,
            'user_to': user.id,
        }));
        console.log("msg envoyé");
    }

    const createGroup = () => {
        setCurrentdispalySide(3)
    }

    React.useEffect(() => {
        function handleFriendRequestOfMine(e:any){
            const data = JSON.parse(e.data);
            if(data.type == 'friend_request'){
                console.log("SearchFriend recieve friends request");
                fetchData.getSearchUsers(lastSearch).then((data) => {setFriendsSearch(data)});
            }
        }
        chatSocket.addEventListener("message",handleFriendRequestOfMine);

        return () => chatSocket.removeEventListener("message",handleFriendRequestOfMine)
    });

    return (
        <Container>
            <ButtonCreateGroup onClick={() => createGroup()}>Create new groupe</ButtonCreateGroup>
            <Input placeholder="search friends" id="search-friends" onKeyDown={search} />
            <LoadingWrapper loading={loading}>

                <ContainerList>
                    {
                        friendsSearch.map((friend:any) => {
                            return(
                                <FriendSearch key={friend.id}>
                                    <ProfilImage/>
                                    <Text>
                                        <div>

                                        {friend.username}
                                        </div>
                                        <div>
                                        {friend.status == "friend" ? 
                                            <div>already friend</div>:
                                            ""
                                            }
                                            {friend.status == "request_send" ? 
                                            <div>already send</div>:
                                            ""
                                            }
                                            {friend.status == "unknow" ? 
                                            <>
                                        <ButtonDemand onClick={() => sendInvitation(friend)}>demand</ButtonDemand>
                                            </>
                                            :""
                                            }
                                        </div>
                                    </Text>
                                </FriendSearch>
                            );
                        })
                    }
                </ContainerList>
            </LoadingWrapper>
        </Container>
    );
};

const ButtonCreateGroup = styled(Button)`
    margin-top: 20px !important;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.backgroundColor};
    height: calc(100vh - 56px);
    min-height: 700px !important;
    border-right: 1px solid ${(props) => props.theme.borderColor2};
`;

const Input = styled.input`
    width:80%;
    margin: 20px auto;
    background-color: ${(props) => props.theme.backgroundColor2};
    border: none;
    height: 30px;
    border-radius: 5px;
    text-indent: 15px; 
    font-size: 17px;
    outline:none;
    color:${(props) => props.theme.colorIcon};
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
    color: ${(props) => props.theme.colorIcon};
    justify-content: space-between;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${(props) => props.theme.colorIcon};
`;
const ButtonDemand = styled(Button)``;


export default SearchFriend;