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
      lastMessage : '',
      notif : 0
    }
  }

  componentDidMount(){
    this.activeSocket(this.props.chat.name)
  }
  componentWillUnmount(){
    this.activeSocket(this.props.chat.name)
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({send:recieve.send,message:recieve.message.message,sender:recieve.message.reciever,reciever:recieve.message.sender,image:recieve.message.image}),
        lastMessage : recieve.message.message
      })
      this.props.changeName(null,null,this.state.chatlog)
    })
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
            chatlog : json.message
          })
          this.openChatRoom(chat,this.state.chatlog)
        }
    })
  }

  openChatRoom = (item,log) => {
    this.props.changeName(item,item.chatId,log);
  }

  render(){
    const chat = this.props.chat;
    return(
        <div>
          <li className = "chat-list-text"
            onClick={() =>
              this.getChatData(chat)
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
              asd
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
