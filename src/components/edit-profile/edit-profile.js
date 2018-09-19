import React from 'react'
import './editprofile.css'
import {Image, Modal, Form, Button} from 'semantic-ui-react';
import profile from '../../picture/muka.jpg';

export default class EditProfile extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isOpen : false,
      name : this.props.name,
      email : this.props.email
    }
  }

  handleInput = (event) =>{
    const name = event.target.name

    this.setState({
      [name] : event.target.value
    })
  }

  handleUserInput = () =>{
    const name = this.state.name

    this.updateProfile(name)
  }

  updateProfile = (name) =>{
    fetch('/editprofile',{
      credentials : 'include',
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        name : name
      })
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        window.location.reload()
        this.props.history.push('/ChatRoom')
      }
      else{
        this.setState({
          success: false
        })
      }
    })
  }

  render(){
    return (
      <Modal
        trigger={
          <div className = "profileAndName">
            <img src={profile} className = "profileImage" alt=""/>
            <div className = "profileName">
              <b>{this.props.name}</b>
            </div>
          </div>
        }
        centered={false}
        id = "modalSize"
      >
        <Modal.Header>Profile</Modal.Header>
          <Form className = "formEditProfile">
            <Form.Field>
              <center>
                <div className= "containerImageProfile">
                  <label for = "changePicture">
                    <img src={profile} alt="" className = "imageEditProfile"/>
                  <div className = "textPosition">
                    <div className = "text"><b>Change Photo</b></div>
                  </div>
                  </label>
                  <input id = "changePicture" type = "file"/>
                </div>
              </center>
            </Form.Field>
            <Form.Field>
              <label> Name </label>
              <input
                value= {this.state.name}
                type ="text"
                name="name"
                onChange={this.handleInput}/>
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <input
                value = {this.state.email}
                type  = "text"
                name = "email"
                onChange={this.handleInput}
                readOnly/>
            </Form.Field>
            <Button
            className = "buttonForm"
            type='submit'
            onClick = {this.handleUserInput}
            >UPDATE PROFILE
            </Button>
          </Form>
      </Modal>
    );
  }
}
