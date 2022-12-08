import styled, { useTheme } from 'styled-components';
import { setIsCalling } from '../redux/CounterSlice';
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Modal, Typography } from '@mui/material';
import { isCallingAvailable } from '../utils/utils';
import { CardMedia } from '@mui/material';
import { Image } from 'mui-image'
import React from 'react';


const Message = ({message, setConfig}:any) => {
    const theme:any = useTheme();
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.session)

    let date = new Date(message.date).toTimeString().substring(1,5);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    function handleCallingClick(){
        setConfig((config:any) => {
            config.token = message.call_token;
            config.channel = message.call_name;
            config.callingType = message.message;
            return config
        })
        dispatch(setIsCalling(true))
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border:"none",
        // width: 400,
        // bgcolor: 'background.paper',
        // boxShadow: 24,
        // p: 4,
      };

    console.log(message)
    const modal = 
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby={message.message}
    >
    <Box sx={style}>
    <Image fit="contain" duration={0} src={message.file}></Image>
    </Box>
  </Modal>;

    const callingMessage = `A ${message.message} call was launch !`;
    const callingButton = "Join";
    const callingButtonExpired = "Expired";

    if( ( message.message != "" && message.type_message === "DM" ) || message.type_message === "CL"){
        if (message.user_from === session?.user?.id){
        return (
            <Container>
                {message.type_message === "CL" ?
                    <DmOutgoing>
                        <Text>
                        {callingMessage}
                        </Text>
                        {isCallingAvailable(message) ?
                        <Button style={{backgroundColor:theme.colorMessageIncoming,marginTop:"10px",color:theme.fontColor}} onClick={handleCallingClick}>{callingButton}</Button>
                        : 
                        <Button style={{backgroundColor:theme.colorMessageIncoming,marginTop:"10px",cursor:"default",color:theme.fontColor}} >{callingButtonExpired}</Button>
                         }
                        <DateView>
                            {date}
                        </DateView>
                    </DmOutgoing>
                 :
                    <DmOutgoing>
                        <Text>
                            {message.message}
                        </Text>
                        <DateView>
                            {date}
                        </DateView>
                    </DmOutgoing>
                 }
            </Container>)}
        else{
            return(
                <Container>
                    {message.type_message === "CL" ?
                        <DmIncoming>
                            <Text>
                            {callingMessage}
                            </Text>
                            {isCallingAvailable(message) ?
                            <Button style={{backgroundColor:theme.colorMessageOutgoing,marginTop:"10px",color:theme.fontColor}} onClick={handleCallingClick}>{callingButton}</Button>
                            : 
                            <Button style={{backgroundColor:theme.colorMessageOutgoing,marginTop:"10px",cursor:"default",color:theme.fontColor}} >{callingButtonExpired}</Button>
                            }
                            <DateView>
                                {date}
                            </DateView>
                        </DmIncoming>
                    :
                        <DmIncoming>
                            <Text>
                                {message.message}
                            </Text>
                            <DateView>
                                {date}
                            </DateView>
                        </DmIncoming>
                    }
                    
        
                </Container>
            );
        }
    }
    else if (message.type_message === "FL"){
        if (message.user_from === session?.user?.id){
        return(
            <DmOutgoing>
                    {modal}
                    <CardMedia onClick={handleOpen} style={{height:"300px",width:"300px",cursor:"pointer"}} image={message.file}></CardMedia>
                    <Text style={{marginTop:"8px"}}>
                        {message.message}
                    </Text>
                        <DateView>
                            {date}
                        </DateView>
                </DmOutgoing>
            );
        }
        else{
            return (
                <DmIncoming>
                    {modal}
                    <CardMedia onClick={handleOpen} style={{height:"300px",width:"300px",cursor:"pointer"}} image={message.file}></CardMedia>
                    <Text style={{marginTop:"8px"}}>
                        {message.message}
                    </Text>
                    <DateView>
                        {date}
                    </DateView>
                </DmIncoming>
            )
        }
    }
    else{
        return (
            <>
            </>
        );
    }
};

const Container = styled.div`
padding-top: 20px;
`;
const Dm = styled.div`
    background-color: ${(props) => props.theme.backgroundColor};
    width:fit-content;
    padding: 5px 30px 10px 30px;
    border-radius: 8px;
    position:relative;
    margin: 5px;
    :first-child{
        margin-top: 0;

    }
`;
const DmIncoming = styled(Dm)`
    background-color: ${(props) => props.theme.colorMessageIncoming};
`;

const DmOutgoing = styled(Dm)`
    margin-left: auto;
    background-color: ${(props) => props.theme.colorMessageOutgoing};
`;
const Text = styled.div`
    color:${(props) => props.theme.fontColor}
`;
const DateView = styled.div`
    color:${(props) => props.theme.timeColor};
    font-size:10px;
    position:absolute;
    right:4px;
    bottom:3px;
`;

export default Message;