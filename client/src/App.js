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
   * Entry Event Handlers                                                    *
   ***************************************************************************/

  handleCreateRoom = (roomName, nickName) => {
    if (roomName) {
      this.joinIfNotExist(
        roomName,
        nickName,
        this.onJoinedRoom,
        (error) => {
          window.alert('Failed to join room: ' + error);
        },
        () => {
          window.alert('Room already exists with that name.');
        }
      );
    } else {
      this.createRandomRoom(nickName, this.onJoinedRoom, (error) => {
        window.alert('Failed to join room: ' + error);
      });
    }
  }

  handleJoinRoom = (roomName, nickName) => {
    console.log("TODO: join " + roomName + " with name " + nickName);
  }

  // Currently unused.
  statusHandler = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  /***************************************************************************
   * Entry Request Helpers                                                   *
   ***************************************************************************/

  /**
   * Recursively attempts to create a room with a random name.
   *
   * On success, calls onSuccess with room name and user ID.
   * On error, returns error message.
   */
  createRandomRoom = (nickName, onSuccess, onError) => {
    this.joinIfNotExist(
      this.randomName(),    // Random room name.
      nickName,
      onSuccess,
      onError,
      this.createRandomRoom // Recursively retry with new room name.
    );
  }

  /**
   * Attempts to create a room with roomName.
   * 
   * On success, calls onSuccess with room name and user ID.
   * On error, returns error message.
   * On room exists, calls onRoomExist with nickname, onSuccess, and onError.
   */
  joinIfNotExist = (roomName, nickName, onSuccess, onError, onRoomExist = undefined) => {
    const roomUrl = '/rooms/' + roomName;
    let roomRef = firebase.database().ref(roomUrl);
    return roomRef.transaction((currentData) => {
      if (currentData === null) {
        return {
          users: null
        };
      } else {
        console.log('Room already exists.');
        return; // Abort the transaction.
      }
    }, (error, committed, snapshot) => {
      if (error) {
        onError(error);
      } else if (!committed) {
        if (onRoomExist) {
          onRoomExist(nickName);
        }
      } else {
        let presenseRef = firebase.database().ref(roomUrl + '/users').push();
        presenseRef.onDisconnect().remove();
        presenseRef.set({
          nickName: nickName
        }).then(() => onSuccess(roomName, presenseRef.key));
      }
    });
  }

  // TODO: this.
  onJoinedRoom = (roomName, userID) => {
    console.log('I have joined room ' + roomName + ' as ' + userID);
  }

  // Actually psuedorandom. Returns 6 digit hex number.
  randomName = () => {
    let buf = new Uint8Array(3);
    window.crypto.getRandomValues(buf);
    return Array.from(buf, function(decimal) {
      // Convert to hex, pad front with '0', then take last two characters.
      return ('0' + decimal.toString(16)).substr(-2);
    }).join('').toUpperCase();
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
            onCreateRoom={this.handleCreateRoom}
          />
        </header>
      </div>
    );
  }
}

export default App;
