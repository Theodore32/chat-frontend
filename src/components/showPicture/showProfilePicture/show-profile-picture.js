import React from 'react'
import './show-profile-picture.css'
import {Modal} from 'semantic-ui-react';
import profile from '../../../picture/boy.png';

export default class showProfilePicture extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isOpen : false,
      name : this.props.name,
      currentPhoto : this.props.profilePicture,
    }
  }

  render(){
    return (
      <div>
        <Modal
          trigger={
            <div className = "profileAndName">
              {this.state.changePhoto ?
                <img src={this.state.currentPhoto} className = "profileImage" alt="" />
                :
                <img src={profile} className = "profileImage" alt="" />
              }
              <div className = "profileName">
                <b>{this.props.name}</b>
              </div>
            </div>
          }
          centered={false}
          size = "tiny"
        >
          <Modal.Content id = "modalProfileImage">
            <center>
              <img src={this.state.currentPhoto} className = "showProfileImage" alt="" />
            </center>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
