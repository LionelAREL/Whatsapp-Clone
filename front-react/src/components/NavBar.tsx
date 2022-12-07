import React, { useContext, useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled, { useTheme } from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { WebSocketContext } from '../services/websocket';
import { Badge, Menu, MenuItem, MenuProps, Modal } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSession, setDark } from '../redux/CounterSlice';
import AuthService from '../services/authentification';
import { RootState } from '../redux/Store';

const NavBar:any = ({setCurrentdispalySide,currentDisplaySide,noWatchedMessage}:any) => {
    const session = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch();
    const chatSocket = useContext(WebSocketContext)
    const [pin,setPin] = useState(true);
    const theme:any = useTheme();


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => {setOpenModal(true)}
    const handleCloseModal = () => {setOpenModal(false)}

    const [value, setValue] = React.useState(true);

    function handleChange (event: React.ChangeEvent<HTMLInputElement>){
      setValue((event.target as any).value);
      dispatch(setDark((event.target as any).value == 'true' ? true : false))
    }


    
    function logout() {
        AuthService.logout().then(() => dispatch(logoutSession()))
    };



    useEffect(() => {
        function refreshOnMessageReceive(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'friend_request' && data.user_from !== session.user.id){
                console.log("NavBar receive friendRequest")
                if(currentDisplaySide == 2){
                    setPin(false)
                    setTimeout(function() {
                        setPin(true)
                      }, 3000);
                }
                else{
                    setPin(false);
                }
                //add pin, if on friend request, delete pin after 2 secondes, else delete when click on friend request
            }
        }
        chatSocket.addEventListener("message",refreshOnMessageReceive);
    
        return  () => chatSocket.removeEventListener("message",refreshOnMessageReceive) 
    },[currentDisplaySide]);

    useEffect(() => {
        if(currentDisplaySide == 2){
            setPin(true);
        }
    },[currentDisplaySide]);

    function changeDisplay (e:any,displayNumber:number){
        e.preventDefault();
        setCurrentdispalySide(displayNumber)
    }

    return (
        <Container>
            <IconButton>
                <ProfilImage/>
                <div style={{color:theme.fontColor, marginLeft:"20px"}}>
                    {session.user.username}

                </div>
            </IconButton>
            <IconContainer>
                <Badge invisible={noWatchedMessage} sx={{ "& .MuiBadge-badge": {backgroundColor: theme.dotColorNotification}}} overlap="circular" badgeContent=" " variant="dot">
                    <IconClick onClick={(e) => changeDisplay(e,0)}><ChatIconMessage/></IconClick>
                </Badge>
                <IconClick onClick={(e) => changeDisplay(e,1)}><PersonAdd/></IconClick>
                <Badge invisible={pin} sx={{ "& .MuiBadge-badge": {backgroundColor: theme.dotColorNotification}}} overlap="circular" badgeContent=" " variant="dot">
                    <IconClick onClick={(e) => changeDisplay(e,2)}><ListBullet/></IconClick>
                </Badge>
                <>
                    <IconClick onClick={handleClick}><Options /></IconClick>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        sx={{bgColor:'${(props) => props.theme.backgroundColor}',color:'${(props) => props.theme.backgroundColor}'}}
                        onClose={handleClose}
                    >
                        
                        <MenuItem onClick={handleOpenModal}  disableRipple>
                        Theme
                        </MenuItem>
                        <Modal
                            open={openModal}
                            onClose={()=>{handleCloseModal();handleClose()}}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            >
                            <ModalContainer>
                                <div>
                                <FormControl>
                                <FormLabel style={{color:theme.fontColor}}>Theme</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Darkmode" />
                                    <FormControlLabel value={false} control={<Radio />} label="LightMode" />
                                </RadioGroup>
                                </FormControl>
                                </div>
                            </ModalContainer>
                        </Modal>
                        <MenuItem onClick={logout} disableRipple>
                        Logout
                        </MenuItem>
                    </StyledMenu>
                </>
            </IconContainer>
        </Container>
    );
};


const ProfilImage = styled(AccountCircleIcon)`
    width: ${(props) => props.theme.profilHeaderSize} !important;
    height:${(props) => props.theme.profilHeaderSize} !important;
    color:${(props) => props.theme.colorProfilDefault};
`
const IconContainer = styled.div``

const IconClick = styled(IconButton)`
    margin:0 4px !important;
`;

const Container = styled.div`
    width: 30vw !important;
    min-width: 300px !important;
    background-color:${(props) => props.theme.backgroundColor};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid ${(props) => props.theme.borderColor};
    height:55px;

`
const ChatIconMessage = styled(ChatIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const PersonAdd = styled(PersonAddAlt1Icon)`
    color:${(props) => props.theme.colorIcon};
`;
const ListBullet = styled(FormatListBulletedIcon)`
    color:${(props) => props.theme.colorIcon};
`;
const Options = styled(MoreVertIcon)`
    color:${(props) => props.theme.colorIcon};
`;

const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: theme.optionColor,
        color:theme.fontColor,
    }
  }));

const ModalContainer = styled.div`
    position: absolute ;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${(props) => props.theme.backgroundColor};
    padding:30px;
    border-radius: 20px;
    color:${(props) => props.theme.fontColor};
`;

export default NavBar;