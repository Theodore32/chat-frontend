import React from 'react';
import './profile.css';

import SettingProfile from '../settingprofile/setting-profile';
import ShowProfilePicture from '../showPicture/showProfilePicture/show-profile-picture';
import setting from '../../picture/menu.png';

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
     return(
      <div className = "profile-container" >
        <div className = "profileImageClick">
          <ShowProfilePicture
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
          name = {this.props.name}
          email = {this.props.email}
          profilePicture = {this.props.profilePicture}
          change = {this.props.change}
        />
      : <SettingProfile
          open = {this.state.isOpen}
          name = {this.props.name}
          email = {this.props.email}
          profilePicture = {this.props.profilePicture}
          change = {this.props.change}
          />}
      </div>
     );
   }
 }
