import React from "react";
import Cookies from "universal-cookie";
import environments from './../environment/environment'

const API_URL = environments.protocol + environments.baseUrl + "/api/";

const cookies = new Cookies();

const isResponseOk = (response:any) =>  {
    if (response.status >= 200 && response.status <= 299) {
        // console.log(response);
        return response.json();
    } else {
        throw Error(response.statusText);
    }
};
  
const getPublications = () => {
    return fetch(API_URL + "publications/", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        }
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const getPublication = (publicationId:any) => {
    return fetch(API_URL + "publications/"+publicationId + "/", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        }
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getMessagesGroup = (chat_group_id:number,page_number:number) =>{
    return fetch(API_URL + `chat_group/${chat_group_id}/message_group/?page=${page_number}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const getPrivateChatRetrive = (user1_id:any,user2_id:number) =>{
    return fetch(API_URL + `retrive?user_from=${user1_id}&user_to=${user2_id}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getMessagesPrivate = (chat_private_id:number,page_number:number) =>{
    return fetch(API_URL + `chat_private/${chat_private_id}/message_private/?page=${page_number}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getChatGroup = (chat_group_id:number) =>{
    return fetch(API_URL + `chat_group/${chat_group_id}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const getChatsGroup = () =>{
    return fetch(API_URL + `chat_group/`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const getChatsPrivate = () =>{
    return fetch(API_URL + `chat_private/`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getChatPrivate = (chat_private_id:number) =>{
    return fetch(API_URL + `chat_private/${chat_private_id}/`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getFriends= () =>{
    return fetch(API_URL + 'friends', {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};

const getRequestFriends= () =>{
    return fetch(API_URL + 'request_friends', {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const getSearchUsers= (username:string) =>{
    return fetch(API_URL + 'users/?search=' + username, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const postPublication= (title:string,text:string,authors:any) =>{
    return fetch(API_URL + 'publications/', {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        body: JSON.stringify({'title':title,'text':text,'authors':authors,}),
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};
const putPublication= (id:any,title:string,text:string,authors:any) =>{
    return fetch(API_URL + 'publications/'+id + '/', {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        body: JSON.stringify({'title':title,'text':text,'authors':authors,}),
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};


const postChatGroup= (name_group:string,users:any) =>{
    return fetch(API_URL + 'chat_group/', {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({'chat_name':name_group,'users':users,}),
    })
    .then(isResponseOk)
    .then((data) => {
        return data;
    });
};




const fetchData = {
    getPublications,
    getChatsPrivate,
    getChatGroup,
    getChatPrivate,
    getChatsGroup,
    getMessagesPrivate,
    getMessagesGroup,
    getFriends,
    getRequestFriends,
    getSearchUsers,
    getPublication,
    postPublication,
    putPublication,
    postChatGroup,
    getPrivateChatRetrive,
};

export default fetchData;