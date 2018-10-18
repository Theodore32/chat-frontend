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

  render(){
    return (
      <div>
        <div className = "content-container" id = "content-container">
          <div className = "content-chat">
              {this.props.chatlog.length < 1 ?
                 null
                 :
                 this.props.chatlog.map((index,urutan) =>{
                   {console.log("ASD: ",index)}
                   if(index.send == 0){
                     return(
                      <div className = "Message">
                        <div className = "senderMessageName">
                          {this.props.chatlog.length >= 0 ?
                            urutan == 0 ?
                              this.props.chatlog[urutan-1] === "undefined" ?
                                index.sender !== this.props.chatlog[urutan-1].sender ?
                                    <p>{index.sender}</p>
                                  :
                                  null
                                :
                                <p>{index.sender}</p>
                              :
                              this.props.chatlog[urutan-1] !== "undefined" ?
                                index.sender !== this.props.chatlog[urutan-1].sender ?
                                    <p>{index.sender}</p>
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

                              </div>
                            </div>
                            :
                            <p>{index.message}
                              <div className = "timeSenderMessageOneLine">

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
                           urutan == 0 ?
                             this.props.chatlog[urutan-1] === "undefined" ?
                               index.sender !== this.props.chatlog[urutan-1].sender ?
                                   <p>{index.sender}</p>
                                 :
                                 null
                               :
                               <p>{index.sender}</p>
                             :
                             this.props.chatlog[urutan-1] !== "undefined" ?
                               index.sender !== this.props.chatlog[urutan-1].sender ?
                                   <p>{index.sender}</p>
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

                             </div>
                           </div>
                           :
                           <p>{index.message}
                             <div className = "timeReceiverMessageOneLine">

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
          sender = {this.props.sender}
          recieve = {this.props.recieve}
          scroll = {this.scrollBottom}
          chatId = {this.props.chatId}
        />
      </div>
    );
  }
}
