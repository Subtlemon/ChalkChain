import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Entry from './components/Entry';

class App extends Component {

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleCreateRoom = (roomName) => {
    console.log("handleCreateRoom called with " + roomName);
  }
  
  handleJoinRoom = (roomName) => {
    console.log("handleJoinRoom called with " + roomName);
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Entry
            onCreateRoom={this.handleCreateRoom}
            onJoinRoom={this.handleJoinRoom}
          />
        </header>
      </div>
    );
  }
}

export default App;
