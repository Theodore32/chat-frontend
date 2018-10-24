import React from 'react';
import './text-message.css';
import TextareaAutosize from 'react-autosize-textarea';
import file from '../../picture/paperclip.png';
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

  componentDidMount(){
    console.log(this.props);
    document.addEventListener("keydown", this.onEnterPress, false);
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
      sendChat('sendChat',send)
      this.setState({
        message:''
      })
    }
  }


onEnterPress = (e) => {
  if(e.keyCode === 13 && e.shiftKey === false) {
    this.onSend(e);
  }
}

  render(){
    return(
      <div className = "footer-app">
        <div className = "inputBarMessage">
          <form onSubmit = {this.onEnterPress}>
            <img src = {file} className = "fileSetting" alt=''/>
            <TextareaAutosize
              style={{maxHeight : "75px"}}
              className = "message"
              rows = "4"
              placeholder= "type a message . . ."
              value = {this.state.message}
              onChange={this.messageOnChange}
            />
          </form>
        </div>
      </div>
    );
  }
}
