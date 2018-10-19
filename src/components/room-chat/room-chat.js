import React from 'react';
import './room-chat.css';
import Profile from '../profile/profile';
import SearchFriend from '../searchfriend/search-friend';
import MenuFriendList from'../friendlist/menu-friend-list';
import HeaderChat from '../header-roomchat/header';
import Content from '../content/content';
import {
  sendChat
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
      open : false
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
        console.log(json);
        this.setState({
          account:json.akun,
          isLoading:false
        })
      }
    })
  }

  openChatRoom = (item,chatId,log) => {
    if(item !== null){
      if(this.state.username !== item.username ){
        sendChat('closechatroom',this.state.username);
      }
      this.setState({
      name : item.name,
      isOpen : true,
      username:item.username,
      picture : item.picture,
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
                recieve={this.state.name}
                chatId = {this.state.chatId}
                time = {this.state.time}
              />
            </div>
          }
          <div className = "left-column">
              <Profile
                togglePopup = {this.togglePopup}
                history = {this.props.history}
                isClose = {this.state.isOpen}
                name = {account.name}
                email = {account.email}
                status = {account.description}
                profilePicture = {account.profilePicture}
                url = {this.props.match.url}
                change={this.afterchange}
                close = {this.state.isOpen}
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
                myUser = {{username:account.username,name:account.name}}
              />
          </div>
        </div>
      </div>
    );
  }
}
