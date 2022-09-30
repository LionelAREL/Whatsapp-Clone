import React, { useContext, useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { backgroundColor, borderColor, colorIcon, dotColorNotification, profilHeaderSize } from '../style/variable';
import { WebSocketContext } from '../services/websocket';
import { Badge, Menu, MenuItem, MenuProps, Modal } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const NavBar:any = ({setCurrentdispalySide,currentDisplaySide,noWatchedMessage}:any) => {
    const chatSocket = useContext(WebSocketContext)
    const [pin,setPin] = useState(true);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const [value, setValue] = React.useState(true);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue((event.target as any).value);
    }

    useEffect(() => {
        function refreshOnMessageReceive(e:any) {
            const data = JSON.parse(e.data);
            if(data.type == 'friend_request'){
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

    const changeDisplay = (e:any,displayNumber:number) => {
        e.preventDefault();
        setCurrentdispalySide(displayNumber)
    }

    return (
        <Container>
            <IconButton>
                <ProfilImage/>
            </IconButton>
            <IconContainer>
                <Badge invisible={noWatchedMessage} sx={{ "& .MuiBadge-badge": {backgroundColor: `${dotColorNotification}`}}} overlap="circular" badgeContent=" " variant="dot">
                    <IconClick onClick={(e) => changeDisplay(e,0)}><ChatIconMessage/></IconClick>
                </Badge>
                <IconClick onClick={(e) => changeDisplay(e,1)}><PersonAdd/></IconClick>
                <Badge invisible={pin} sx={{ "& .MuiBadge-badge": {backgroundColor: `${dotColorNotification}`}}} overlap="circular" badgeContent=" " variant="dot">
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
                        onClose={handleClose}
                    >
                        
                        <MenuItem onClick={handleOpenModal} disableRipple>
                        Theme
                        </MenuItem>
                        <Modal
                            open={openModal}
                            onClose={()=>{handleCloseModal();handleClose()}}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            >
                            <ModalContainer >
                                <div>
                                <FormControl>
                                <FormLabel>Theme</FormLabel>
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
                        <MenuItem onClick={handleClose} disableRipple>
                        Logout
                        </MenuItem>
                    </StyledMenu>
                </>
            </IconContainer>
        </Container>
    );
};


const ProfilImage = styled(AccountCircleIcon)`
    width: ${profilHeaderSize} !important;
    height:${profilHeaderSize} !important;
    color:${colorIcon};
`
const IconContainer = styled.div``

const IconClick = styled(IconButton)`
    margin:0 4px !important;
`;

const Container = styled.div`
    width: 30vw !important;
    background-color:${backgroundColor};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid ${borderColor};
    height:55px;

`
const ChatIconMessage = styled(ChatIcon)`
    color:${colorIcon};
`;
const PersonAdd = styled(PersonAddAlt1Icon)`
    color:${colorIcon};
`;
const ListBullet = styled(FormatListBulletedIcon)`
    color:${colorIcon};
`;
const Options = styled(MoreVertIcon)`
    color:${colorIcon};
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
  }));

const ModalContainer = styled.div`
    position: absolute ;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export default NavBar;