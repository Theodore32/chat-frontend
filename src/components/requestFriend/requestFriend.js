import React from 'react';
import './requestFriend.css';

import {
  sendSocket,
  recieveSocket
}from "../../socket/socketconnect";

export default class RequestFriend extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showRequest : false
    }
  }

  componentDidMount(){
    this.checkRequest(this.props.otherUser.username);
    this.changeChatroomSocket();
  }

  changeChatroomSocket(){
    recieveSocket ('changechatroom',(err,recieve) =>{
      this.setState({
        showRequest : false
      })
      this.checkRequest(this.props.otherUser.username);
    })
  }

  checkRequest = (username) => {
    fetch('/check',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username : username
      }),
    }).then (res => res.json())
    .then(response => {
      if(!response.success){
        this.setState({
          showRequest : response.requested
        })
        this.props.checkrequestfriend(1)
      }else{
        this.setState({
          showRequest : response.requested
        })
        this.props.checkrequestfriend(0)
      }
    })
  }

  add = (event) => {
   event.preventDefault()
   const data = {
     myUsername : this.props.myUser.username,
     username : this.props.otherUser.username,
     name : this.props.otherUser.name,
     picture : this.props.otherUser.picture,
     description : this.props.otherUser.description
   }
   fetch('/add',{
     credentials:'include',
     method:'PUT',
     headers:{
       'Content-Type' : 'application/json'
     },
     body:JSON.stringify({
       data : data
     })
   }).then(res => res.json())
   .then(res=>{
     this.setState({
       showRequest : false
     })
     this.props.checkrequestfriend(0);
     sendSocket('newfriend',data);
   })
 }

 block = (event) => {
   event.preventDefault()
   const data = {
     myUsername : this.props.myUser.username,
     username : this.props.otherUser.username,
     name : this.props.otherUser.name,
     picture : this.props.otherUser.picture,
     description : this.props.otherUser.description
   }

   fetch('/block',{
     credentials:'include',
     method:'PUT',
     headers:{
       'Content-Type' : 'application/json'
     },
     body:JSON.stringify({
       data : data
     })
   }).then(res => res.json())
   .then(res=>{
     this.setState({
       showRequest : false
     })
     this.props.checkrequestfriend(0);
     sendSocket('blockfriend',data);
     sendSocket('blockchat',data.username);
   })
 }

  render(){
    if(!this.state.showRequest){
      return null;
    }
    else{
      return (
        <div className = "requestContainer">
          <div className = "requestFriendBox">
            <div className = "Add-Button" onClick = {this.add}>
              <p>ADD</p>
            </div>
            <div className = "Divider">
              |
            </div>
            <div className = "Block-Button" onClick = {this.block}>
              <p>BLOCK</p>
            </div>
          </div>
        </div>
      )
    }
  }
}
