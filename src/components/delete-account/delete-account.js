import React from 'react';
import './deleteaccount.css';
import {Modal} from 'semantic-ui-react';

import {
  sendSocket
}from "../../socket/socketconnect";

export default class DeleteAccount extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      open : false,
    }
  }

  deleteAccount = () =>{
    fetch('/deleteAccount',{
      credentials : 'include',
      method:'DELETE'
    }).then(res => res.json())
      .then(response =>{
        if(response.success){
          let data = {
            photo : response.picture,
            username : response.username,
            description : response.description,
            name : response.name
          }
          sendSocket("editprofile",data)
          this.props.history.push('/')
        }
    })
  }

  openModal = () =>{
    this.setState({
      open : true
    })
  }

  close = () => {
    this.setState({
      open: false
    })
  }


  render(){
    const {open} = this.state;
    return(
      <Modal trigger={
            <li onClick = {this.props.onClick}>Delete Account</li>
          }
        centered={false} size = "tiny"
        onOpen = {this.openModal}
        onClose={this.close}
        open={open}
        >
        <Modal.Header><center>Are you sure you want to delete your account?</center></Modal.Header>
        <div className = "deleteModal">
          <button onClick = {this.deleteAccount} className = "yesButton">Yes, I want to delete this account</button>
          <button onClick = {this.close} className = "noButton">No, I want to go back</button>
        </div>
      </Modal>
    )
  }
}
