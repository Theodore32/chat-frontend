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
      message:'',
      file: [],
      imagePreviewUrl: null,
      error: ''
    }

    this.messageOnChange =this.messageOnChange.bind(this);
    this.onSend =this.onSend.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onEnterPress, false);
  }

  onSend(e){
    e.preventDefault();
    const today = new Date();
    const getHours = (today.getHours() < 10 ? '0' : '') + today.getHours();
    const getMinute = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const time = getHours+":"+getMinute;
    const date = today.getDate();
    const message = this.state.message;
    const attachment = this.state.file;
    // console.log("ATTACH: ",attachment);
    // console.log("msg: ",message);
    if(this.state.message){
      let send = {
        reciever:this.props.sender,
        sender:{
          username: this.props.senderUsername,
          name:this.props.sender
        },
        chatId:this.props.chatId,
        message:this.state.message,
        image:this.state.imagePreviewUrl,
        time : time
      }
      sendChat('sendChat',send)
      this.handleUserInput(attachment,message,time,date)
      this.setState({
        message:'',
        imagePreviewUrl :'',
        file : ''
      })
    }
  }

  messageOnChange = (event) =>{
    const name = event.target.name

    this.setState({
      [name] : event.target.value
    })
  }

  handleUserInput = (file,message,time,date) =>{
    this.attachPhoto(file,message,time,date);
  }

  attachPhoto = (attachment,message,time,date) =>{
    const senderUsername = this.props.senderUsername;
    const sender = this.props.sender;
    const chatId = this.props.chatId
    var formData = new FormData();
    formData.append ('chatId', chatId);
    formData.append ('senderUsername', senderUsername);
    formData.append ('sender',sender);
    formData.append ('attachment', attachment);
    formData.append ('message', message);
    formData.append ('time', time);
    formData.append ('date', date);

    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        // window.location.reload()
        // this.props.history.push('/ChatRoom')
        this.setState({
          error : response.message,
          time : response.time
        })
      }
      else{
        this.setState({
          success: false,
          error: response.message
        })
      }
    })
  }

onEnterPress = (e) => {
  if(e.keyCode == 13 && e.shiftKey == false) {
    this.onSend(e);
  }
}

_handleImageChange(e) {
   e.preventDefault();

   let reader = new FileReader();
   let file = e.target.files[0];

   reader.onloadend = () => {
     this.setState({
       file: file,
       imagePreviewUrl: reader.result
     });
   }
   if(file){
     reader.readAsDataURL(file);
   }
 }

  render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }
    return(
      <div className = "footer-app">
        <div className = "inputBarMessage">
          <form onSubmit = {this.onEnterPress}>
            <div>
              <label for = "attachment">
                <img src = {file} className = "fileSetting"/>
              </label>
              <input
                id = "attachment"
                type = "file"
                style = {{display : "none"}}
                onChange = {(e) => this._handleImageChange(e)}
                />
            </div>
            <div className = "imgPreview">
              {$imagePreview}
            </div>
            <TextareaAutosize
              style={{maxHeight : "75px"}}
              className = "message"
              rows = "4"
              placeholder= "type a message . . ."
              name = "message"
              value = {this.state.message}
              onChange = {this.messageOnChange}
            />
          </form>
        </div>
      </div>
    );
  }
}
