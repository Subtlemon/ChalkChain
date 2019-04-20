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
      apiKey: "AIzaSyClKxVy0DcO8fSDemWvGIBgolbfDgX3jQo",
      authDomain: "chalkchain.firebaseapp.com",
      databaseURL: "https://chalkchain.firebaseio.com",
      projectId: "chalkchain",
      storageBucket: "chalkchain.appspot.com",
      messagingSenderId: "654172560168"
    };
    firebase.initializeApp(config);
    console.log(firebase.database());
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
