import React from 'react';
import './chatlist.css';
import {
  recieveSocket,
  sendSocket
}from "../../socket/socketconnect";

export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      chatlog:[],
      openchat:false,
      lastMessage : '',
      notif : 0,
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId);
    this.socketcloseChatroom();
    this.getChatData(this.props.chat);
    this.readChatSocket(this.props.chat.chatId);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId);
    this.socketcloseChatroom();
    this.readChatSocket(this.props.chat.chatId);
  }

  socketcloseChatroom=()=>{
    recieveSocket('closechatroom'+this.props.chat.chatId,(err,recieve)=>{
        this.setState({
          openchat:false
        })
    })
  }

  activeSocket(port){
    recieveSocket(port,(err,recieve)=>{
      console.log(this.state.openchat);
      let time = new Date(recieve.message.time);
      const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
      const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
      const timeStamp = getHours + ':' + getMinute;
      let lastMessageText;
      if(recieve.message.message.length > 30){
        lastMessageText = recieve.message.message.substring(0,30) +'. . .'
      } else {
        lastMessageText = recieve.message.message
      }
      if(this.state.openchat){
        if(recieve.message.attachment){
          this.setState({
            chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],attachment:recieve.message.attachment,time: recieve.message.time ,date: recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        }else {
          this.setState({
            chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],time: recieve.message.time ,date: recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        }
        this.props.changeName(null,this.props.chatId,this.state.chatlog);
        this.readChat(this.props.chat,this.props.myUser.username);
        if(recieve.message.sender.username === this.props.myUser.username){
          sendSocket('changechatroom');
        }
        else{
          sendSocket('readchat',recieve.message.chatId);
        }
      }
      else{
        if(recieve.message.attachment){
          this.setState({
            chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],attachment:recieve.message.attachment,time: recieve.message.time,date : recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        } else{
          this.setState({
            chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],time: recieve.message.time,date : recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp,
          })
        }
        if(recieve.message.sender.username !== this.props.myUser.username){
          this.setState({
            notif:this.state.notif+1
          })
        }
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
            if(json.message[read].sender.username !== this.props.myUser.username && !json.message[read].receiver[0].read){
              notif++
            }
          }
          let time  = new Date(json.message.slice(-1).pop().time);
          const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
          const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
          const timeStamp = getHours + ':' + getMinute;
          let lastMessageText;
          if(json.message.slice(-1).pop().message.length > 30){
            lastMessageText = json.message.slice(-1).pop().message.substring(0,30) +'. . .'
          } else {
            lastMessageText = json.message.slice(-1).pop().message
          }
          this.setState({
            chatlog : json.message,
            lastMessage:{
              chatId: json.chatId,
              message:lastMessageText,
              sender:json.message.slice(-1).pop().sender
            },
            timeStamp :timeStamp,
            notif : notif
          })
        }
    })
  }

  openChatRoom = (item,log) => {
    console.log(item.chatId);
    this.setState({
      openchat:true,
      notif:0
    })
    this.props.changeName(item,item.chatId,log);
    if(this.state.lastMessage.sender !== this.props.myUser.username){
      console.log('masuk read',this.state.lastMessage);
      this.readChat(item,this.props.myUser.username);
       sendSocket('readchat',item);
    }
  }

  readChatSocket (port) {
    recieveSocket ('readchat'+port, (err,recieve) =>{
      console.log("asda");
      if(this.state.chatlog.length !== 0){
        let chatlog = this.state.chatlog;
        for(var index = chatlog.length-1 ; index >= 0 ; index--){
            if(chatlog[index].receiver[0].read === false){
              chatlog.splice(index,1,
                { chatId: port,
                  date : chatlog[index].date,
                  message : chatlog[index].message,
                  attachment : chatlog[index].attachment,
                  receiver:[{username :chatlog[index].receiver[0].username, read : true}],
                  sender : {username : chatlog[index].sender.username,  name : chatlog[index].sender.name},
                  time : chatlog[index].time
                });
            } else {
              this.setState({
                chatlog : chatlog
              })
              break;
            }
        }
        if(this.state.openchat){
          this.props.changeName(null,null,this.state.chatlog);
        }
      }
    })
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
    const chat = this.props.chat;
    return(
        <div>
          <li className = "chat-list-text"
            onClick={() =>this.openChatRoom(chat,this.state.chatlog)}
          >
          <div className = "chat-list-picture">
            <img src = {chat.picture} alt=""/>
          </div>
          <div>
            <div className = "chat-name">
              {chat.name}
            </div>
            <div className = "chat-time">
              {this.state.timeStamp}
            </div>
          </div>
          <div>
            <div className = "chat-lastMessageText">
              {this.state.lastMessage.message}
            </div>
            {this.state.notif === 0 ?
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
