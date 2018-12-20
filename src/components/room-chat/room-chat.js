import React from 'react';
import './room-chat.css';
import Profile from '../profile/profile';
import SearchFriend from '../searchfriend/search-friend';
import MenuFriendList from'../friendlist/menu-friend-list';
import HeaderChat from '../header-roomchat/header';
import Content from '../content/content';
import {
  sendSocket
}from "../../socket/socketconnect";

export default class RoomChat extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      name : '',
      search : '',
      isOpen : false,
      isLoading: true,
      account:[],
      chatlog:[]
    }
  }

  componentDidMount(){
       fetch('/getdata',{
         credentials:'include'
       })
       .then(res => res.json())
       .then(json => {
         if(!json.success){
           this.props.history.push('/')
         }
         else{
           this.setState({
             account:json.akun,
             isLoading:false
           })
         }
       })
  }

  openChatRoom = (item,chatId,log) => {
    if(item !== null){
      if(this.state.chatId !== chatId){
        sendSocket('closechatroom',this.state.chatId);
        sendSocket('changechatroom');
      }
      this.setState({
      name : item.name,
      isOpen : true,
      username:item.username,
      picture : item.profilePicture,
      description : item.description,
      chatId : chatId,
      chatlog : log
      })
    }
    else{
      this.setState({
        chatlog:log
      })
    }
  }

  inputSearch = (e) =>{
    this.setState ({
      search : e.target.value
    })
  }

  escClicked = () => {
    this.setState({
      isOpen:false
    })
  }

  render(){
    const {account,isLoading} = this.state
    if(isLoading){
      return(
        <div>Loading.....</div>
      )
    }
    return (
      <div className = "background-top">
        <div className = "container-page" onClick = {this.closeSetting}>
          {!this.state.isOpen?
            <div className = "rightColumn">
            </div>
            :
            <div className = "rightColumn">
              <HeaderChat
                name = {this.state.name}
                picture = {this.state.picture}
              />
              <Content
                escClicked = {this.escClicked}
                chatlog = {this.state.chatlog}
                senderUsername = {account.username}
                sender={account.name}
                recieve={
                  {
                    username : this.state.username,
                    name : this.state.name
                  }
                }
                chatId = {this.state.chatId}
                time = {this.state.time}
                checkrequest = {this.state.checkrequest}
                readStatus = {this.state.readStatus}
              />
            </div>
          }
          <div className = "left-column">
              <Profile
                history = {this.props.history}
                name = {account.name}
                profilePicture = {account.profilePicture}
              />
              <div className = "searchBarContent">
                <SearchFriend
                  search = {this.state.search}
                  onChange = {this.inputSearch}
                />
              </div>
              <MenuFriendList
                changeName={this.openChatRoom}
                searchValue = {this.state.search}
                chatlist = {account.chatList}
                myUser = {
                  {
                    username:account.username,
                    name:account.name,
                    picture : account.profilePicture,
                    friend : account.friends,
                    description : account.description
                  }
                }
              />
          </div>
        </div>
      </div>
    );
  }
}
