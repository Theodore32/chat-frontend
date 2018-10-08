import React from 'react';
import './friendlist.css';
import {
  recieveChat
}from "../../socket/socketconnect";
import {Modal, Button} from 'semantic-ui-react';
import chat from '../../picture/chat.png'
import block from '../../picture/block.png'


export default class FriendList extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      chatlog:[],
      open : false
    }

    this.activeSocket = this.activeSocket.bind(this)
  }
  componentDidMount(){
      this.activeSocket(this.props.friend.name)
  }
  componentWillUnmount(){
    this.activeSocket(this.props.friend.name)
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({send:recieve.send,message:recieve.message.message,sender:recieve.message.reciever,reciever:recieve.message.sender})
      })
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


  openChatRoom = (friend) =>{
    this.close()
    this.props.changeName(friend,this.state.chatlog)
  }

  render(){
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
            ASDASDASD
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
