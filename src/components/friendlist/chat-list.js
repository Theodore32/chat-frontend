import React from 'react';
import './friendlist.css';
import {
  recieveChat
}from "../../socket/socketconnect"


export default class FriendList extends React.Component{
  render(){
    return(
      <li className = "friend-list-text">
      </li>
    );
  }
}
