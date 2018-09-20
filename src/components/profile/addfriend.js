import React from 'react';
import '../../App.css';

import {Modal} from 'semantic-ui-react';

export default class AddFriend extends React.Component{
  constructor(props){
    super(props);

    this.logout = this.logout.bind(this)
  }
  logout(e) {
    e.preventDefault()
       // Verify token
       fetch('/logout',{
         credentials:'include'
       })
         .then(res => res.json())
         .then(json => {
           if (json.success) {
             this.props.history.push('/LoginForm')
           }
          }
        );
   }
  render(){
    return(
      <div className = {"popup-container "+ this.props.modal}>
        <Modal trigger={<li onClick = {this.props.click}>Add Friend</li>}
          centered={false} className = "addfriend-container" size = "mini">
          <Modal.Header><center>Add Friends</center></Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>This is selena</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <li onClick={this.logout}>Log Out</li>
      </div>
    );
  }
}
