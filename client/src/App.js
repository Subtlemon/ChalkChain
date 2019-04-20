import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import './App.css';
import Entry from './components/Entry';

import TestComponent from './components/TestComponent';

class App extends Component {
  constructor(props) {
    super(props);

    // Initialize Firebase
    const config = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
    };
    firebase.initializeApp(config);
  }

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
          <TestComponent firebase={firebase.database()} />
          <Entry
            onJoinRoom={this.handleJoinRoom}
          />
        </header>
      </div>
    );
  }
}

export default App;
