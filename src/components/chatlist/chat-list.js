import React from 'react';
import './chatlist.css';

import gambar from '../../picture/boy.png';
import {
  recieveChat,
  sendChat
}from "../../socket/socketconnect";

export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      chatlog:[],
      openchat:false,
      lastMessage : '',
      notif : 0
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId)
    this.socketcloseChatroom()
    this.getChatData(this.props.chat)
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId)
    this.socketcloseChatroom()
  }
  socketcloseChatroom=()=>{
    recieveChat('chatroom'+this.props.chat.username,(err,recieve)=>{
      console.log('from socket',recieve);
        this.setState({
          openchat:false
        })
    })
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,reciever:recieve.message.sender,image:recieve.message.image,time: recieve.message.time}),
        lastMessage:recieve.message.message,
        timeStamp :recieve.message.time
      })
      if(this.state.openchat){
        this.props.changeName(null,this.props.chatId,this.state.chatlog)
      }
    })
  }
  escOnClick = (e) =>{
    if(e.keyCode === 27) {
      //Do whatever when esc is pressed
      this.setState({
        openchat:false
      })
    }
  }
  getChatData = (chat) => {

    fetch('/getchat',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chat.chatId
      }),
    }).then(res => res.json())
      .then(json =>{
        if(json.success){
          this.setState({
            chatlog : json.message,
            lastMessage:json.message.slice(-1).pop().message,
            timeStamp :json.message.slice(-1).pop().time,
          })
        }
    })
  }

  openChatRoom = (item,log) => {
    this.setState({
      openchat:true
    })
    this.props.changeName(item,item.chatId,log);
  }

  render(){
    const chat = this.props.chat;
    return(
        <div>
          <li className = "chat-list-text"
            onClick={() =>
              this.openChatRoom(chat,this.state.chatlog)
            }
          >
          <div className = "chat-list-picture">
            <img src = {chat.picture}/>
          </div>
          <div>
            <div className = "friend-name">
              {chat.name}
            </div>
            <div className = "friend-time">
              {this.state.timeStamp}
            </div>
          </div>
          <div>
            <div className = "lastMessageText">
              {this.state.lastMessage}
            </div>
            {this.state.notif == 0 ?
              null
              :this.state.notif <= 9 ?
              <div className = "friend-notif-oneNumber">
                {this.state.notif}
              </div>
              : this.state.notif <= 99 ?
              <div className = "friend-notif-twoNumber">
                {this.state.notif}
              </div>
              : this.state.notif <= 999 ?
              <div className = "friend-notif-threeNumber">
                {this.state.notif}
              </div>
              :
              <div className = "friend-notif-threeNumberPlus">
                999+
              </div>
            }
          </div>
          </li>
        </div>
    );
  }
}
