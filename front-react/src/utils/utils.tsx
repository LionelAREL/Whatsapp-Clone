import Message from "../components/Message";

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


export function isCallingAvailable(message:any):boolean{
    const availabilityTime = 3550;
    const messageDate = new Date(message.date) 
    let diff = Math.abs(messageDate.getTime() - Date.now())
    if (diff < availabilityTime * 1000){
        return true
    }
    else{
        return false
    }
}