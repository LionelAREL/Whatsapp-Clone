import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/Store';

const Message = (message:any) => {
    let date:any = Date(message.date);
    const session = useSelector((state: RootState) => state.session)
    return (
        <Container>
            {message.user_from === session?.user?.id  ? 
                <DmIncoming>
                    <Text>
                        {message}
                    </Text>
                    <Date>
                        {date}
                    </Date>
                </DmIncoming>
            :
                <DmOutgoing>
                    <Text>
                        {message}
                    </Text>
                    <Date>
                        {date}
                    </Date>
                </DmOutgoing>
            }

        </Container>
    );
};

const Container = styled.div``;
const DmIncoming = styled.div`
`;
const DmOutgoing = styled.div`
`;
const Text = styled.div``;
const Date = styled.div``;

export default Message;