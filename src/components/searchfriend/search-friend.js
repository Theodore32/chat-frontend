import React from 'react';
import './searchfriend.css';
import icon from '../../picture/search.png';

export default class SearchFriend extends React.Component{

  render(){
    return(
      <div>
        <input
          type = "text"
          className = "searchfriend"
          placeholder = "Search or start new chat"
          value = {this.props.search}
          onChange = {this.props.onChange}/>
        <img src = {icon} alt=""/>
      </div>
    );
  }
}
