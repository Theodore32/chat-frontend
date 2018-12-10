import React from 'react';
import './settingprofile.css';
import ChangePassword from '../change-password/change-password';

export default class SettingProfile extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false
    }
  }

  logout = (e) => {
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

   show = (size,name) => {
     this.setState(
       {
         size,
         open: true,
         name : name
       }
     )
   }

   close = () => {
     this.setState({ open: false })
   }

  render(){
    return(
      <div className = {"popup-container "+ this.props.modal}>
        <ChangePassword
          onClick = {this.props.click}
          open = {this.props.open}
        />
        <li onClick={this.logout}>Log Out</li>
      </div>
    );
  }
}
