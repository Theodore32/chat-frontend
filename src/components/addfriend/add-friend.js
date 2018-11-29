import React from 'react';
import './addfriend.css';
import {Modal} from 'semantic-ui-react';
import icon from '../../picture/search.png';
import {
  sendSocket
}from "../../socket/socketconnect"

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
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onEnterPress, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.onEnterPress, false);
  }

  onEnterPress=(e)=>{
    if(e.keyCode === 13 && this.state.search) {
      this.searchData(e);
    }
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
       this.setState({
         searchResult : res,
         loading : false
       })
     })
   }

   newFriend = (username,name,picture,description) =>{
    let message = {
      myUsername : this.props.username,
      username : username,
      name : name,
      picture : picture,
      description : description
    }
    sendSocket('newfriend',message);
   }

   addFriend = (event) =>{
     event.preventDefault()
     const username = this.state.search
     const name = this.state.searchResult.name
     const picture = this.state.searchResult.picture
     const description = this.state.searchResult.description
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
          picture : picture,
          description : description
        }
       })
     }).then (res => res.json())
     .then (res => {
       this.setState({
         searchResult : res,
       })
       console.log(this.state.searchResult);
       this.newFriend(username,name,picture,description)
     })
   }


  render(){
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
                    <button onClick = {this.addFriend} className = "addfriend-button-setting">Add Friend</button>
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
