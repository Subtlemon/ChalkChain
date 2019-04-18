import React, { Component } from 'react';
import './App.css';
import Entry from './components/Entry';

class App extends Component {

  /***************************************************************************
   * HTTPS Request Helpers                                                   *
   ***************************************************************************/

  handleJoinRoom = (streamURL, nickname) => {
    console.log("TODO: Stream at " + streamURL + " with name " + nickname);
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
            onJoinRoom={this.handleJoinRoom}
          />
        </header>
      </div>
    );
  }
}

export default App;
