export function isSelectedChat(socketData:any,selectedConversation:any){
    if(selectedConversation == null){
        return false;
    }
    else if(socketData.type !== selectedConversation.type){
        return false;
    }
    else if(socketData.id == selectedConversation.id){
        return true;
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