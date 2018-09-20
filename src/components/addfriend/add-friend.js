import React from 'react';
import './addfriend.css';
import {Link} from 'react-router-dom'
import ChangePassword from '../change-password/change-password';
import addcontact from '../../picture/add-user.png';
import muka from '../../picture/muka.jpg'
import {Modal,Button, Form} from 'semantic-ui-react';
import icon from '../../picture/search.png';

export default class AddFriend extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false,
      search : '',
      searchResult:{
        success:false
      }
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

   inputSearch = (e) =>{
     this.setState ({
       search : e.target.value
     })
   }

   closeModal = () =>{
     this.setState({
       search : '',
       searchResult:{
         success:false
       }
     })
   }

   searchData = (event) =>{
     event.preventDefault()
     const searchInput = this.state.search
     fetch('/search',{
       credentials : 'include',
       method : 'POST',
       headers : {
         'Content-Type' : 'application/json'
       },
       body : JSON.stringify({
         username : searchInput
       })
     }).then( res => res.json())
     .then (res => {
       this.setState({
         searchResult : res
       })
     })
   }

   addFriend = (event) =>{
     event.preventDefault()
     const username = this.state.search
     const name = this.state.searchResult.name
     console.log(username, name);
     fetch('/Friends',{
       credentials : 'include',
       method : 'PUT',
       headers : {
         'Content-Type' : 'application/json'
       },
       body : JSON.stringify({
         friendlist : {
          username : username,
          name : name
        }
       })
     }).then (res => res.json())
     .then (res => {
       console.log(res);
       if(res.success){
         console.log(res);
       }
     })
   }

  add = (event) => {
    event.preventDefault()
    fetch('/add',{
      credentials:'include',
      method:'PUT',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        username:this.state.search,
        name:this.state.searchResult.name
      })
    }).then(res => res.json())
    .then(res=>{
      console.log(res);
    })
  }

  block = (event) => {
    event.preventDefault()
    fetch('/block',{
      credentials:'include',
      method:'PUT',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        username:this.state.search,
        name:this.state.searchResult.name
      })
    })
  }

  render(){
    const { open, size } = this.state;
    const list = this.state.location;
    return(
      <Modal trigger={
            <li onClick = {this.props.click}>
              Add Friend
            </li>}
        centered={false} size = "mini" id = "addfriend-modal" className = "addfriend-modal" onClose = {this.closeModal}>
        <Modal.Header><center>Add Friends</center></Modal.Header>
        <div className = "searchAddFriend">
          <form onSubmit = {this.searchData}>
            <input
              type = "text"
              className = "searchfriend"
              placeholder = "Search or start new chat"
              value = {this.state.search}
              onChange = {this.inputSearch}
            />
            <img src = {icon} alt=""/>
          </form>
        </div>
        <div className = "addfriend-box">
          {!this.state.searchResult.success ?
            <center>
              {this.state.searchResult.message}
            </center>
              :
            <center>
              <img src = {muka} className = "addfriend-profile-setting"/><br/>
              <div className = "addfriend-text">
                {this.state.searchResult.name}
              </div><br/>
              {!this.state.searchResult.message?
                  !this.state.searchResult.request?
                    <button onClick = {this.addFriend} className = "addfriend-button-setting">Add Friend</button>
                    :
                    <div>
                      <button onClick = {this.add} className = "addfriend-button-setting">add</button>
                      <button onClick = {this.block} className = "addfriend-button-setting">Block</button>
                    </div>
                :
                this.state.searchResult.message
              }

            </center>
          }
        </div>
      </Modal>
    );
  }
}
