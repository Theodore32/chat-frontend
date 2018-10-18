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
      chated : false
    }

    this.activeSocket = this.activeSocket.bind(this)
  }

  componentDidMount(){
    for(var chat in this.props.chatlist){
      if(this.props.chatlist[chat].username === this.props.friend.username){
        this.activeSocket(this.props.chatlist[chat].chatId)
        this.setState({
          chated:true,
          chatId : this.props.chatlist[chat].chatId
        })
        break;
      }
    }
  }

  componentWillUnmount(){
    this.activeSocket(this.props.friend.name)
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({send:recieve.send,message:recieve.message.message,sender:recieve.message.reciever,reciever:recieve.message.sender})
      })
      this.props.changeName(null,this.props.chatId,this.state.chatlog)
    })
  }

  openChatRoom = (friend) =>{
    this.close()
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
          chatlog: json.message,
          chatId : json.chatId,
          chated:true
        })
        let socketChatlist = {
          myusername:this.props.myUser.username,
          myname:this.props.myUser.name,
          otherusername:friend.username,
          othername:friend.name,
          chatId:json.chatId
        }
        sendChat('newchatlist',socketChatlist)
        this.activeSocket(json.chatid)
        this.props.changeName(friend,this.state.chatId,this.state.chatlog)
      })
      console.log(this.state.chatId);
    }
    else{
      this.props.changeName(friend,this.state.chatId,this.state.chatlog)
    }
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
