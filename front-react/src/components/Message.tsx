import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import React from 'react';
import styled from 'styled-components';
import { setIsCalling } from '../redux/CounterSlice';
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';


const Message = ({message, setConfig}:any) => {
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.session)
    let date = new Date(message.date).toTimeString().substring(1,5);
    
    function handleCallingClick(){
        setConfig((config:any) => {
            config.token = message.call_token
            config.channel = message.call_name
            return config
        })
        dispatch(setIsCalling(true))
    }

    if(message.message != "" || message.type_message === "CL"){
        if (message.user_from === session?.user?.id){
        return (
            <Container>
                {message.type_message === "CL" ?
                    <DmOutgoing>
                        <Text>
                            message Calling GG
                        </Text>
                        <button onClick={handleCallingClick}>calling</button>
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
                                Calling message
                            </Text>
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