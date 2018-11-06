import React from 'react';
import './content.css';
import Message from '../text-message/text-message';


export default class Content extends React.Component {
  constructor(props){
    super(props)

    this.escOnClick= this.escOnClick.bind(this)
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escOnClick, false);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escOnClick, false);
  }

  escOnClick(event){
    if(event.keyCode === 27) {
      //Do whatever when esc is pressed
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
    if(index != 0){
      if(chat[index].date == chat[index-1].date){
        currentDate = 1
      }
      else {
        currentDate = 2
      }
    } else {
      currentDate = 2
    }
    if( currentDate == 1){
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


  render(){
    return (
      <div>
        <div className = {"content-container-"+this.props.checkrequest} id = "content-container">
          <div className = "content-chat">
              {this.props.chatlog.length < 1 ?
                 null
                 :
                 this.props.chatlog.map((index,urutan) =>{
                   if(index.sender.username == this.props.senderUsername){
                     return(
                      <div className = "MessageHeader">
                        {this.getDateandTime(index.time,this.props.chatlog,urutan)}
                        <div className = "senderMessageName">
                          {this.props.chatlog.length >= 0 ?
                            urutan == 0 ?
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
                        <div className = "Message">
                          {this.props.chatlog[urutan].receiver[0].read == true ?
                            <div className = "readChat">
                              Read
                            </div> :
                            null
                          }
                          <div className = "senderMessage">
                            {index.message.split("\n").length > 1 || index.message.length > 78 ?
                              <div>
                                {this.props.chatlog.image == null?
                                  console.log('bb')
                                  :
                                  console.log('asda')
                                }
                                <p>{index.message}</p>
                                <div className = "timeSenderMessageManyLine">
                                  {this.getTimefromLog(index.time)}
                                </div>
                              </div>
                              :
                              <p>{index.message}
                                <div className = "timeSenderMessageOneLine">
                                  {this.getTimefromLog(index.time)}
                                </div>
                              </p>
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
                           urutan == 0 ?
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
                       <div className = "receiverMessage">
                         {index.message.split("\n").length > 1 || index.message.length > 78 ?
                           <div>
                             <p>{index.message}</p>
                             <div className = "timeReceiverMessageManyLine">
                               {this.getTimefromLog(index.time)}
                             </div>
                           </div>
                           :
                           <p>{index.message}
                             <div className = "timeReceiverMessageOneLine">
                               {this.getTimefromLog(index.time)}
                             </div>
                           </p>
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
