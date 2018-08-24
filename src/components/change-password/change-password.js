import React from 'react'
import './changepassword.css'
import {Modal,Button, Form} from 'semantic-ui-react';


export default class ChangePassword extends React.Component{

  render(){
    return(
      <Modal trigger={<li onClick = {this.props.onClick}>Change Password</li>}
        centered={false} size = "tiny" >
        <Modal.Header><center>Change Password</center></Modal.Header>
        <Form className = "changePassword-modal">
          <div className = "changePassword">
            <Form.Field required>
              <label>Old Password</label>
              <input
                placeholder='Username'
                type ='text'
                name = 'username'
                ref = 'username'
              />
            <div className = "errorMessage"></div>
            </Form.Field>
            <Form.Field required>
              <label>New Password</label>
              <input
                placeholder='Username'
                type ='text'
                name = 'username'
                ref = 'username'
              />
            <div className = "errorMessage"></div>
            </Form.Field>
            <Form.Field required>
              <label>Retype New Password</label>
              <input
                placeholder='Username'
                type ='text'
                name = 'username'
                ref = 'username'
              />
            <div className = "errorMessage"></div>
            </Form.Field>
            <Button
            className = "buttonForm"
            type='submit'
            >UPDATE PASSWORD
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }

}
