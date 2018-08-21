import React from 'react';
import './text-message.css';
import {
  sendChat
}from "../../socket/socketconnect"

export default class inputMessage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      message:''
    }
    this.messageOnChange =this.messageOnChange.bind(this);
    this.onSend =this.onSend.bind(this);
  }

  messageOnChange(e){
    this.setState({
      message:e.target.value
    })
  }

  onSend(e){
    e.preventDefault();
    if(this.state.message){
      let send = {
        reciever:this.props.sender,
        sender:this.props.recieve,
        message:this.state.message
      }
      sendChat(send)
      this.setState({
        message:''
      })
    }
  }

  render(){
    return(
      <div className = "footer-app">
        <div className = "inputBarMessage">
          <form onSubmit={this.onSend}>
            <input type = "text" className = "message" placeholder="type a message . . ." value={this.state.message} onChange={this.messageOnChange}/>
          </form>
        </div>
      </div>
    );
  }
}
