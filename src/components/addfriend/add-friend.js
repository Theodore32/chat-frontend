import React from 'react';
import './addfriend.css';

import SearchAddFriend from './search-add-friend';
import addcontact from '../../picture/add-user.png';

import {Modal,Button} from 'semantic-ui-react';

export default class AddFriend extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      open : false,
      search : '',
      location: [
        {
            id: 0,
            title: 'New York',
            selected: false,
            key: 'location'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location'
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location'
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location'
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location'
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location'
        },
        {
          id: 6,
          title: 'Croatia',
          selected: false,
          key: 'location'
        },
        {
          id: 7,
          title: 'Portugal',
          selected: false,
          key: 'location'
        },
        {
          id: 8,
          title: 'England',
          selected: false,
          key: 'location'
        },
        {
          id: 9,
          title: 'America',
          selected: false,
          key: 'location'
        },
        {
          id: 10,
          title: 'Egypt',
          selected: false,
          key: 'location'
        },
        {
          id: 11,
          title: 'India',
          selected: false,
          key: 'location'
        },
        {
            id: 12,
            title: 'Arab',
            selected: false,
            key: 'location'
        },
        {
          id: 13,
          title: 'France',
          selected: false,
          key: 'location'
        },
        {
          id: 14,
          title: 'Germany',
          selected: false,
          key: 'location'
        },
        {
          id: 15,
          title: 'Elang',
          selected: false,
          key: 'location'
        },
        {
          id: 16,
          title: 'Burung',
          selected: false,
          key: 'location'
        },
        {
          id: 17,
          title: 'Jeruk',
          selected: false,
          key: 'location'
        },
        {
            id: 18,
            title: 'Mangga',
            selected: false,
            key: 'location'
        },
        {
          id: 19,
          title: 'Apel',
          selected: false,
          key: 'location'
        },
        {
          id: 20,
          title: 'Durian',
          selected: false,
          key: 'location'
        },
        {
          id: 21,
          title: 'Unta',
          selected: false,
          key: 'location'
        },
        {
          id: 22,
          title: 'Udang',
          selected: false,
          key: 'location'
        },
        {
          id: 23,
          title: 'Kepiting',
          selected: false,
          key: 'location'
        },
        {
            id: 24,
            title: 'Banteng',
            selected: false,
            key: 'location'
        },
        {
          id: 25,
          title: 'Kerbau',
          selected: false,
          key: 'location'
        },
        {
          id: 26,
          title: 'Anjing',
          selected: false,
          key: 'location'
        },
        {
          id: 27,
          title: 'Kucing',
          selected: false,
          key: 'location'
        },
        {
          id: 28,
          title: 'Ikan',
          selected: false,
          key: 'location'
        },
        {
          id: 29,
          title: 'Siput',
          selected: false,
          key: 'location'
        },
        {
            id: 30,
            title: 'Cacing Tanah',
            selected: false,
            key: 'location'
        },
        {
          id: 31,
          title: 'Kuda',
          selected: false,
          key: 'location'
        },
        {
          id: 32,
          title: 'Sapi',
          selected: false,
          key: 'location'
        },
        {
          id: 33,
          title: 'Kambing',
          selected: false,
          key: 'location'
        },
        {
          id: 34,
          title: 'Ayem',
          selected: false,
          key: 'location'
        },
        {
          id: 35,
          title: 'ASD',
          selected: false,
          key: 'location'
        }
      ]
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

  render(){
    const { open, size } = this.state;
    const list = this.state.location;
    const filteredList = list.filter(
      (friend) => {
        return (
          friend.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        );
      }
    );
    console.log("Nmr : ",filteredList);
    return(
      <div className = {"popup-container "+ this.props.modal}>
        <Modal trigger={<li onClick = {this.props.click}>Add Friend</li>}
          centered={false} size = "mini" className = "addfriend-modal">
          <Modal.Header><center>Add Friends</center></Modal.Header>
          <div className = "searchAddFriend">
            <SearchAddFriend
              onChange = {this.inputSearch}
              search = {this.state.value}/>
          </div>
          <div className = "addfriend-box">
              {filteredList.map((friend) =>(
                    <li key = {friend.id} className = "addfriend-text">{friend.title}
                      <button className = "addfriend-button-setting" onClick = {() => {this.show('mini',friend.title)}}>
                        <img src ={addcontact} className = "addfriend-icon" alt=''/>
                      </button>
                    </li>
                  )
                )
              }
          </div>
        </Modal>
        <li onClick={this.logout}>Log Out</li>
          <Modal size={size} open={open} onClose={this.close}>
            <Modal.Header>Add Friend</Modal.Header>
            <Modal.Content>
              <p>Add {this.state.name} as a friend?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick = {this.close}>No</Button>
              <Button positive>Yes</Button>
            </Modal.Actions>
          </Modal>
      </div>
    );
  }
}
