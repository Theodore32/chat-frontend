import React from 'react'
import './editprofile.css'
import {Image, Modal, Form, Button} from 'semantic-ui-react';
import profile from '../../picture/boy.png';
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

    var formData = new FormData();

    formData.append ('Image', photo)
    formData.append ('name', name)
    formData.append ('description', status)

    console.log("Nama : ",name);
    console.log("foto : ",photo);
    console.log("status : ",status);

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

        // window.location.reload()
        // this.props.history.push('/ChatRoom')
      }
      else{
        this.setState({
          success: false
        })
      }
    })
  }

  fileSelectedHandler = (event) => {
        // Check kalo ada file nya (image)

        if (event.target.files[0] != null){
            // ini buat get image nya
            this.setState({
                changePhoto: event.target.files[0]
            });

            // manage tampilan view pake javascript
            if(event.target.files[0]){
                var reader = new FileReader();
                // ketika image nya ke load
                reader.onload = (event) => {
                    document.getElementById("coverPhoto").setAttribute('src', reader.result)
                }
                // iniii let the browser get data nya
                reader.readAsDataURL(event.target.files[0]);
            }
        } else {
            console.log("No data on the field..");
        }
        console.log("photo: ", event.target.files);
    }

    changePicture = () =>{
      let imageUrl = '';
      let imagedisplay
        if(imageUrl !== ''){
          return(<img alt=" " src={require(`../../uploads/${imageUrl}`)} />)
        }
        else{
          return(<h2>No Image</h2>)
        }
    }

  render(){
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
                    {this.state.changePhoto
                      ?   <Image id = "coverPhoto" src={this.state.currentPhoto} alt="" className = "imageEditProfile" onChange = {this.fileSelectedHandler}>
                    </Image> :
                    <Image id = "coverPhoto" src={profile} alt="" className = "imageEditProfile" onChange = {this.fileSelectedHandler}>
                    </Image>
                    }
                  <div className = "textPosition">
                    <div className = "text"><b>Change Photo</b></div>
                  </div>
                  </label>
                  <input id = "changePicture" type = "file" onChange = {this.fileSelectedHandler}/>
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
