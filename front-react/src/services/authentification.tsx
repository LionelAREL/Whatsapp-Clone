import React from "react";
import Cookies from "universal-cookie";
import environments from "../environment/environment";

const cookies = new Cookies();

const ACCOUNT_URL = environments.protocol + environments.baseUrl + "/account/";
const API_URL = environments.protocol + environments.baseUrl + "/api/";

const getSession = () => {
return fetch(ACCOUNT_URL + "session/", {
      credentials: "include",
  })
  .then((res) => res.json())
  .then((data) => {
      return data;
  })
  .catch((err) => {
      console.log(err);
  });
};

const getCSRFToken = () => {
  fetch(ACCOUNT_URL + "CSRFToken/",{credentials: "include"})
  .then((data) => {
  })
  .catch((err) => {
      console.log(err);
  });
};

const isResponseOk = (response:any) =>  {
  // console.log(response)
  if (Number(response.status) >= 200 && Number(response.status) <= 299) {
      return response.json();
  } else {
    return Promise.reject(response.json())
  }
};

const login = (username:string,password:string) => {
  const _username = username.toString()
  const _password = password.toString()
  return fetch(ACCOUNT_URL + "login/", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": cookies.get("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({username: _username, password: _password}),
  })
  .then(isResponseOk)
  .then((data) => {
      return data;
  })
};
const signUp = (username:string,password:string) => {
  const _username = username.toString()
  const _password = password.toString()
  return fetch(API_URL + "users/", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": cookies.get("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({username: _username, password: _password}),
  })
  .then(isResponseOk)
  .then((data) => {
      return data;
  })
  .catch((err) => {
        return Promise.reject(err)
  });
};

const logout = () => {
  return fetch(ACCOUNT_URL + "logout/", {
      credentials: "include",
  })
  .then(isResponseOk)
  .then((data) => {
    return data
  })
  .catch((err) => {
      return err;
  });
};


const   AuthService = {
  login,
  logout,
  ACCOUNT_URL,
  getCSRFToken,
  getSession,
  signUp
};

export default AuthService;