import React from 'react';
import './header.css';

import profileImage from '../../picture/muka.jpg';
import setting from '../../picture/menu.png';
import {Popup , Modal, Image} from 'semantic-ui-react';

export default class HeaderChat extends React.Component{
  render(){
    return(
      <div className = "header-container">
        <div className = "header-image-position">
          <Modal trigger={<img src={this.props.picture} className = "profileImage" alt=""/>} centered={false}>
            <Modal.Header>Selena</Modal.Header>
            <Modal.Content image>
              <Image wrapped size='medium' src={profileImage} />
              <Modal.Description>
                <p>This is Mariah</p>
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <div className = "header-room-name">
            {this.props.name}
          </div>
        </div>
        <div className = "header-setting-icon-position">
          <Popup
            trigger={<img src = {setting} className = "setting-icon" alt=""/>}
            content='Hide the popup on any scroll event'
            on='click'
            hideOnScroll
            horizontalOffset = {10}
            verticalOffset = {1}
          />
      </div>
      </div>
    );
  }

}
