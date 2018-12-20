import React from 'react';
import './chatlist.css';
import {
  recieveSocket,
  sendSocket
}from "../../socket/socketconnect";

export default class FriendList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      chatlog:[],
      openchat:false,
      lastMessage : '',
      notif : 0,
      intervalChatBot : '',
      chatBot:[
        'Selamat datang di layanan customer service kami, mohon tunggu sebentar admin kami sedang melayani user lain',
        'Mohon maaf menunggu lama, admin kami sedang melayani user lain, dimohon kesediaannya untuk menunggu sebentar'
      ]
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId);
    this.socketcloseChatroom();
    this.getChatData(this.props.chat);
    this.readChatSocket(this.props.chat.chatId);
    this.unsendMessageSocket(this.props.chat.chatId);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
    this.activeSocket(this.props.chat.chatId);
    this.socketcloseChatroom();
    this.readChatSocket(this.props.chat.chatId);
    this.unsendMessageSocket(this.props.chat.chatId);
  }

  socketcloseChatroom=()=>{
    recieveSocket('closechatroom'+this.props.chat.chatId,(err,recieve)=>{
        this.setState({
          openchat:false
        })
    })
  }

  activeSocket(port){
    recieveSocket(port,(err,recieve)=>{
      let time = new Date(recieve.message.time);
      const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
      const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
      const timeStamp = getHours + ':' + getMinute;
      let lastMessageText;
      if(recieve.message.message && recieve.message.message !== ""){
        if(recieve.message.message.length < 30){
          lastMessageText = recieve.message.message
        } else {
          lastMessageText = recieve.message.message.substring(0,30) +'. . .'
        }
      } else if (recieve.message.attachment){
        if(recieve.message.attachment.type === "image/jpeg" || recieve.message.attachment.type === "image/jpg" || recieve.message.attachment.type === "image/gif" || recieve.message.attachment.type === "image/png"){
          lastMessageText = "You sent a photo to "+recieve.message.receiver[0].name
        }
        else if (recieve.message.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
          lastMessageText = "You sent a file to "+recieve.message.receiver[0].name
        }
      }

      if(this.state.openchat){
        if(recieve.message.attachment){
          this.setState({
            chatlog:this.state.chatlog.concat({chatId:recieve.message.chatId,message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],attachment:recieve.message.attachment,time: recieve.message.time ,date: recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        }else {
          this.setState({
            chatlog:this.state.chatlog.concat({chatId:recieve.message.chatId,message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],time: recieve.message.time ,date: recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        }
        this.props.changeName(null,this.props.chatId,this.state.chatlog);
        this.readChat(this.props.chat,this.props.myUser.username);
        if(recieve.message.sender.username === this.props.myUser.username){
          sendSocket('changechatroom');
          this.clearIntervalChatBot();
        }
        else{
          sendSocket('readchat',recieve.message.chatId);
        }
      }
      else{
        if(recieve.message.attachment){
          this.setState({
            chatlog:this.state.chatlog.concat({chatId:recieve.message.chatId,message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],attachment:recieve.message.attachment,time: recieve.message.time,date : recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp
          })
        } else{
          this.setState({
            chatlog:this.state.chatlog.concat({chatId:recieve.message.chatId,message:recieve.message.message,sender:recieve.message.sender,
              receiver:[{username :recieve.message.sender,read : false}],time: recieve.message.time,date : recieve.message.date}),
            lastMessage:{
              chatId: recieve.message.chatId,
              message:lastMessageText,
              sender:recieve.message.sender.username
            },
            timeStamp :timeStamp,
          })
        }
        if(recieve.message.sender.username !== this.props.myUser.username){
          this.setState({
            notif:this.state.notif+1
          })
        }
      }
      if(this.state.chatlog.length === 1){
        setTimeout((()=>this.chatBotHandler(recieve,0)) , 1000)
        this.setState({
          intervalChatBot : setInterval((()=>this.chatBotHandler(recieve,1)),3000)
        })
      }
    })
  }

  chatBotHandler = (recieve,angka) =>{
    let send = {
      receiver:[
        {
          username:recieve.message.sender.username,
          name:recieve.message.sender.name,
          read : true
        }
      ],
      sender:{
        username: "chatBot",
        name:"chatBot"
      },
      chatId:recieve.message.chatId,
      message:this.state.chatBot[angka].trim(),
      time : recieve.message.time,
      date : recieve.message.date
    }
    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId : recieve.message.chatId,
        message : this.state.chatBot[angka].trim(),
        senderUsername : "chatBot",
        sender: "chatBot",
        timeStamp : recieve.message.time,
        date : recieve.message.date,
        receiveUsername : recieve.message.sender.username,
        receiveName : recieve.message.sender.name
      })
    }).then(res => res.json())
    .then(response =>{
      if(response.success){
        sendSocket('sendChat',send);
      }
    })
  }

  unsendMessageSocket (port) {
   recieveSocket ('unsendMessage'+port, (err,recieve) =>{
       let chatlog = this.state.chatlog;
       for(var index in chatlog){
         if(new Date(chatlog[index].time).getTime() === new Date(recieve).getTime()){
           if(chatlog[index].sender.username === this.props.myUser.username ){
             chatlog.splice(index,1);
           }
           else{
             let notif = this.state.notif
             if(chatlog[index].receiver[0].read === false){
               chatlog.splice(index,1);
             }
           }
         }
         this.setState({
           chatlog : chatlog
         })
       }
       this.props.changeName(null,this.props.chatId,this.state.chatlog);
   })
 }

  clearIntervalChatBot = () =>{
    clearInterval(this.state.intervalChatBot);
  }

  escOnClick = (e) =>{
    if(e.keyCode === 27) {
      //Do whatever when esc is pressed
      this.setState({
        openchat:false
      })
    }
  }

  getChatData = (chat) => {
    fetch('/getchat',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chat.chatId
      }),
    }).then(res => res.json())
      .then(json =>{
        if(json.success){
          let notif = 0
          for(var read in json.message){
            if(json.message[read].sender.username !== this.props.myUser.username && !json.message[read].receiver[0].read){
              notif++
            }
          }
          let time  = new Date(json.message.slice(-1).pop().time);
          const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
          const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
          const timeStamp = getHours + ':' + getMinute;
          let lastMessageText;
          if(json.message.slice(-1).pop().message && json.message.slice(-1).pop().message !== ""){
            if(json.message.slice(-1).pop().message.length < 30){
              lastMessageText = json.message.slice(-1).pop().message
            }
            else {
              lastMessageText = json.message.slice(-1).pop().message.substring(0,30) +'. . .'
            }
          } else if (json.message.slice(-1).pop().attachment){
            if(json.message.slice(-1).pop().attachment.type === "image/jpeg" ||
            json.message.slice(-1).pop().attachment.type === "image/jpg" ||
            json.message.slice(-1).pop().attachment.type === "image/gif" ||
            json.message.slice(-1).pop().attachment.type === "image/png"){
              lastMessageText = "You sent a photo to "+json.message.slice(-1).pop().receiver[0].name
            }
            else if (json.message.slice(-1).pop().attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
              lastMessageText = "You sent a file to "+json.message.slice(-1).pop().receiver[0].name
            }
          }
          this.setState({
            chatlog : json.message,
            lastMessage:{
              chatId: json.chatId,
              message:lastMessageText,
              sender:json.message.slice(-1).pop().sender
            },
            timeStamp :timeStamp,
            notif : notif
          })
        }
    })
  }

  openChatRoom = (item,log) => {
    this.setState({
      openchat:true,
      notif:0
    })
    this.props.changeName(item,item.chatId,log);
    if(this.state.lastMessage.sender !== this.props.myUser.username){
      this.readChat(item,this.props.myUser.username);
       sendSocket('readchat',item.chatId);
    }
  }

  readChatSocket (port) {
    recieveSocket ('readchat'+port, (err,recieve) =>{
      if(this.state.chatlog.length !== 0){
        let chatlog = this.state.chatlog;
        for(var index = chatlog.length-1 ; index >= 0 ; index--){
            if(chatlog[index].receiver[0].read === false){
              chatlog.splice(index,1,
                { chatId: port,
                  date : chatlog[index].date,
                  message : chatlog[index].message,
                  attachment : chatlog[index].attachment,
                  receiver:[{username :chatlog[index].receiver[0].username, name :chatlog[index].receiver[0].name, read : true}],
                  sender : {username : chatlog[index].sender.username,  name : chatlog[index].sender.name},
                  time : chatlog[index].time
                });
            } else {
              this.setState({
                chatlog : chatlog
              })
              break;
            }
        }
        if(this.state.openchat){
          this.props.changeName(null,null,this.state.chatlog);
        }
      }
    })
  }

  readChat = (chat,username) => {
    fetch('/readNotif',{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chat.chatId,
        username : username
      }),
    })
  }

  render(){
    const chat = this.props.chat;
    return(
        <div>
          <li className = "chat-list-text"
            onClick={() =>this.openChatRoom(chat,this.state.chatlog)}
          >
          <div className = "chat-list-picture">
            <img src = {chat.profilePicture} alt=""/>
          </div>
          <div>
            <div className = "chat-name">
              {chat.name}
            </div>
            <div className = "chat-time">
              {this.state.timeStamp}
            </div>
          </div>
          <div>
            <div className = "chat-lastMessageText">
              {this.state.lastMessage.message}
            </div>
            {this.state.notif === 0 ?
              null
              :this.state.notif <= 9 ?
              <div className = "friend-notif-oneNumber">
                {this.state.notif}
              </div>
              : this.state.notif <= 99 ?
              <div className = "friend-notif-twoNumber">
                {this.state.notif}
              </div>
              : this.state.notif <= 999 ?
              <div className = "friend-notif-threeNumber">
                {this.state.notif}
              </div>
              :
              <div className = "friend-notif-threeNumberPlus">
                999+
              </div>
            }
          </div>
          </li>
        </div>
    );
  }
}
