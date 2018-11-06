import React from 'react';
import './blockedfriends.css';

import SearchBlockFriend from './search-block-friend'
import {Modal} from 'semantic-ui-react';
import {
  recieveSocket
}from "../../socket/socketconnect";

export default class AddFriend extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false,
      search : '',
      blocklist : this.props.blocklist
    }
  }

  componentDidMount(){
    this.socketBlock('blockfriend'+this.props.username);
  }

  componentWillUnmount(){
    this.socketBlock('blockfriend'+this.props.username);
  }

  socketBlock = (port) =>{
    recieveSocket(port,(err,recieve)=>{
      this.setState({
        blocklist : this.state.blocklist.concat(recieve)
      })
    })
  }

   show = (size,name) => {
     this.setState(
       {
         size,
         open: true,
         name : name
       }
     )
   }

   close = () => {
     this.setState({ open: false })
   }

   inputSearch = (e) =>{
     this.setState ({
       search : e.target.value
     })
   }

   closeModal = () =>{
     this.setState({
       search : ''
     })
   }

  render(){
    const { open, size } = this.state;
    const blockfriend = this.state.blocklist;
    const filteredBlockList = blockfriend.filter(
      (block) => {
        return (
          block.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        );
      }
    );
    return(
      <Modal trigger={
            <li onClick = {this.props.click}>
              Blocked Friends
            </li>}
        centered={false} size = "mini" className = "blockfriend-modal" onClose = {this.closeModal}>
        <Modal.Header><center>Manage blocked users</center></Modal.Header>
        <div className = "searchBlockFriend">
          <SearchBlockFriend
            onChange = {this.inputSearch}
            search = {this.state.value}/>
        </div>
        <div className = "blockfriend-box">
            {filteredBlockList.map((block) =>(
                  <li key = {block.id} className = "blockfriend-text">{block.name}
                    <button className = "blockfriend-button-setting" onClick = {() => {this.show('mini',block.name)}}>
                      <div className = "blockfriend-button-text">
                        <b>Unblock</b>
                      </div>
                    </button>
                  </li>
                )
              )
            }
        </div>
      </Modal>
    );
  }
}
