export function isSelectedChat(socketData:any,selectedConversation:any){
    if(socketData.type !== selectedConversation.type){
        return false;
    }
    if(socketData.type === "chat_message_group" && socketData.chat_group === selectedConversation.to){
        return true;
    }
    else if(socketData.type === "chat_message_private" && socketData.user_from === selectedConversation.to){
        return true
    }
    else{
        return false;
    }
}

export function checkPinMessageNavbar(convList:any){
    let boolConv = true;
    for(let conv of convList){
        if(conv.watched == false){
            boolConv = !boolConv
        }
    }
    return boolConv;
}