import React from 'react';
import './blockedfriends.css';
import icon from '../../picture/search.png';

export default class BlockFriend extends React.Component{

  render(){
    return(
      <div>
        <input
          type = "text"
          className = "searchBlockFriend"
          placeholder = "Search blocked users"
          value = {this.props.search}
          onChange = {this.props.onChange}/>
        <img src = {icon} alt=""/>
      </div>
    );
  }
}
