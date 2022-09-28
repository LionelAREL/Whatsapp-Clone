import React from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { backgroundColor, borderColor, colorIcon, profilHeaderSize } from '../style/variable';

const NavBar:any = ({setCurrentdispalySide}:{setCurrentdispalySide:any}) => {
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
                <IconClick onClick={(e) => changeDisplay(e,0)}><ChatIconMessage/></IconClick>
                <IconClick onClick={(e) => changeDisplay(e,1)}><PersonAdd/></IconClick>
                <IconClick onClick={(e) => changeDisplay(e,2)}><ListBullet/></IconClick>
                <IconClick><Options/></IconClick>
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
    background-color:${backgroundColor}; //#202c33;//#111b21
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid ${borderColor};

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

export default NavBar;