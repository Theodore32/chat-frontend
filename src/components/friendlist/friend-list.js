import React from 'react';
import './friendlist.css';
import {
  recieveChat
}from "../../socket/socketconnect"


export default class FriendList extends React.Component{

    this.state = {
      chatlog:[]
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
    }).then(res => res.json())
    .then(res=>{
      console.log(res);
    })
  }
  render(){
    const friend = this.props.friend;
    return(
      <li
        onClick={() =>
          this.props.changeName(friend,this.state.chatlog)
        }
      >
      <div className = "friend-list-picture">
        <img src ={friend.picture}/>
        {friend.name}
      </div>
      </li>
    );
  }
}
