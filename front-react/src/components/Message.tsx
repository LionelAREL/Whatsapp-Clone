import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/Store';
import { backgroundColor, colorIcon, colorMessageIncoming, colorMessageOutgoing, fontColor, timeColor } from '../style/variable';

const Message = ({message}:any) => {
    const session = useSelector((state: RootState) => state.session)
    let date = new Date(message.date).toTimeString().substring(1,5);
    return (
        <Container>
            {message.user_from === session?.user?.id  ? 
                <DmOutgoing>
                    <Text>
                        {message.message}
                    </Text>
                    <DateView>
                        {date}
                    </DateView>
                </DmOutgoing>
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
};

const Container = styled.div`
padding-top: 20px;
`;
const Dm = styled.div`
    background-color: ${backgroundColor};
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
    background-color: ${colorMessageIncoming};
`;

const DmOutgoing = styled(Dm)`
    margin-left: auto;
    background-color: ${colorMessageOutgoing};
`;
const Text = styled.div`
    color:${fontColor}
`;
const DateView = styled.div`
    color:${timeColor};
    font-size:10px;
    position:absolute;
    right:4px;
    bottom:3px;
`;

export default Message;