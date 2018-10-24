import React, { Component } from 'react';
import './friendlist.css';
import FriendList from './friend-list';
import ChatList from '../chatlist/chat-list';
import {
  recieveChat
}from "../../socket/socketconnect";

export default class SideNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Friends:{
        li:'',
        tab:''
      },
      Chats:{
        li:'selected-tab',
        tab:'show',
      },
      friendlist:this.props.friendlist,
      chatlist:this.props.chatlist
    }
  }
  componentDidMount(){
    this.socketChat('chatlist'+this.props.myUser.username)
  }
  componentWillUnmount(){
    this.socketChat('chatlist'+this.props.myUser.username)
  }

  socketChat = (port) =>{
    recieveChat(port,(err,recieve)=>{
      this.setState({
        chatlist:this.state.chatlist.concat(recieve)
      })
    })
  }

  changeTab(tabName) {
    if(tabName === 'Friends'){
      this.setState({
        Friends:{
          li:'selected-tab',
          tab:'show'  
        },
        Chats:{
          li:'',
          tab:''
        }
      })
    }else{
      this.setState({
        Friends:{
          li:'',
          tab:''
        },
        Chats:{
          li:'selected-tab',
          tab:'show'
        },
      })
    }
  }
  render() {
      const { Friends, Chats} = this.state
      const friendlist = this.state.friendlist;
      if(!friendlist){
        return null
      }
      const filteredfriend = friendlist.filter(
        (item) => {
          return (
            item.name.toLowerCase().indexOf(this.props.searchValue.toLowerCase()) !== -1
          );
        }
      );
      const chatlist = this.state.chatlist;
      if(!chatlist){
        return null
      }
      const filteredchat = chatlist.filter(
        (item) => {
          return (
            item.name.toLowerCase().indexOf(this.props.searchValue.toLowerCase()) !== -1
          );
        }
      );
      return (
        <div className = "menu-friend-container">
              <div className = "menu-friend-box">
                <li onClick={() => this.changeTab('Friends')} className = {"li-friends " + Friends.li}>
                    Friends
                </li>
                <li onClick={() => this.changeTab('Chats')} className = {"li-chats " + Chats.li}>
                    Chats
                </li>
              </div>
              <div className = {"menu-friend-list tab "+Friends.tab}>
                <div className = "friend-list-container">
                  <div className="friend-list-box" onClick = {this.props.onClick}>
                    <div className="friend-list-text">
                    {filteredfriend.map((friend) => (
                      <FriendList
                        open = {this.props.open}
                        changeName = {this.props.changeName}
                        friend = {friend}
                        chatlist  = {this.state.chatlist}
                        myUser = {this.props.myUser}
                        key = {friend._id}
                        />
                      )
                    )}
                    </div>
                  </div>
                </div>
              </div>
              <div className ={"menu-chat-list tab "+Chats.tab}>
                <div className = "chat-list-container">
                  <div className="chat-list-box">
                    <div className="chat-list-text">
                      {filteredchat.map((chat) => (
                        <ChatList
                          changeName = {this.props.changeName}
                          chat  = {chat}
                          key = {chat._id}
                          />
                        ))
                      }
                      </div>
                    </div>
                  </div>
              </div>
        </div>

      );
  }
}
