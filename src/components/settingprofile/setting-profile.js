import React from 'react';
import './settingprofile.css';

import BlockedFriend from '../blockedfriend/block-friend';
import ChangePassword from '../change-password/change-password';
import AddFriend from '../addfriend/add-friend';
import EditProfile from '../edit-profile/edit-profile';
import DeleteAccount from '../delete-account/delete-account';


export default class SettingProfile extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false,
      search : ''
    }

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

   inputSearch = (e) =>{
     this.setState ({
       search : e.target.value
     })
   }

   closeModal = () =>{
     this.setState({
       search : ''
     })
   }

  render(){
    return(
      <div className = {"popup-container "+ this.props.modal}>
        <EditProfile
          username = {this.props.username}
          name = {this.props.name}
          email = {this.props.email}
          status = {this.props.status}
          profilePicture = {this.props.profilePicture}
          click = {this.props.click}
          change = {this.props.change}/>
        <AddFriend
          click = {this.props.click}
          username = {this.props.username}/>
        <BlockedFriend
          blocklist = {this.props.blocklist}
          username = {this.props.username}
          click = {this.props.click}/>
        <ChangePassword
          onClick = {this.props.click}
          open = {this.props.open}
        />
        <DeleteAccount
          onClick = {this.props.click}
          history = {this.props.history}
        />
        <li onClick={this.logout}>Log Out</li>
      </div>
    );
  }
}
