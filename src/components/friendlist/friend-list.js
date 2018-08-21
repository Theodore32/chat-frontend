import React from 'react';
import './friendlist.css';
import {
  recieveChat
}from "../../socket/socketconnect"


export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      chatlog:[]
    }

    this.activeSocket = this.activeSocket.bind(this)
  }
  componentDidMount(){
      this.activeSocket(this.props.item.username)
  }
  componentWillUnmount(){
    this.activeSocket(this.props.item.username)
  }
  activeSocket(port){
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlog:this.state.chatlog.concat({send:recieve.send,message:recieve.message.message,sender:recieve.message.reciever,reciever:recieve.message.sender})
      })
      this.props.changeName(null,this.state.chatlog)
    })
  }

  render(){
    const item = this.props.item;
    return(
      <li className = "friend-list-text"
        onClick={() =>
          this.props.changeName(item,this.state.chatlog)
        }
      >
        {item.name}
      </li>
    );
  }
}
