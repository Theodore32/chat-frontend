import React from 'react'
import './editprofile.css'
import {Image, Modal, Form, Button} from 'semantic-ui-react';
import profile from '../../picture/boy.png';
import notSupported from '../../picture/notSupported.png';
import {
  sendSocket
}from "../../socket/socketconnect";

export default class EditProfile extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isOpen : false,
      name : this.props.name,
      email : this.props.email,
      currentPhoto : this.props.profilePicture,
      status : this.props.status,
      changePhoto : []
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
    const photo = this.state.changePhoto
    const status = this.state.status
    this.updateProfile(name,photo,status)
  }

  updateProfile = (name,photo,status) =>{
    this.setState({
      error : ''
    })

    var formData = new FormData();

    formData.append ('Image', photo)
    formData.append ('name', name)
    formData.append ('description', status)

    fetch('/editprofile',{
      credentials : 'include',
      method : "PUT",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        console.log(response.photo);
        let data;
        if(response.photo){
          data = {
            photo : response.photo,
            username : this.props.username,
            description : status,
            name : name
          }
        }
        else {
          data = {
            photo : this.props.profilePicture,
            username : this.props.username,
            description : status,
            name : name
          }
        }
        sendSocket("editprofile",data)
        this.props.change()
      }
      else{
        this.setState({
          success: false,
          currentPhoto : this.state.currentPhoto,
          error : response.message
        })
      }
    })
  }

  fileSelectedHandler = (event) => {
    event.preventDefault();
    console.log(event);
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      document.getElementById("coverPhoto").setAttribute('src', reader.result)
      this.setState({
        changePhoto: file,
        imagePreviewUrl: reader.result
      })
    }
    if(file){
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }
    return (
      <Modal trigger={
            <li onClick = {this.props.click}>
              Edit Profile
            </li>}
        centered={false}
        id = "modalSize"
        className = "addfriend-modal">
        <Modal.Header>Profile</Modal.Header>
          <Form className = "formEditProfile">
            <Form.Field>
              <center>
                <div className= "containerImageProfile">
                  <label for = "changePicture">
                    {$imagePreview ?
                      this.state.changePhoto.type === "image/jpeg" || this.state.changePhoto.type === "image/jpg" || this.state.changePhoto.type === "image/gif" || this.state.changePhoto.type === "image/png" ?
                        <Image id = "coverPhoto" src={imagePreviewUrl} alt="" className = "imageEditProfile" onChange = {this.fileSelectedHandler}/>
                        :
                        <Image id = "coverPhoto" src={notSupported} alt="" className = "imageEditProfile" onChange = {this.fileSelectedHandler}/>
                      :
                    <Image id = "coverPhoto" src={this.state.currentPhoto} alt="" className = "imageEditProfile" onChange = {this.fileSelectedHandler}/>
                    }
                  <div className = "textPosition">
                    <div className = "text"><b>Change Photo</b></div>
                  </div>
                  </label>
                  <input id = "changePicture" type = "file" onChange = {this.fileSelectedHandler}/>
                  {this.state.error ?
                    <div className = "errorImageType">
                      {this.state.error}
                    </div>
                    :
                    null
                  }
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
              <label>Status Message</label>
              <input
                value = {this.state.status}
                type  = "text"
                name = "status"
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
            id = "updateProfileButton"
            type='submit'
            onClick = {this.handleUserInput}
            >UPDATE PROFILE
            </Button>
          </Form>
      </Modal>
    );
  }
}
