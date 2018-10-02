import React from 'react';
import './addfriend.css';
import {Link} from 'react-router-dom'
import ChangePassword from '../change-password/change-password';
import addcontact from '../../picture/add-user.png';
import muka from '../../picture/muka.jpg'
import {Modal, Button, Form, Loader} from 'semantic-ui-react';
import icon from '../../picture/search.png';


import {
  setInStorage,
  getFromStorage
}from '../../token/storage'

export default class AddFriend extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false,
      search : '',
      searchResult:
      {
        success:false
      },
      loading : false
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
       searchResult : {
          success:false
       }
     })
   }

   searchData = (event) =>{
     event.preventDefault()
     this.setState({
       loading : true
     })
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
       console.log("ASD: ",res);
       this.setState({
         searchResult : res,
         loading : false
       })
     })
   }

   addFriend = (event) =>{
     event.preventDefault()
     const username = this.state.search
     const name = this.state.searchResult.name
     const picture = this.state.searchResult.picture
     fetch('/Friends',{
       credentials : 'include',
       method : 'PUT',
       headers : {
         'Content-Type' : 'application/json'
       },
       body : JSON.stringify({
         friendlist : {
          username : username,
          name : name,
          picture : picture
        }
       })
     }).then (res => res.json())
     .then (res => {
       this.setState({
         searchResult : res
       })
     })
   }

   add = (event) => {
    event.preventDefault()
    const username = this.state.search
    const name = this.state.searchResult.name
    const picture = this.state.searchResult.picture
    fetch('/add',{
      credentials:'include',
      method:'PUT',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        username : username,
        name : name,
        picture : picture
      })
<<<<<<< HEAD
=======
    }).then(res => res.json())
    .then(res=>{
      this.setState({
        searchResult : res
      })
>>>>>>> b5ae80a0ddf2b74bb94fc108b2401e1e1fd7e6a9
    })
  }

  block = (event) => {
    event.preventDefault()
    const username = this.state.search
    const name = this.state.searchResult.name
    const picture = this.state.searchResult.picture
    fetch('/block',{
      credentials:'include',
      method:'PUT',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        username : username,
        name : name,
        picture : picture
      })
    }).then(res => res.json())
    .then(res=>{
      this.setState({
        searchResult : res
      })
    })
  }


  render(){
    const { open, size } = this.state;
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
              placeholder = "Search friend by username"
              value = {this.state.search}
              onChange = {this.inputSearch}
            />
            <img src = {icon} alt=""/>
          </form>
        </div>
        <div className = "addfriend-box">
          {this.state.loading ?
            <center>
              <div className = "loader"></div>
              <br/>
              Loading
            </center> :
            <center>
              {!this.state.searchResult.success ?
                <center>
                  {this.state.searchResult.message}
                </center>
                  :
                <center>
                  <img src = {this.state.searchResult.picture} className = "addfriend-profile-setting"/><br/>
                  <div className = "addfriend-text">
                    {this.state.searchResult.name}
                  </div><br/>
                  {!this.state.searchResult.message ?
                      !this.state.searchResult.request ?
                        <button onClick = {this.addFriend} className = "addfriend-button-setting">Add Friend</button>
                        :
                        <div>
                          <button onClick = {this.add} className = "addfriend-button-setting">Add</button>
                          <button onClick = {this.block} className = "addfriend-button-setting">Block</button>
                        </div>
                    :
                    this.state.searchResult.message
                  }
                </center>
              }
            </center>
          }
        </div>
      </Modal>
    );
  }
}
