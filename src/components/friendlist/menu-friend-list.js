import React, { Component } from 'react';

import './friendlist.css';
import ChatList from '../chatlist/chat-list';
import {
  recieveSocket
}from "../../socket/socketconnect";

export default class SideNav extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Chats:{
              li:'selected-tab',
              tab:'show'
            },
            chatlist : this.props.chatlist
        }
    }

    componentDidMount(){
      this.socketChatList('chatlist'+this.props.myUser.username)
    }

    componentWillUnmount(){
      this.socketChatList('chatlist'+this.props.myUser.username)
    }

    socketChatList = (port) =>{
      recieveSocket(port,(err,recieve)=>{
        this.setState({
          chatlist:this.state.chatlist.concat(recieve)
        })
      })
    }

    updateSort = (time,chat) =>{
      for(var index in this.state.chatlist){
        if(this.state.chatlist[index].username === chat.username){
          var chatList = this.state.chatlist
          chatList.splice(index,1,{
            username:chat.username,
            name : chat.name,
            picture :chat.picture,
            chatId:chat.chatId,
            createdDate:time});
          this.setState({
            chatlist:chatList
          })
          break;
        }
      }
    }

    render() {
        const {Chats} = this.state
        const chatlist = this.state.chatlist;
        if(!chatlist){
          return null
        }
        const filteredListChat = chatlist.filter(
          (item) => {
            return (
              item.name.toLowerCase().indexOf(this.props.searchValue.toLowerCase()) !== -1
            );
          }
        );

        return (
          <div className = "menu-friend-container">
            <div className ={"menu-chat-list tab "+Chats.tab}>
                <div className = "chat-list-container">
                  <div className="chat-list-box">
                    <div className="chat-list-text">
                      {filteredListChat.map((chat) => (
                        <ChatList
                          search = {this.props.searchValue}
                          changeName = {this.props.changeName}
                          chat = {chat}
                          myUser = {this.props.myUser}
                          updateSort = {this.updateSort}
                          editfriendSocket = {this.editFriendChatSocket}
                          />
                        )
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        );
    }
}
