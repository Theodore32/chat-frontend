import React from 'react';
import './room-chat.css';
import Profile from '../profile/profile';
import SearchFriend from '../searchfriend/search-friend';
import MenuFriendList from'../friendlist/menu-friend-list';
import HeaderChat from '../header-roomchat/header';
import Content from '../content/content';
import RequestFriend from '../requestFriend/requestFriend';
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
      ulang:[],
      account:[],
      chatlog:[],
      open : false,
      checkrequest:false,
      readStatus : false
    }
    this.escClicked = this.escClicked.bind(this)
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

  afterchange = () =>{
    this.setState({
      isLoading:true
    })
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

  checkrequestfriend = (flag) =>{
    if(flag === 1 ){
      this.setState({
        checkrequest:true
      })
    }
    else{
      this.setState({
        checkrequest:false
      })
    }
  }

  checkReadChat = (readStatus) =>{
    this.setState({
      readStatus : readStatus
    })
  }

  openChatRoom = (item,chatId,log) => {
    if(item !== null){
      if(this.state.username !== item.username){
        sendSocket('closechatroom',this.state.username);
        sendSocket('changechatroom');
      }
      this.setState({
      name : item.name,
      isOpen : true,
      username:item.username,
      picture : item.picture,
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

  escClicked(){
    this.setState({
      isOpen:false
    })
  }

  render(){
    const {account,isLoading,chatlist} = this.state
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
              <RequestFriend
                request = {this.state.checkrequest}
                otherUser = {
                  {
                    username : this.state.username,
                    name : this.state.name,
                    picture : this.state.picture,
                    description : this.state.description
                  }
                }
                myUser = {
                  {
                    username : account.username
                  }
                }
                checkrequestfriend = {this.checkrequestfriend}
              />
              <Content
                escClicked = {this.escClicked}
                chatlog = {this.state.chatlog}
                senderUsername = {account.username}
                sender={account.name}
                recieve={this.state.username}
                chatId = {this.state.chatId}
                time = {this.state.time}
                checkrequest = {this.state.checkrequest}
                readStatus = {this.state.readStatus}
              />
            </div>
          }
          <div className = "left-column">
              <Profile
                togglePopup = {this.togglePopup}
                history = {this.props.history}
                isClose = {this.state.isOpen}
                username = {account.username}
                name = {account.name}
                email = {account.email}
                status = {account.description}
                profilePicture = {account.profilePicture}
                url = {this.props.match.url}
                change={this.afterchange}
                close = {this.state.isOpen}
                blocklist = {account.blacklist}
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
                friendlist = {account.friends}
                chatlist = {account.chatList}
                description = {account.description}
                chatId = {this.state.chatId}
                blocklist = {account.blacklist}
                myUser = {
                  {
                    username:account.username,
                    name:account.name,
                    picture : account.profilePicture,
                    friend : account.friends,
                    description : account.description
                  }
                }
                checkReadChat = {this.checkReadChat}
              />
          </div>
        </div>
      </div>
    );
  }
}
