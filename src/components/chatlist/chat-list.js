import React from 'react';
import './chatlist.css';

import gambar from '../../picture/boy.png';

export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      location: [
        {
            id: 0,
            title: 'New York',
            selected: false,
            key: 'location',
            message : 'asd'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location',
          message : 'asd'
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location',
          message : 'asd'
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location',
          message : 'asd'
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location',
          message : 'asd'
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location',
          message : 'asd'
        }
      ]
    }
  }

  render(){
    const list = this.state.location;
    const filteredList = list.filter(
      (item) => {
        return (
          item.title.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1
        );
      }
    );

    return(
        <div className = "chat-list-container">
          <div className="chat-list-box">
            <div className="chat-list-text">
              {filteredList.map((chat) => (
                      <li className = "chat-list-text" key={chat.id}
                        onClick={() =>
                          this.props.changeName(chat.title)
                        }
                      >
                      <div className = "chat-list-picture">
                        <img src = {gambar}/>
                      </div>
                      <div className = "friend-name">
                        {chat.title}
                      </div>
                      <div className = "lastMessageText">
                        {chat.message}
                      </div>
                      </li>
                  )
                )
              }
            </div>
          </div>
        </div>
    );
  }
}
