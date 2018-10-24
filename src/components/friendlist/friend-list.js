import React from 'react';
import './friendlist.css';
import {
  recieveChat,sendChat
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
      openchat : false
    }

    this.activeSocket = this.activeSocket.bind(this)
  }

  componentDidMount(){
    this.socketcloseChatroom()
    this.socketFriend(this.props.friend.username)
    for(var chat in this.props.chatlist){
      if(this.props.chatlist[chat].username === this.props.friend.username){
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
    this.socketcloseChatroom()
    this.socketopenChatroom()
    this.socketFriend(this.props.friend.username)
    this.activeSocket(this.state.chatId)
  }
  socketcloseChatroom=()=>{
    recieveChat('closechatroom'+this.props.friend.username,(err,recieve)=>{
        this.setState({
          openchat:false
        })
    })
  }
  socketopenChatroom=() =>{
    recieveChat('openchatroom'+this.props.friend.username,(err,recieve)=>{
        this.setState({
          openchat:true
        })
    })
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({message:recieve.message.message,sender:recieve.message.sender,reciever:recieve.message.sender,image:recieve.message.image,time: recieve.message.time})
      })
      if(this.state.openchat){
        this.props.changeName(null,this.props.chatId,this.state.chatlog)
      }
    })
  }

  socketFriend = (port) => {
    recieveChat('edit'+port, (err,recieve) => {
      this.props.editfriendSocket(recieve.message)
    })
  }

  openChatRoom = (friend) =>{
    this.close()
    this.setState({
      openchat:true
    })
    sendChat('openchatroom',this.props.friend.username)
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
          otherusername:friend.username,
          othername:friend.name,
          otherpicture : friend.picture,
          chatId:json.chatId
        }
        sendChat('newchatlist',socketChatlist)
        this.activeSocket(json.chatid)
        this.props.changeName(friend,json.chatId,this.state.chatlog)
      })
    }
    else{
      this.props.changeName(friend,this.state.chatId,this.state.chatlog);
    }
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
