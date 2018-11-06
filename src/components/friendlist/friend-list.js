import React from 'react';
import './friendlist.css';
import {
  recieveSocket,
  sendSocket,
  closeSocket
}from "../../socket/socketconnect";
import {Modal, Button} from 'semantic-ui-react';
import chat from '../../picture/chat.png'
import block from '../../picture/block.png'
var crypto = require("crypto");



export default class FriendList extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      chatlog:[],
      open : false,
      chated : false,
      blocked : false,
      openchat : false
    }

    this.activeSocket = this.activeSocket.bind(this);
  }

  componentDidMount(){
    this.socketcloseChatroom();
    this.socketEditFriend(this.props.friend.username);
    this.socketblacklistChat();
    this.readChatSocket(this.state.chatId);
    for(var block in this.props.blacklist){
      if(this.props.blacklist[block].username === this.props.friend.username){
        this.setState({
          blocked: true
        })
        break;
      }
    }

    for(var chat in this.props.chatlist){
      if(this.props.chatlist[chat].username === this.props.friend.username && !this.state.blocked){
        this.activeSocket(this.props.chatlist[chat].chatId)
        this.setState({
          chated:true,
          chatId : this.props.chatlist[chat].chatId
        })
        this.getChatData(this.props.chatlist[chat].chatId);
        break;
      }
    }
  }

  componentWillUnmount(){
    this.socketcloseChatroom();
    this.socketopenChatroom();
    this.socketEditFriend(this.props.friend.username);
    this.activeSocket(this.state.chatId);
    this.socketblacklistChat();
    this.readChatSocket(this.state.chatId);
  }

  socketcloseChatroom=()=>{
    recieveSocket('closechatroom'+this.props.friend.username,(err,recieve)=>{
        this.setState({
          openchat:false
        })
    })
  }

  socketopenChatroom =() =>{
    recieveSocket('openchatroom'+this.props.friend.username,(err,recieve)=>{
        this.setState({
          openchat:true
        })
    })
  }

  socketblacklistChat = () =>{
    recieveSocket('blockchat'+this.props.friend.username,(err,recieve)=>{
      closeSocket()
    })
  }

  activeSocket(port){
    recieveSocket(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,receiver:[{username :recieve.message.sender,read : false}],image:recieve.message.image,time: recieve.message.time,date : recieve.message.date})
      })
      if(this.state.openchat){
        this.readChatSocket(this.state.chatId);
        this.props.changeName(null,this.props.chatId,this.state.chatlog);
      }
    })
  }

  socketEditFriend = (port) => {
    recieveSocket('edit'+port, (err,recieve) => {
      this.props.editfriendSocket(recieve.message)
    })
  }

  openChatRoom = (friend) =>{
    this.close();
    this.setState({
      openchat:true
    })
    sendSocket('openchatroom',this.props.friend.username);
    sendSocket('readchat',this.state.chatId);
    if(!this.state.chated){
      fetch('/addchatroom',{
        credentials:'include',
        method:'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatid:crypto.randomBytes(20).toString('hex')+Date.now(),
          user:friend.username
        }),
      }).then(res => res.json())
      .then(json =>{
        this.setState({
          chatId : json.chatId,
          chated:true,
        })
        let socketChatlist = {
          myusername:this.props.myUser.username,
          myname:this.props.myUser.name,
          mypicture : this.props.myUser.picture,
          mydescription : this.props.myUser.description,
          otherusername:friend.username,
          othername:friend.name,
          otherpicture : friend.picture,
          otherdescription : friend.description,
          chatId:json.chatId
        }
        sendSocket('newchatlist',socketChatlist);
        this.activeSocket(json.chatid);
        this.props.changeName(friend,json.chatId,this.state.chatlog);
        sendSocket('openchatroom',this.props.friend.username);
      })
    }
    else{
      this.readChatSocket(this.state.chatId);
      this.props.changeName(friend,this.state.chatId,this.state.chatlog);
    }
  }

  readChatSocket (port) {
    recieveSocket ('readchat'+port, (err,recieve) =>{
      if(this.state.chatlog.length != 0){
        let chatlog = this.state.chatlog;
        for(var index = chatlog.length-1 ; index != 0 ; index--){
          if(chatlog.length != 0){
            if(chatlog[index].receiver[0].read == false){
              chatlog.splice(index,1,
                { chatId: port,
                  date : chatlog[index].date,
                  message : chatlog[index].message,
                  receiver:[{username :chatlog[index].receiver[0].username, read : true}],
                  sender : {username : chatlog[index].sender.username,  name : chatlog[index].sender.name},
                  time : chatlog[index].time
                });
                this.setState({
                  chatlog : chatlog
                })
            } else {
              this.setState({
                chatlog : chatlog
              })
              this.props.changeName(null,null,this.state.chatlog);
              break;
            }
          }
        }
      }
    })
  }

  getChatData = (chat) => {
    fetch('/getchat',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chat
      }),
    }).then(res => res.json())
      .then(json =>{
        if(json.success){
          this.setState({
            chatlog : json.message
          })
        }
    })
  }

    open = () =>{
      this.setState({
        open : true
      })
    }

    close = () => {
      this.setState({
        open : false
      })
    }

  render(){
    const chatList = this.props.chatList;
    const friend = this.props.friend;
    return(
      <Modal
        id = "friend-chat-modal"
        open={this.state.open}
        onClose = {this.close}
        trigger={
        <li onClick = {this.open}>
          <div className = "friend-list-picture">
            <img src ={friend.picture}/>
            {friend.name}
          </div>
        </li>
        }>
        <center>
          <div className = "friend-name-modal">
            <b>
              {friend.name}
            </b>
          </div>
          <div className = "friend-picture-modal">
            <img src = {friend.picture}/>
          </div>
          <div className = "status-container">
            {friend.description}
          </div>
          <div className = "chat-block-container">
            <div onClick={() => this.openChatRoom(friend)} className = "chat-button">
              <img src = {chat}/><br/>
              Chat
            </div>
            <div className = "block-button">
              <img src = {block} /><br/>
              Block
            </div>
          </div>
        </center>
      </Modal>
    );
  }
}
