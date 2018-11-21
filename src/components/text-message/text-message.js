import React from 'react';
import './text-message.css';
import TextareaAutosize from 'react-autosize-textarea';
import file from '../../picture/paperclip.png';
import cancel from '../../picture/cancel.png';
import doc from '../../picture/doc.png';
import {
  sendSocket
}from "../../socket/socketconnect";

export default class inputMessage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      message:'',
      file: '',
      imagePreviewUrl: '',
      error: ''
    }

    this.messageOnChange =this.messageOnChange.bind(this);
    this.onSend =this.onSend.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onEnterPress, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.onEnterPress, false);
  }

  onSend(e){
    e.preventDefault();
    const today = new Date();
    const dd = (today.getDate() < 10 ? '0' : '')+today.getDate();
    const mm = ((today.getMonth()+1) < 10 ? '0' : '')+(today.getMonth()+1); //January is 0!
    const yyyy = today.getFullYear();
    const date = dd+'-'+mm+'-'+yyyy;
    const message = this.state.message;
    const attachment = this.state.file;
    const attachmentName = this.state.file.name;
    const attachmentType = this.state.file.type;
    if(message || attachment){
      this.attachPhoto(attachment,attachmentName,attachmentType,message,today,date);
    }
  }

  messageOnChange = (event) =>{
    console.log(this.props);
    const name = event.target.name

    this.setState({
      [name] : event.target.value
    })
  }

  attachPhoto = (attachment,attachmentName,attachmentType,message,today,date) =>{
    this.setState({
      error: ''
    })
    const senderUsername = this.props.senderUsername;
    const sender = this.props.sender;
    const chatId = this.props.chatId;
    const receive = this.props.recieve;

    var formData = new FormData();
    formData.append ('chatId', chatId);
    formData.append ('senderUsername', senderUsername);
    formData.append ('sender',sender);
    formData.append ('Attachment' , attachment)
    formData.append ('AttachmentName', attachmentName);
    formData.append ('AttachmentType', attachmentType);
    formData.append ('message', message);
    formData.append ('timeStamp', today);
    formData.append ('date', date);
    formData.append ('recieve',receive);

    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        if(response.filename){
          let send = {
            reciever:this.props.sender,
            sender:{
              username: this.props.senderUsername,
              name:this.props.sender
            },
            chatId:this.props.chatId,
            message:this.state.message,
            attachment: {
              name : response.filename,
              type : attachmentType
            },
            time : today,
            date : date
          }
          sendSocket('sendChat',send);
        } else {
          let send = {
            reciever:this.props.sender,
            sender:{
              username: this.props.senderUsername,
              name:this.props.sender
            },
            chatId:this.props.chatId,
            message:this.state.message,
            time : today,
            date : date
          }
          sendSocket('sendChat',send);
        }
        this.setState({
          time : response.time,
          message:'',
          imagePreviewUrl :'',
          file : ''
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
  if(e.keyCode === 13 && e.shiftKey === false) {
    this.onSend(e);
  }
}

_handleImageChange(event) {
   event.preventDefault();
   console.log(event);
   let reader = new FileReader();
   let file = event.target.files[0];
   reader.onloadend = () => {
     this.setState({
       file: file,
       imagePreviewUrl: reader.result
     })
   }
   if(file){
     reader.readAsDataURL(file);
   }
   event.target.value = '';
 }

 cancelImage = () =>{
   this.setState({
     imagePreviewUrl : '',
     file : '',
     error : ''
   })
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
                onChange = {(event) => this._handleImageChange(event)}
                />
            </div>
            {this.state.error ?
              <div className = "errorImageType">
                {this.state.error}
              </div>
              :
              null
            }
            {$imagePreview ?
              this.state.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                <div className = "imgPreview">
                  <div className = "cancelImage">
                    <img src = {cancel} onClick = {this.cancelImage}/>
                  </div>
                  <img src = {doc}/>
                  <p>{this.state.file.name}</p>
                </div> :
              this.state.file.type === "image/jpeg" || this.state.file.type === "image/jpg" || this.state.file.type === "image/gif" || this.state.file.type === "image/png" ?
                <div className = "imgPreview">
                  <div className = "cancelImage">
                    <img src = {cancel} onClick = {this.cancelImage}/>
                  </div>
                  {$imagePreview}
                </div>
                :
                <div className = "noSupportPreview">
                  <div className = "cancelNoSupport">
                    <img src = {cancel} onClick = {this.cancelImage}/>
                  </div>
                  <p>
                    File Not Supported
                  </p>
                </div>
              : null
            }
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
