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
              li:'selected-tab',
              tab:'show'
            },
            Chats:{
              li:'',
              tab:''
            },
            chatlist : this.props.chatlist,
            friendlist : this.props.friendlist
        }
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

    componentDidMount(){
      this.socketChat('chatlist'+this.props.myUser.username)
    }
    componentWillUnmount(){
      this.socketChat('chatlist'+this.props.myUser.username)
    }

    socketChat = (port) =>{
      recieveChat(port,(err,recieve)=>{
        console.log("receive: ",recieve);
        this.setState({
          chatlist:this.state.chatlist.concat(recieve)
        })
      })
    }

    render() {
        const { Friends, Chats} = this.state
        const friendlist = this.state.friendlist;
        const chatlist = this.state.chatlist;

        if(!friendlist){
          return null
        }
        const filteredListFriend = friendlist.filter(
          (item) => {
            return (
              item.name.toLowerCase().indexOf(this.props.searchValue.toLowerCase()) !== -1
            );
          }
        );

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
                      {filteredListFriend.map((friend) => (
                        <FriendList
                          open = {this.props.open}
                          changeName = {this.props.changeName}
                          friend = {friend}
                          key = {friend._id}
                          myUser = {this.props.myUser}
                          description = {this.props.description}
                          chatId = {this.props.chatId}
                          chatlist = {this.state.chatlist}
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
                          {filteredListChat.map((chat) => (
                            <ChatList
                              search = {this.props.searchValue}
                              changeName = {this.props.changeName}
                              chat = {chat}
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
