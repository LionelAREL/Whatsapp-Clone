import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import ConversationList from './ConversationList';
import FriendsRequest from './FriendsRequest';
import SearchFriends from './SearchFriends';

const Displayer:any  = ({currentDisplaySide}:{currentDisplaySide:any}) => {
    switch(currentDisplaySide){
        case 0 :
            return (<ConversationList/>);
        case 1 :
            return (<SearchFriends/>);
        case 2 :
            return (<FriendsRequest/>);
    }

}

const Container = styled.div`
    overflow-y:hidden;
`;

export default Displayer;