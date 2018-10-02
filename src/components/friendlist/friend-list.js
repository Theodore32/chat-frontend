import React from 'react';
import './friendlist.css';
import {
  recieveChat
}from "../../socket/socketconnect"


export default class FriendList extends React.Component{

  asd = () =>{
    fetch('/addchatroom',{
      credentials : 'include',
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        chatid:'addwdwdwd',
        user:this.props.item.username
      })
    }).then(res => res.json())
    .then(res=>{
      console.log(res);
    })
  }
  render(){
    const item = this.props.item;
    console.log(item);
    return(
      <li className = "friend-list-text" onClick = {this.asd}>
        {item.name}
      </li>
    );
  }
}
