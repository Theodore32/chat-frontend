import React from 'react';
import './chatlist.css';

import gambar from '../../picture/boy.png';
import {
  recieveChat
}from "../../socket/socketconnect";

export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      chatlog:[],
      lastMessage:''
    }
  }
  getChatData = () => {
    fetch('/chat',{
      credentials:'include'
    })
  }
  componentDidMount(){
    this.activeSocket(this.props.chat.chatId)
  }
  componentWillUnmount(){
    this.activeSocket(this.props.chat.chatId)
  }
  activeSocket = (port) =>{
    recieveChat(port,(err,recieve)=>{
      console.log(recieve);
      this.setState({
        chatlog:this.state.chatlog.concat({send:recieve.send,message:recieve.message.message,sender:recieve.message.reciever,reciever:recieve.message.sender}),
        lastMessage:recieve.message.message
      })
      this.props.changeName(null,port,this.state.chatlog)
    })
  }
  render(){
    const chat = this.props.chat
    return(
      <li className = "chat-list-text"
        onClick={() =>
        this.props.changeName(chat,this.props.chat.chatId,this.state.chatlog)
        }
      >
      <div className = "chat-list-picture">
      <img src = {gambar} alt=''/>
      </div>
      <div className = "friend-name">
      {chat.name}
      </div>
      <div className = "lastMessageText">
        {this.state.lastMessage}
      </div>
      </li>
    );
  }
}
