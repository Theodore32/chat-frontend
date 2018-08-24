import React from 'react';
import './profile.css';
import AddFriend from '../addfriend/add-friend';

import {Image, Modal, Form, Button} from 'semantic-ui-react';
import profile from '../../picture/muka.jpg';
import setting from '../../picture/menu.png';

 export default class Profile extends React.Component{
  constructor(props){
    super(props)
      this.state = {
        isOpen : this.props.isClose,
        showPopup : 'popup-show',
        name : this.props.name,
        email : this.props.email
      }
   }

  handleChange = (event) =>{
    const inputUser = event.target.name
    this.setState({
      [inputUser] : event.target.value
    })
  }

  handleOpen = () => {
      this.setState(prevState => (
        {
          isOpen : !prevState.isOpen
        }
      )
    )
  }

   render(){
     console.log("Name : "+this.state.name);
     console.log("Email : "+this.state.email);
     return(
      <div className = "profile-container" >
        <div className = "profileImageClick">
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
                      onChange={this.handleChange}/>
                  </Form.Field>
                  <Form.Field>
                    <label>Email</label>
                    <input
                      value = {this.state.email}
                      type  = "text"
                      name = "email"
                      onChange={this.handleChange}/>
                  </Form.Field>
                  <Button
                  className = "buttonForm"
                  type='submit'
                  >UPDATE PROFILE
                  </Button>
                </Form>
            </Modal>
        </div>
        <div className = "profile-setting-icon-position">
          <img src = {setting} className = "setting-icon" onClick = {this.handleOpen} alt="" />
        </div>
        {this.state.isOpen ?
        <AddFriend
          modal = {this.state.showPopup}
          click = {this.handleOpen}
          history = {this.props.history}/>
        : <AddFriend/>}
      </div>
     );
   }
 }
