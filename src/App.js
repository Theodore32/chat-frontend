import React, { Component } from 'react';
import WelcomePage from './components/welcome-page/welcome-page';
import './App.css';

class App extends Component {

  render() {
    return(
      <div className="App">
        <center>
          <WelcomePage/>
        </center>
      </div>
    );
  }
}

export default App;
