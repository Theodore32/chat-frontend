import React from 'react'
import './profile.css'

import SettingProfile from '../settingprofile/setting-profile'
import EditProfile from '../edit-profile/edit-profile'
import {Image, Modal, Form, Button} from 'semantic-ui-react'
import profile from '../../picture/muka.jpg'
import setting from '../../picture/menu.png'

 export default class Profile extends React.Component{
  constructor(props){
    super(props)
      this.state = {
        isOpen : false,
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
     console.log("isOpen : "+this.state.isOpen);
     return(
      <div className = "profile-container" >
        <div className = "profileImageClick">
          <EditProfile
            name = {this.props.name}
            email = {this.props.email}
            profilePicture = {this.props.profilePicture}/>
        </div>
        <div className = "profile-setting-icon-position">
          <img src = {setting} className = "setting-icon" onClick = {this.handleOpen} alt="" />
        </div>
        {this.state.isOpen ?
        <SettingProfile
          modal = {this.state.showPopup}
          click = {this.handleOpen}
          open = {this.state.isOpen}
          url = {this.props.url}
          history = {this.props.history}
        />
      : <SettingProfile
          open = {this.state.isOpen}
          url = {this.props.url}
          history = {this.props.history}/>}
      </div>
     );
   }
 }
