import React from 'react';
import './content.css';
import Message from '../text-message/text-message';
import doc from '../../picture/doc.png';
import {
  recieveSocket,
  sendSocket,
  closeSocket
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
      length:0
    }
    this.escOnClick= this.escOnClick.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escOnClick, false);
    // this.picture.addEventListener("contextmenu", this.rightClick, false);
    // this.contextContainer.addEventListener('click', this._handleClick,false);
    // this.contextContainer.addEventListener('scroll', this._handleScroll,false);
    // document.getElementById("content-container").addEventListener("scroll", this.Scrolling,false);
    this.contextContainer.addEventListener('scroll',this.handleScroll,false);
    this.scrollToBottom();
    this.scrollMyChatroomSocket();
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
    this.contextContainer.removeEventListener('scroll',this.handleScroll,false);
    // this.picture.removeEventListener("contextmenu", this.rightClick,false);
    // this.contextContainer.removeEventListener('click', this._handleClick,false);
    // this.contextContainer.removeEventListener('scroll', this._handleScroll,false);
    // document.getElementById("content-container").removeEventListener("scroll", this.Scrolling,false);
  }

  handleScroll = (event) =>{

      let scrollTop = Math.round(this.contextContainer.scrollTop);
      let scrollHeight = this.contextContainer.scrollHeight;
      let offsetHeight = this.contextContainer.offsetHeight;
      let clientHeight = this.contextContainer.clientHeight;
      let oneLastMessage =  Math.round(scrollHeight - scrollTop);
      //scrollHeight - scrollTop = offsetHeight
      // console.log(scrollTop);
      // console.log(scrollHeight);
      // console.log(offsetHeight);
      // console.log(clientHeight);
      // console.log(oneLastMessage);
      recieveSocket ('scrollOtherChatroom',(err,recieve) =>{
        if((scrollTop + offsetHeight) === scrollHeight) {
          this.scrollToBottom()
        }

    })
  }

  scrollMyChatroomSocket(){
    recieveSocket ('scrollMyChatroom',(err,recieve) =>{
      this.scrollToBottom()
    })
  }

  scrollOtherChatroomSocket(){

  }

  // rightClick(event){
  //   if (event.type === 'click') {
  //     console.log('Left click');
  //   } else if (event.type === 'contextmenu') {
  //     event.preventDefault();
  //     this.setState({
  //       visible: true
  //     });
  //
  //       const clickX = event.clientX;
  //       const clickY = event.clientY;
  //       const screenW = this.picture.offsetWidth;
  //       const screenH = this.picture.offsetHeight;
  //       const rootW = this.context.clientWidth;
  //       const rootH = this.context.clientHeight;
  //       const right = (screenW - clickX) > rootW;
  //       const left = !right;
  //       const top = (screenH - clickY) > rootH;
  //       const bottom = !top;
  //       console.log(right);
  //       console.log(left);
  //       console.log(top);
  //       console.log(bottom);
  //       console.log(this);
  //       console.log(clickX);
  //       console.log(clickY);
  //       console.log(screenW);
  //       console.log(screenH);
  //       console.log(rootW);
  //       console.log(rootH);
  //       if (right) {
  //           this.context.style.left = `${clickX + 5}px`;
  //       }
  //
  //       if (left) {
  //           this.context.style.left = `${clickX - rootW - 5}px`;
  //       }
  //
  //       if (top) {
  //           this.context.style.top = `${clickY + 5}px`;
  //       }
  //
  //       if (bottom) {
  //           this.context.style.top = `${clickY - rootH - 5}px`;
  //       }
  //   }
  // }
  //
  // _handleClick = (event) => {
  //       const { visible } = this.state;
  //       const wasOutside = !(event.target.contains === this.context);
  //
  //       if (wasOutside && visible) this.setState({ visible: false });
  //   };
  //
  // _handleScroll = () => {
  //   const { visible } = this.state;
  //   if (visible) this.setState({ visible: false });
  // };

  // Scrolling = (event) => {
  //   var doc = document.getElementById("content-container")
  //   var x = doc.scrollTop;
  //   var y = event.timeStamp;
  //
  //   const { timeFixed } = this.state
  //
  //   if(y > this.prev) {
  //     !timeFixed && this.setState({ timeFixed: true })
  //   }
  //   if(x !== 0){
  //     !timeFixed && this.setState({ timeFixed: true })
  //   }
  //   else{
  //     this.setState({ timeFixed: false })
  //   }
  //   this.prev = y
  //
  //   console.log("ini y ",y);
  //   console.log("ini x ",x);
  //   console.log("ini prev: ",this.prev);
  // }

  escOnClick(event){
    if(event.keyCode === 27) {
      //Do whatever when esc is pressed
      this.props.escClicked()
    }
  }

  scrollToBottom = () => {
    if(this.messagesEnd.scrollIntoView !== null){
      this.messagesEnd.scrollIntoView({behavior : "auto", block : "end"});
    }
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

  // timeFloatFixed = () =>{
  //   let classHide = this.state.timeFixed ? "hide" : ""
  //   return(
  //     <div className = {"timeFixed-"+classHide}>
  //       ASD
  //     </div>
  //   )
  // }

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

  unsendMessage = (chatId,timeStamp) =>{
    console.log(timeStamp);
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
          this.handleMouseHover;
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
    return (
      <div>
        <div className = {"content-container-"+this.props.checkrequest} id = "content-container" ref={ref => {this.contextContainer = ref}}>
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
                                    {
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
                                    }
                                    <p>{index.message}
                                      <div className = "timeSenderMessageManyLine">
                                        {this.getTimefromLog(index.time)}
                                      </div>
                                    </p>
                                  </div>
                                  :
                                  <div className = "senderMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,index.time)} onMouseLeave={() => this.handleMouseHover(1,null)}>
                                    {
                                      this.state.isHovering && this.state.timeDiv === index.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick = {() => this.unsendMessage(index.chatId,index.time)}>Unsend</li>
                                              <li onClick ={() => this.downloadFile(index.attachment.name)} >Download</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                    <div>
                                      {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                        <div className = "attachmentFileName">
                                          <p>{this.fileName(index.attachment.name)}</p>
                                          <img src = {doc}/>
                                        </div>
                                        :
                                        <div className = "attachment-picture">
                                          <img src = {index.attachment.name}/>
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
                                    {
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
                                            {
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
                                            }
                                          </div>
                                        </div>
                                        :
                                        <div className = "attachment-picture">
                                          <img src = {index.attachment.name}/>
                                          <div>
                                            {
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
                                              {
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
                                              }
                                            </div>
                                        </div>
                                        :
                                        <div className = "attachment-picture">
                                          <img src = {index.attachment.name}/>
                                            <div>
                                              {
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
                             {!index.attachment ?
                               <div className = "receiverMessage">
                                 <p>{index.message}
                                   <div className = "timeReceiverMessageManyLine">
                                     {this.getTimefromLog(index.time)}
                                   </div>
                                 </p>
                               </div>
                               :
                               <div className = "receiverMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                 onMouseLeave={() => this.handleMouseHover(1,null)}>
                                 <div>
                                   {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                     <div className = "attachmentFileName">
                                       <p>{this.fileName(index.attachment.name)}</p>
                                       <img src = {doc}/>
                                         <div>
                                           {
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
                                           {
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
                                   <div className = "timeReceiverMessageManyLine">
                                     {this.getTimefromLog(index.time)}
                                   </div>
                                 </p>
                               </div>
                             }
                           </div>
                           :
                           <div>
                             {!index.attachment ?
                               <div className = "receiverMessage">
                                 <p>{index.message}
                                   <div className = "timeReceiverMessageOneLine">
                                     {this.getTimefromLog(index.time)}
                                   </div>
                                 </p>
                               </div>
                               : index.attachment && !index.message ?
                               <div className = "receiverMessagePicOnly" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                 onMouseLeave={() => this.handleMouseHover(1,null)}>
                                 <div>
                                   {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                     <div className = "attachmentFileName">
                                       <p>{this.fileName(index.attachment.name)}</p>
                                       <img src = {doc}/>
                                         <div>
                                           {
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
                                           {
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
                                 <div className = "timeReceiverMessageOneLine">
                                   {this.getTimefromLog(index.time)}
                                 </div>
                               </div>
                               :
                               <div className = "receiverMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,index.time)}
                                 onMouseLeave={() => this.handleMouseHover(1,null)}>
                                 <div>
                                   {index.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                     <div className = "attachmentFileName">
                                       <p>{this.fileName(index.attachment.name)}</p>
                                       <img src = {doc}/>
                                         <div>
                                           {
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
                                           {
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
                                   <div className = "timeReceiverMessageOneLine">
                                     {this.getTimefromLog(index.time)}
                                   </div>
                                 </p>
                               </div>
                             }
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
            ref={(asd) => { this.messagesEnd = asd; }}>
        </div>
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
