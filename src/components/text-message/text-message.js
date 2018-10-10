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
      imagePreviewUrl: '',
      time : new Date()
    }

    this.messageOnChange =this.messageOnChange.bind(this);
    this.onSend =this.onSend.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onEnterPress, false);
  }

  onSend(e){
    e.preventDefault();

    const time = this.state.time;
    const message = this.state.message;
    const attachment = this.state.file;
    console.log("ATTACH: ",attachment);
    console.log("msg: ",message);
    if(this.state.message){

      let send = {
        reciever:this.props.sender,
        sender:this.props.recieve,
        message:this.state.message
      }
      sendChat(send)
      this.handleUserInput(attachment,message,time)
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

  handleUserInput = (file,message,time) =>{
    this.attachPhoto(file,message,time);
  }

  attachPhoto = (attachment,message,time) =>{
    var formData = new FormData();

    formData.append ('attachment', attachment)
    formData.append ('message', message)
    formData.append ('time', time)

    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        console.log("Message Posted");
        // window.location.reload()
        // this.props.history.push('/ChatRoom')
      }
      else{
        this.setState({
          success: false
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
    {console.log("image :", this.state.imagePreviewUrl)}
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
