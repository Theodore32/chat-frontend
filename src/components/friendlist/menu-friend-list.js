import React, { Component } from 'react';

import './friendlist.css';
import FriendList from './friend-list';
import ChatList from '../chatlist/chat-list';
import {
  recieveSocket
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
            friendlist : this.props.friendlist,
            blocklist : this.props.blocklist,
            notif : 0
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
            tab:'show',
            notif : "notif-color"
          },
        })
      }
    }

    componentDidMount(){
      this.socketNewFriend('newfriend'+this.props.myUser.username)
      this.socketChatList('chatlist'+this.props.myUser.username)
    }

    componentWillUnmount(){
      this.socketNewFriend('newfriend'+this.props.myUser.username)
      this.socketChatList('chatlist'+this.props.myUser.username)
    }

    notifTotal = (total) =>{
      this.setState({
        notif:this.state.notif + total
      })
    }

    notifMinus = (total) =>{
      this.setState({
        notif:this.state.notif - total
      })
    }

    editFriendChatSocket=(data)=>{
      for(var index in this.state.friendlist){
        if(this.state.friendlist[index].username === data.username){
          var friend = this.state.friendlist
          friend.splice(index,1,{username: data.username, name : data.name, picture : data.photo, description : data.description});
          this.setState({
            friendlist:friend
          })
        }
      }
      for(var index in this.state.chatlist){
        if(this.state.chatlist[index].username === data.username){
          var chatList = this.state.chatlist
          chatList.splice(index,1,{username: data.username, name : data.name, picture : data.photo,chatId:this.state.chatlist[index].chatId});
          this.setState({
            chatlist:chatList
          })
        }
      }
    }

    socketChatList = (port) =>{
      recieveSocket(port,(err,recieve)=>{
        this.setState({
          chatlist:this.state.chatlist.concat(recieve)
        })
      })
    }

    socketNewFriend = (port) =>{
      recieveSocket(port, (err,recieve)=>{
        this.setState({
          friendlist : this.state.friendlist.concat(recieve)
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

    sortFriend = (array) =>{
      return array.sort(function (a,b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return ((x < y) ? -1 :((x > y) ? 1 : 0));
      })
    }

    render() {
        const { Friends, Chats} = this.state
        const friendlist = this.sortFriend(this.state.friendlist);
        const blocklist = this.state.blocklist;
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
                      FRIENDS
                  </li>
                  <li onClick={() => this.changeTab('Chats')} className = {"li-chats " + Chats.li}>
                      <p>CHATS</p>
                      <div>
                        {this.state.notif == 0 ?
                          null
                          :this.state.notif <= 9 ?
                          <div className = {"chat-notif-oneNumber "+Chats.notif}>
                            {this.state.notif}
                          </div>
                          : this.state.notif <= 99 ?
                          <div className = {"chat-notif-twoNumber "+Chats.notif}>
                            {this.state.notif}
                          </div>
                          : this.state.notif <= 999 ?
                          <div className = {"chat-notif-threeNumber "+Chats.notif}>
                            {this.state.notif}
                          </div>
                          :
                          <div className = {"chat-notif-threeNumberPlus "+Chats.notif}>
                            999+
                          </div>
                        }
                      </div>
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
                          blocklist = {blocklist}
                          notifTotal = {this.notifTotal}
                          editfriendSocket = {this.editFriendChatSocket}
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
                              myUser = {this.props.myUser}
                              notifTotal = {this.notifTotal}
                              notifMinus = {this.notifMinus}
                              updateSort = {this.updateSort}
                              blocklist = {blocklist}
                              checkReadChat = {this.props.checkReadChat}
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
