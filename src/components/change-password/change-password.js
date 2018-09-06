import React from 'react'
import './changepassword.css'
import {Modal,Button, Form, Dimmer,Loader} from 'semantic-ui-react';

import {Route,Link} from 'react-router-dom';


export default class ChangePassword extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      oldPass : '',
      newPass : '',
      confirmPass : '',
      oldPassValid : true,
      newPassValid : true,
      confirmPassValid : true,
      openModal : this.props.open,
      open : false,
      loadingButton : true
    }
  }
  handleInput = (event) =>{
    event.preventDefault()
    const name = event.target.name
    this.setState({
      [name] : event.target.value
    })
  }

  handleUserPassword = () =>{
    const oldPass = this.state.oldPass
    const newPass = this.state.newPass
    const confirmPass = this.state.confirmPass

    if(this.newPasswordValidation(newPass) &&
    this.confirmPasswordValidation(confirmPass,newPass)){
      this.updatePassword(oldPass,newPass,confirmPass)
    }
  }

  updatePassword = (oldPass, newPass, confirmPass) =>{
    this.setState({
      loadingButton : false
    })
    fetch ('/changepassword',{
      credentials : 'include',
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        oldPass : oldPass,
        newPass : newPass
      })
    }).then(res => res.json())
    .then(json => {
      if(json.success){
        window.location.reload()
        this.setState({
          open : false,
          oldPasswordError : json.message,
          oldPassValid : json.success,
          loadingButton : false
        })
        this.props.history.push('/ChatRoom')
      }
      else{
        this.setState({
          open : true,
          oldPasswordError : json.message,
          oldPassValid : json.success,
          loadingButton : true
        })
      }
    })
  }

  oldPasswordValidation = (oldPass) =>{
    if(!oldPass){
      this.setState({
        oldPassValid : false,
        oldPasswordError : "This field is required"
      })
      return false
    }
    else{
      this.setState({
        oldPassValid : false,
        oldPasswordError : ""
      })
      return true
    }
  }

  newPasswordValidation = (newPass) =>{
    if( newPass === ""){
      this.setState({
        newPassValid : false,
        newPasswordError : "This field is required"
      })
    }
    else if(newPass.length < 6){
      this.setState({
        newPassValid : false,
        newPasswordError : "Minimum password is 6 characters"
      })
      return false
    }
    else if(newPass.length >= 6){
      this.setState({
        newPassValid : true,
        newPasswordError : ""
      })
      return true
    }
  }

  confirmPasswordValidation = (confirmPass,newPass) =>{
    if(confirmPass == ""){
      this.setState({
        confirmPassValid : false,
        confirmPasswordError : "This field is required"
      })
    }
    else if(newPass !== confirmPass){
      this.setState({
        newPassValid : false,
        confirmPassValid : false,
        confirmPasswordError : "Password did not match"
      })
      return false
    }
    else if(newPass === confirmPass){
      this.setState({
        newPassValid : true,
        confirmPassValid : true,
        confirmPasswordError : ""
      })
      return true
    }
  }

  openModal = () =>{
    this.setState({
      open : true
    })
  }

  closeModal = () =>{
    const currentRoute = this.props.url
    this.setState ({
      open : false,
      oldPass : '',
      newPass : '',
      confirmPass : '',
      oldPassValid : true,
      oldPasswordError : "",
      newPassValid : true,
      newPasswordError : "",
      confirmPassValid : true,
      confirmPasswordError : "",
    })
    this.props.history.push(currentRoute)
  }

  render(){
    return(
      <Modal trigger={
            <li onClick = {this.props.onClick}>Change Password</li>
          }
        centered={false} size = "tiny"
        onClose = {this.closeModal}
        onOpen = {this.openModal}
        >
        <Modal.Header><center>Change Password</center></Modal.Header>
        <Form className = "changePassword-modal">
          <div className = "changePassword">
            <Form.Field className = {this.state.oldPassValid ? "" : "error"} required>
              <label>Old Password</label>
              <input
                placeholder='Username'
                type ='password'
                name = 'oldPass'
                value = {this.state.oldPass}
                onChange = {this.handleInput}
              />
            <div className = "errorMessagePassword">{this.state.oldPasswordError}</div>
            </Form.Field>
            <Form.Field className = {this.state.newPassValid ? "" : "error"} required>
              <label>New Password</label>
              <input
                placeholder='Username'
                type ='password'
                name = 'newPass'
                value = {this.state.newPass}
                onChange = {this.handleInput}
              />
            <div className = "errorMessagePassword">{this.state.newPasswordError}</div>
            </Form.Field>
            <Form.Field className = {this.state.confirmPassValid ? "" : "error"} required>
              <label>Confirm New Password</label>
              <input
                placeholder='Username'
                type ='password'
                name = 'confirmPass'
                value = {this.state.confirmPass}
                onChange = {this.handleInput}
              />
            <div className = "errorMessagePassword">{this.state.confirmPasswordError}</div>
            </Form.Field>
            {this.state.loadingButton ?
              <Button
                className = "buttonForm"
                type='submit'
                onClick = {this.handleUserPassword}
                disabled = {!this.state.oldPass && !this.state.newPass && !this.state.confirmPass}
                >CHANGE PASSWORD
              </Button> :
              <Button
                className = "buttonForm"
                type='submit'
                >
                <Loader
                  active inline ="centered"
                  size = "mini"/>
              </Button>}
          </div>
        </Form>
      </Modal>
    );
  }

}
