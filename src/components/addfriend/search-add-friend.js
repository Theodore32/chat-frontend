import React from 'react';
import './addfriend.css';
import icon from '../../picture/search.png';

export default class SearchFriend extends React.Component{

  render(){
    return(
      <div>
        <input
          type = "text"
          className = "searchfriend"
          placeholder = "Search Add Friend"
          value = {this.props.search}
          onChange = {this.props.onChange}/>
        <img src = {icon} alt=""/>
      </div>
    );
  }
}
