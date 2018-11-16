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
    this.socketopenChatroom()
    this.socketcloseChatroom()
    this.getChatData(this.props.chat)
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId)
    this.socketopenChatroom()
    this.socketcloseChatroom()
  }
  socketcloseChatroom=()=>{
    recieveChat('closechatroom'+this.props.chat.username,(err,recieve)=>{
        this.setState({
          openchat:false
        })
    })
  }
  socketopenChatroom=() =>{
    recieveChat('openchatroom'+this.props.chat.username,(err,recieve)=>{
        this.setState({
          openchat:true
        })
    })
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      console.log(recieve);
      let time = new Date(recieve.message.time);
      const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
      const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
      const timeStamp = getHours + ':' + getMinute;
      this.props.updateSort(recieve.message.time,recieve.message.chatId)
      if(this.state.openchat){
        this.setState({
          chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,image:recieve.message.image,time: recieve.message.time}),
          lastMessage:{
            chatId: recieve.message.chatId,
            message:recieve.message.message,
            sender:recieve.message.sender.username
          },
          timeStamp :timeStamp,
        })
        this.props.changeName(null,this.props.chatId,this.state.chatlog)
      }
      else{
        this.setState({
          chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,image:recieve.message.image,time: recieve.message.time}),
          lastMessage:{
            chatId: recieve.message.chatId,
            message:recieve.message.message,
            sender:recieve.message.sender.username
          },
          timeStamp :timeStamp,
          notif:this.state.notif+1
        })
        this.props.notifTotal(1);
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
          let notif = 0
          for(var read in json.message){
            if(json.message[read].sender.username != this.props.myUser.username && !json.message[read].receiver[0].read){
              notif++
            }
          }
          let time  = new Date(json.message.slice(-1).pop().time);
          const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
          const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
          const timeStamp = getHours + ':' + getMinute;
          this.props.updateSort(json.message.slice(-1).pop().time,json.message.slice(-1).pop().chatId)
          this.setState({
            chatlog : json.message,
            lastMessage:{
              chatId: json.chatId,
              message:json.message.slice(-1).pop().message,
              sender:json.message.slice(-1).pop().sender
            },
            timeStamp :timeStamp,
            notif : notif
          })
          this.props.notifTotal(this.state.notif)
        }
    })
  }

  openChatRoom = (item,log) => {
    console.log(this.props.chat.chatId,this.state.chatlog);
    this.setState({
      openchat:true,
      notif:0
    })
    sendChat('openchatroom',this.props.chat.username)
    this.props.changeName(item,item.chatId,log);
    if(this.state.lastMessage.sender != this.props.myUser.username){
      this.props.notifMinus(this.state.notif)
      this.readChat(item,this.props.myUser.username);
    }
  }

  readChat = (chat,username) => {
    fetch('/readNotif',{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chat.chatId,
        username : username
      }),
    })
  }

  render(){
    console.log(this.state.chatlog);
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
              {this.state.lastMessage.message}
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
