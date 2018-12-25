import React from 'react';
import './content.css';
import Message from '../text-message/text-message';
import doc from '../../picture/doc.png';
import {
  recieveSocket,sendSocket
}from "../../socket/socketconnect";

export default class Content extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      timeFixed : false,
      showTime : false,
      visible : false,
      isHovering: false,
      openMenu: false,
      length:0,
      chatlogLength : 0,
      scrollTop : null,
      scrollHeight : null
    }
    this.escOnClick= this.escOnClick.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escOnClick, false);
    this.scrollToBottom();
    this.setState({
      chatlogLength:this.props.chatlog.length
    })
    this.contextContainer.addEventListener('scroll',this.handleScroll,false);
  }

  componentDidUpdate(){
    if(this.state.scrollTop !== null || this.state.scrollHeight !== null){
      if(this.state.chatlogLength !== this.props.chatlog.length && this.props.senderUsername === this.props.chatlog[this.props.chatlog.length - 1].sender.username){
        this.scrollToBottom();
        this.setState({
          chatlogLength:this.props.chatlog.length
        })
      }
      else if(this.state.chatlogLength !== this.props.chatlog.length && ((this.state.scrollHeight - this.state.scrollTop) <= 473 || (this.state.scrollHeight - this.state.scrollTop) === 474)){
        this.scrollToBottom();
        this.setState({
          chatlogLength:this.props.chatlog.length
        })
      }
    }
    else {
      this.scrollToBottom();
    }
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
  }

  handleScroll = (event) =>{
      let scrollTop = Math.round(this.contextContainer.scrollTop);
      let scrollHeight = this.contextContainer.scrollHeight;
      let offsetHeight = this.contextContainer.offsetHeight;
      let clientHeight = this.contextContainer.clientHeight;
      let oneLastMessage =  Math.round(scrollHeight - scrollTop);
      console.log(scrollTop);
      console.log(scrollHeight);
      this.setState({
        scrollTop : scrollTop,
        scrollHeight : scrollHeight
      })
  }

  changeState = (change) =>{
    this.setState({
      enterPress : change
    })
  }

  escOnClick(event){
    if(event.keyCode === 27) {
      this.props.escClicked()
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior : "auto", block : "end"});
  }

  getTimefromLog(timestamp){
    let time  = new Date(timestamp)
    const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
    const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
    return (getHours+':'+getMinute)
  }

  getDateandTime =(timestamp,chat,index) => {
    let time  = new Date(chat[index].time)
    const options = { weekday: 'long' };
    const day = time.toLocaleDateString('en-US' , options);
    const dayName = day.substring(0,3);
    let currentDate
    if(index !== 0){
      if(chat[index].date === chat[index-1].date){
        currentDate = 1
      }
      else {
        currentDate = 2
      }
    } else {
      currentDate = 2
    }
    if( currentDate === 1){
      return null
    }
    else {
      return (
        <div className = "timeSeparator-container">
          <div className = "timeSeparator">
            {dayName+', '+chat[index].date}
          </div>
        </div>
      )
    }
  }

  viewImage = (name) =>{
    window.open('http://localhost:3000/'+name);
  }

  downloadFile = (name) => {
    window.open('http://localhost:3000/'+name, '_top');
  }

  fileName = (fileName) =>{
    let name;
    if(fileName.length > 45){
      name = fileName.substring(0,45) +'. . .'
    } else {
      name = fileName
    }
    return name;
  }

  handleMouseHover(flag,time) {
    if(flag === 0){
      this.setState(this.toggleHoverState(true,time));
    }
    else{
      this.setState(this.toggleHoverState(false,time));
    }
  }

  toggleHoverState(state,time) {
    return {
      isHovering: state,
      openMenu : false,
      timeDiv : time
    };
  }

  changeChatroomSocket(){
    recieveSocket ('changechatroom',(err,recieve) =>{
      this.scrollToBottom()
    })
  }

  unsendMessage = (chatId,timeStamp) =>{
    fetch('/unsendMessage',{
      credentials : 'include',
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId : chatId,
        timeStamp:timeStamp
      })
    }).then(res => res.json())
      .then(response =>{
        if(response.success){
          this.handleMouseHover(1,null);
          sendSocket('unsendMessage',{chatId,timeStamp});
        }
    })
  }

  MenuMessage = () =>{
    this.setState(this.toggleMenuMessage)
  }

  toggleMenuMessage(state){
    return{
      openMenu : !state.openMenu
    }
  }

  render(){
    const { visible } = this.state;
    console.log(this.props.chatlog);
    return (
      <div>
      <div className = {"content-container"} id = "content-container" ref={ref => {this.contextContainer = ref}}>
        <div className = "content-chat" id = "content-chat">
            {this.props.chatlog.length < 1 ?
               null
               :
               this.props.chatlog.map((index,urutan) =>{
                 if(index.sender.username === this.props.senderUsername){
                   return(
                    <div className = "MessageHeader">
                      {this.getDateandTime(index.time,this.props.chatlog,urutan)}
                      <div className = "senderMessageName">
                        {this.props.chatlog.length >= 0 ?
                          urutan === 0 ?
                            this.props.chatlog[urutan-1] === "undefined" ?
                              index.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                                  <p>{index.sender.name}</p>
                                :
                                null
                              :
                              <p>{index.sender.name}</p>
                            :
                            this.props.chatlog[urutan-1] !== "undefined" ?
                              index.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                                  <p>{index.sender.name}</p>
                                :
                                null
                              :
                              null
                          :
                          null
                        }
                      </div>
                      <div className = "MessageSender">
                        {this.props.chatlog[urutan].receiver[0].read === true ?
                          <div className = "readChat">
                            Read
                          </div> :
                          null
                        }
                        <div>
                          {index.message.split("\n").length > 1 || index.message.length > 78 ?
                            <div>
                              {!index.attachment ?
                                <div className = "senderMessage" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                  onMouseLeave={() => this.handleMouseHover(1,null)} >
                                  {this.props.chatlog[urutan].receiver[0].read === false ?
                                    this.state.isHovering && this.state.timeDiv === index.time ?
                                      <div className = "hoverTextContainer">
                                        <div className = "hoverText" onClick = {() => this.MenuMessage()}>
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    :
                                    null
                                  }
                                  <p>{index.message}
                                    <div className = "timeSenderMessageManyLine">
                                      {this.getTimefromLog(index.time)}
                                    </div>
                                  </p>
                                </div>
                                :
                                <div className = "senderMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,index.time)} onMouseLeave={() => this.handleMouseHover(1,null)}>
                                  <div>
                                    {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                      <div className = "attachmentFileName">
                                        <p>{this.fileName(index.attachment.name)}</p>
                                        <img src = {doc}/>
                                          {this.props.chatlog[urutan].receiver[0].read === false ?
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {
                                                    this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                      <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                              null
                                              :
                                              this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {
                                                    this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                              null
                                          }
                                      </div>
                                      :
                                      <div className = "attachment-picture">
                                        <img src = {index.attachment.name}/>
                                          {this.props.chatlog[urutan].receiver[0].read === false ?
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                            <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                              <div className = "hoverAttachmentFile">
                                                {this.state.openMenu ?
                                                  <div className = "MenuMessage">
                                                    <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                    <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                  </div>
                                                  :
                                                  null
                                                }
                                              </div>
                                            </div>
                                            :
                                            null
                                          :
                                          this.state.isHovering && this.state.timeDiv === index.time ?
                                          <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                            <div className = "hoverAttachmentFile">
                                              {this.state.openMenu ?
                                                <div className = "MenuMessage">
                                                  <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                </div>
                                                :
                                                null
                                              }
                                            </div>
                                          </div>
                                          :
                                          null
                                          }
                                      </div>
                                    }
                                  </div>
                                  <p>{index.message}
                                    <div className = "timeSenderMessageManyLine">
                                      {this.getTimefromLog(index.time)}
                                    </div>
                                  </p>
                                </div>
                              }
                            </div>
                            :
                            <div>
                              {!index.attachment ?
                                <div className = "senderMessage" onMouseEnter={() =>this.handleMouseHover(0,index.time)} onMouseLeave={() => this.handleMouseHover(1,null)}>
                                  {this.props.chatlog[urutan].receiver[0].read === false ?
                                      this.state.isHovering && this.state.timeDiv === index.time ?
                                      <div className = "hoverTextContainer">
                                        <div className = "hoverText" onClick = {() => this.MenuMessage()}>
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :null
                                    :null
                                  }
                                  <p>{index.message}
                                    <div className = "timeSenderMessageOneLine">
                                      {this.getTimefromLog(index.time)}
                                    </div>
                                  </p>
                                </div>
                                : index.attachment && !index.message ?
                                <div className = "senderMessagePicOnly" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                  onMouseLeave={() => this.handleMouseHover(1,null)}>

                                  <div>
                                    {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                      <div className = "attachmentFileName">
                                        <p>{this.fileName(index.attachment.name)}</p>
                                        <img src = {doc}/>
                                        <div>
                                          {this.props.chatlog[urutan].receiver[0].read === false ?
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                      <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                              null
                                            :
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                              null
                                          }
                                        </div>
                                      </div>
                                      :
                                      <div className = "attachment-picture">
                                        <img src = {index.attachment.name}/>
                                        <div>
                                          {this.props.chatlog[urutan].receiver[0].read === false ?
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                      <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                              null
                                            :
                                            this.state.isHovering && this.state.timeDiv === index.time ?
                                              <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                <div className = "hoverAttachmentFile">
                                                  {this.state.openMenu ?
                                                    <div className = "MenuMessage">
                                                      <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                              </div>
                                              :
                                            null
                                          }
                                        </div>
                                      </div>
                                    }
                                  </div>
                                  <div className = "timeSenderMessageOneLine">
                                    {this.getTimefromLog(index.time)}
                                  </div>
                                </div>
                                :
                                <div className = "senderMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                  onMouseLeave={() => this.handleMouseHover(1,null)}>
                                  <div>
                                    {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                      <div className = "attachmentFileName">
                                        <p>{this.fileName(index.attachment.name)}</p>
                                        <img src = {doc}/>
                                          <div>
                                            {this.props.chatlog[urutan].receiver[0].read === false ?
                                              this.state.isHovering && this.state.timeDiv === index.time ?
                                                <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                  <div className = "hoverAttachmentFile">
                                                    {this.state.openMenu ?
                                                      <div className = "MenuMessage">
                                                        <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                        <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                      </div>
                                                      :
                                                      null
                                                    }
                                                  </div>
                                                </div>
                                                :
                                                null
                                              :
                                              this.state.isHovering && this.state.timeDiv === index.time ?
                                                <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                  <div className = "hoverAttachmentFile">
                                                    {this.state.openMenu ?
                                                      <div className = "MenuMessage">
                                                        <li onClick ={() => this.downloadFile(index.attachment.name)}>Download</li>
                                                      </div>
                                                      :
                                                      null
                                                    }
                                                  </div>
                                                </div>
                                                :
                                                null
                                            }
                                          </div>
                                      </div>
                                      :
                                      <div className = "attachment-picture">
                                        <img src = {index.attachment.name}/>
                                          <div>
                                            {this.props.chatlog[urutan].receiver[0].read === false ?
                                              this.state.isHovering && this.state.timeDiv === index.time ?
                                                <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                  <div className = "hoverAttachmentFile">
                                                    {this.state.openMenu ?
                                                      <div className = "MenuMessage">
                                                        <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                                        <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                      </div>
                                                      :
                                                      null
                                                    }
                                                  </div>
                                                </div>
                                                :
                                                null
                                              :
                                              this.state.isHovering && this.state.timeDiv === index.time ?
                                                <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                                  <div className = "hoverAttachmentFile">
                                                    {this.state.openMenu ?
                                                      <div className = "MenuMessage">
                                                        <li onClick ={() => this.viewImage(index.attachment.name)}>View</li>
                                                      </div>
                                                      :
                                                      null
                                                    }
                                                  </div>
                                                </div>
                                                :
                                                null
                                            }
                                          </div>
                                      </div>
                                    }
                                  </div>
                                  <p>{index.message}
                                    <div className = "timeSenderMessageOneLine">
                                      {this.getTimefromLog(index.time)}
                                    </div>
                                  </p>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                   )
                 }else{
                   return(
                    <div>
                      {this.getDateandTime(index.time,this.props.chatlog,urutan)}
                     <div className = "receiverMessageName">
                       {this.props.chatlog.length >= 0 ?
                         urutan === 0 ?
                           this.props.chatlog[urutan-1] === "undefined" ?
                             index.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                                 <p>{index.sender.name}</p>
                               :
                               null
                             :
                             <p>{index.sender.name}</p>
                           :
                           this.props.chatlog[urutan-1] !== "undefined" ?
                             index.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                                 <p>{index.sender.name}</p>
                               :
                               null
                             :
                             null
                         :
                         null
                       }
                     </div>
                     <div className = "MessageReceiver">
                       {index.message.split("\n").length > 1 || index.message.length > 78 ?
                         <div>
                           <div className = "receiverMessage">
                             <p>{index.message}
                               <div className = "timeReceiverMessageManyLine">
                                 {this.getTimefromLog(index.time)}
                               </div>
                             </p>
                           </div>
                         </div>
                         :
                         <div>
                           <div className = "receiverMessage">
                             <p>{index.message}
                               <div className = "timeReceiverMessageOneLine">
                                 {this.getTimefromLog(index.time)}
                               </div>
                             </p>
                           </div>
                         </div>
                       }
                     </div>
                   </div>
                   )
                  }
                }
              )
            }
        </div>
        <div style={{ float:"right", clear: "both"}}
          ref={(asd) => { this.messagesEnd = asd; }}/>
      </div>
        <Message
          senderUsername = {this.props.senderUsername}
          sender = {this.props.sender}
          recieve = {this.props.recieve}
          scroll = {this.scrollToBottom}
          chatId = {this.props.chatId}
        />
      </div>
    );
  }
}
