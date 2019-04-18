import React, { Component } from 'react';
import './App.css';
import Entry from './components/Entry';

class App extends Component {

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleCreateRoom = (roomName) => {
    fetch('create', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomName: roomName})
    })
    .then(this.statusHandler)
    .then((response) => {return response.text()})
    .then(this.openSSE)
    .catch((error) => { window.alert('Request failed: ' + error) });
  }
  
  handleJoinRoom = (roomName) => {
    fetch('join', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomName: roomName})
    })
    .then(this.statusHandler)
    .then((response) => {return response.text()})
    .then(this.openSSE)
    .catch((error) => { window.alert('Request failed: ' + error) });
  }

  /***************************************************************************
   * HTTPS Request Helpers                                                   *
   ***************************************************************************/

  openSSE = (roomStr) => {
    const roomJSON = JSON.parse(roomStr);
    console.log(roomJSON);
  }

  statusHandler = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
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
