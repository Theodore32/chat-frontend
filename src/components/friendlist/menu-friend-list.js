import React, { Component } from 'react';

import './friendlist.css';
import FriendList from './friend-list';
<<<<<<< HEAD
import Chatlist from './chat-list';
import GroupList from '../chatlist/chat-list';
=======
import ChatList from '../chatlist/chat-list';
>>>>>>> b5ae80a0ddf2b74bb94fc108b2401e1e1fd7e6a9

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
    render() {
        const { Friends, Chats} = this.state
        const list = this.props.friendlist;
        if(!list){
          return null
        }
        const filteredList = list.filter(
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
                    <div className="friend-list-box">
                      <div className="friend-list-text">
                      {filteredList.map((friend) => (
                        <FriendList
                          changeName = {this.props.changeName}
                          friend = {friend}
                          key = {friend._id}
                          />
                        )
                      )}
                      </div>
                    </div>
                  </div>
                </div>
<<<<<<< HEAD
                <div className ={"menu-group-list tab "+Chats.tab}>
                  <Chatlist />
=======
                <div className ={"menu-chat-list tab "+Chats.tab}>
                  <div>
                      <ChatList
                        search = {this.props.searchValue}
                        changeName = {this.props.changeName}
                        />
                  </div>
>>>>>>> b5ae80a0ddf2b74bb94fc108b2401e1e1fd7e6a9
                </div>
          </div>

        );
    }
}
