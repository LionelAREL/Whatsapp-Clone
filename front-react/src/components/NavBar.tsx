import React, { useContext, useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled, { useTheme } from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { WebSocketContext } from '../services/websocket';
import { Badge, Menu, MenuItem, MenuProps } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSession } from '../redux/CounterSlice';
import AuthService from '../services/authentification';
import { RootState } from '../redux/Store';
import ModalOptionLeft from './modals/ModalOptionLeft';

const NavBar:any = ({setCurrentdispalySide,currentDisplaySide,noWatchedMessage}:any) => {
    const session = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch();
    const chatSocket = useContext(WebSocketContext)
    const [pin,setPin] = useState(true);
    const theme:any = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
        
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => {setOpenModal(true)}
    const handleCloseModal = () => {setOpenModal(false)}
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
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

                        <ModalOptionLeft openModal={openModal} handleCloseModal={handleCloseModal} handleClose={handleClose} />
                        
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
    min-width: 350px !important;
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


export default NavBar;