import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Form } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../redux/Store';
import fetchData from '../services/fetch';
import { WebSocketContext } from '../services/websocket';
import { backgroundColor, colorIcon } from '../style/variable';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const CreateGroup = ({setCurrentdispalySide}:any) => {
    const [friends,setFriends] = React.useState([])
    
    const session = useSelector((state: RootState) => state.session)
    const chatSocket:any = useContext(WebSocketContext);

    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    const [selectFriendsGroup, setSelectFriendsGroup] = React.useState<any[]>([]);
    const [alreadySubmit, setAlreadySubmit] = React.useState(false);

    React.useEffect(() =>{
        fetchData.getFriends().then((data) => setFriends(data));
    },[]);

    const handleToggle = (value:any) => () => {
        const currentIndex = selectFriendsGroup.indexOf(value);
        const newChecked = [...selectFriendsGroup];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setSelectFriendsGroup(newChecked);
      };

    const submit = (data:any) => {
        console.log(selectFriendsGroup,data.groupName)
        if(selectFriendsGroup.length !=0){
            fetchData.postChatGroup(data.groupName,selectFriendsGroup).then((data) => {
                let user_from = session.user.id
                let chat_group = data.id
                let message = `groupe ${data.chat_name} ${chat_group} creer par ${session.user.username} !`
                console.log(message);
                chatSocket.send(JSON.stringify({
                    'type': 'chat_create_group',
                    'user_from' : user_from,
                    'chat_group' : chat_group,
                }));
                console.log("msg envoyé")
                chatSocket.send(JSON.stringify({
                    'type': 'chat_message_group',
                    'user_from' : user_from,
                    'chat_group' : chat_group,
                    'message': message,
                }));
                console.log("msg envoyé")
            });
            setCurrentdispalySide(0);
        }
        setAlreadySubmit(true);
    };

    return (
        <Container>
            <Return onClick={() => {setCurrentdispalySide(1)}}>return</Return>
            <Forms onSubmit={handleSubmit(submit)}>
                <InputGroupName error={errors.groupName && true} label="group name" variant="outlined" {...register("groupName",{required:true})} helperText={errors.groupName && "name group required"} />
                    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: '${backgroundColor}' }}>
                    {friends.map((friend:any) => {
                        const labelId = `checkbox-list-secondary-label-${friend}`;
                        return (
                        <ListItem
                            key={friend.id}
                            secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(friend.id)}
                                checked={selectFriendsGroup.indexOf(friend.id) !== -1}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                            <ListItemAvatar>
                                <ProfilImage/>
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={friend.username} />
                            </ListItemButton>
                        </ListItem>
                        );
                    })}
                    </List>
                    {selectFriendsGroup.length == 0 && alreadySubmit && "choose a least one friend"}
                <Button type="submit" variant="contained">submit</Button>
            </Forms>
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

const InputGroupName = styled(TextField)`
    width:95%;
    margin: 0 auto;
`

const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${colorIcon};
`;

const Return = styled(Button)`
    margin: 20px 0 !important ;
`;

const Forms = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Error = styled.div`
    color:red;
    font-size: 18px;
    margin-bottom: 10px;
`

export default CreateGroup;