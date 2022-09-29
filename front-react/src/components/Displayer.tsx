import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import CreateGroup from './CreateGroup';

const Displayer:any  = ({currentDisplaySide,ConversationList,SearchFriends,FriendsRequest,CreateGroup}:any) => {
    switch(currentDisplaySide){
        case 0 :
            return (ConversationList);
        case 1 :
            return (SearchFriends);
        case 2 :
            return (FriendsRequest);
        case 3 :
            return (CreateGroup);
    }

}

const Container = styled.div`
    overflow-y:hidden;
`;

export default Displayer;