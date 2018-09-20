import React from 'react';
import './content.css';


export default class Content extends React.Component{
  constructor(props){
    super(props)

    this.escOnClick= this.escOnClick.bind(this)
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escOnClick, false);
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
  render(){
    return (
      <div className = "content-container">
        <div className = "content-chat">
        {this.props.chatlog.length < 1 ?
           null
           :
           this.props.chatlog.map((index) =>(
            <div>
              <p>{index.sender}</p>
              <p>{index.message}</p>
              <hr/>
            </div>
            )
        )}
        </div>
      </div>
    );
  }
}
