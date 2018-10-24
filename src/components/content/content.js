import React from 'react';
import './content.css';
import Message from '../text-message/text-message';


export default class Content extends React.Component{
  constructor(props){
    super(props)

    this.escOnClick= this.escOnClick.bind(this)
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

  componentDidMount() {
    document.addEventListener("keydown", this.escOnClick, false);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

<<<<<<< HEAD
  render(){
    const time = new Date();
    const timeHours = (time.getHours()<10?'0':'') + time.getHours();
    const timeMinute = (time.getMinutes()<10?'0':'') + time.getMinutes();
=======
  getTimefromLog(timestamp){
    let time  = new Date(timestamp)
    const getHours = (time.getHours() < 10 ? '0' : '') + time.getHours();
    const getMinute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
    return (getHours+':'+getMinute)
  }

  render(){
>>>>>>> ce0295e22ab5c4ee9b3006a9870b05113501ed6f
    return (
      <div>
        <div className = "content-container" id = "content-container">
          <div className = "content-chat">
              {this.props.chatlog.length < 1 ?
                 null
                 :
                 this.props.chatlog.map((index,urutan) =>{
<<<<<<< HEAD
                   if(index.send === 0){
=======
                   if(index.sender.username == this.props.senderUsername){
>>>>>>> ce0295e22ab5c4ee9b3006a9870b05113501ed6f
                     return(
                      <div className = "Message">
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
                     )
                   }else{
                     return(
                      <div>
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
                       <div className = "receiverMessage">
                         {index.message.split("\n").length > 1 || index.message.length > 78 ?
                           <div>
                             <p>{index.message}</p>
                             <div className = "timeReceiverMessageManyLine">
                               {index.time}
                             </div>
                           </div>
                           :
                           <p>{index.message}
                             <div className = "timeReceiverMessageOneLine">
                               {index.time}
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
