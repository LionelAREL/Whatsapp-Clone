import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/Store';
import { backgroundColor, colorIcon } from '../style/variable';

const Message = ({message}:any) => {
    const session = useSelector((state: RootState) => state.session)
    let date = new Date(message.date).toTimeString().substring(1,5);
    return (
        <Container>
            {message.user_from === session?.user?.id  ? 
                <DmIncoming>
                    <Text>
                        {message.message}
                    </Text>
                    <DateView>
                        {date}
                    </DateView>
                </DmIncoming>
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

        </Container>
    );
};

const Container = styled.div`
`;
const DmOutgoing = styled.div`
    border-radius: 50px 10px 10px 50px;
    background-color: ${backgroundColor};
    width:fit-content;
    padding: 5px 30px;
    margin-left: auto;
`;
const DmIncoming = styled(DmOutgoing)`
    border-radius: 10px 50px 50px 10px;
`;
const Text = styled.div`
    color:${colorIcon}
`;
const DateView = styled.div``;

export default Message;