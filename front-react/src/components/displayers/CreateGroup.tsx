import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Form } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { RootState } from '../../redux/Store';
import fetchData from '../../services/fetch';
import { WebSocketContext } from '../../services/websocket';
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

    const theme:any = useTheme();


    React.useEffect(() =>{
        fetchData.getFriends().then((data) => setFriends(data));
    },[]);

    function handleToggle(value:any){
        const currentIndex = selectFriendsGroup.indexOf(value);
        const newChecked = [...selectFriendsGroup];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setSelectFriendsGroup(newChecked);
      };

    function submit(data:any) {
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
            <Forms onSubmit={handleSubmit(submit)}>
                <InputGroupName sx={{"& .MuiInputBase-root": {color: theme.fontColor},"& .MuiFormLabel-root": {color: theme.fontColor},"& .MuiOutlinedInput-notchedOutline": {borderColor: theme.fontColor} }} error={errors.groupName && true} label="group name" variant="outlined" {...register("groupName",{required:true})} helperText={errors.groupName && "name group required"} />
                    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: '${(props) => props.theme.backgroundColor}',color:theme.fontColor,"& .MuiButtonBase-root": {color: theme.fontColor}, }}>
                    {friends.map((friend:any) => {
                        const labelId = `checkbox-list-secondary-label-${friend}`;
                        return (
                        <ListItem
                            key={friend.id}
                            secondaryAction={
                                <Checkbox
                                edge="end"
                                onChange={() => {handleToggle(friend.id)}}
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
                    <Return onClick={() => {setCurrentdispalySide(1)}}>return</Return>
        </Container>
    );
};


const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.backgroundColor};
    height : calc(100vh - 56px);
    min-height: 700px !important;
    border-right: 1px solid ${(props) => props.theme.borderColor2};
`;

const InputGroupName = styled(TextField)`
    width:95%;
    margin: 0 auto;
    /* color:${(props) => props.theme.fontColor} !important; */
`

const ProfilImage = styled(AccountCircleIcon)`
    width: 55px !important;
    height: 55px !important;
    color: ${(props) => props.theme.colorIcon};
`;

const Return = styled(Button)`
    margin: 20px 0 !important ;
`;

const Forms = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`

const Error = styled.div`
    color:red;
    font-size: 18px;
    margin-bottom: 10px;
`

export default CreateGroup;