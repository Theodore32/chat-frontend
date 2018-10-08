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
          <Modal
            trigger={<img src={this.props.picture}
            className = "profileImage" alt=""/>}
            centered={false}>
            <Modal.Header centered>{this.props.name}</Modal.Header>
            <Modal.Content>
              <img src = {this.props.picture}/>
            </Modal.Content>
          </Modal>
          <div className = "header-room-name">
            {this.props.name}
          </div>
        </div>
        <div className = "header-setting-icon-position">
          <Popup
            trigger={<img src = {setting} className = "setting-icon" alt=""/>}
            content={<button>ASD</button>}
            on='click'
            horizontalOffset = {10}
            verticalOffset = {1}
          />
      </div>
      </div>
    );
  }

}
