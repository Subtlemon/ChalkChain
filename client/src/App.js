import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import './App.css';
import Entry from './components/Entry';

import RoomComponent from './components/RoomComponent';

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

    this.state = {
      mainComponent: 'ENTRY_VIEW',
      mainComponentProps: undefined
    };
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
    this.joinIfExist(
      roomName,
      nickName,
      this.onJoinedRoom,
      undefined,
      () => {
        window.alert('No room found with that name.');
      }
    );
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
  joinIfNotExist = (roomName, nickName, onSuccess, onError, onRoomExist) => {
    const roomUrl = '/rooms/' + roomName;
    let roomRef = firebase.database().ref(roomUrl);
    // Note: This transaction is only to check existence of the room.
    return roomRef.transaction((currentData) => {
      if (currentData === null) {
        // Not exactly sure if this does what I want, but it works, so :/
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
        // Note: This assumes set cannot fail.
        presenseRef.set({
          nickName: nickName
        }).then(() => onSuccess(roomName, presenseRef.key));
      }
    });
  }

  /**
   * Attempts to join a room with roomName.
   *
   * On success, calls onSuccess with room name and user ID.
   * On no room, calls onNoRoom.
   * This function cannot actually call onError.
   */
  joinIfExist = (roomName, nickName, onSuccess, onError, onNoRoom) => {
    let roomRef = firebase.database().ref('/rooms');
    roomRef.once('value', (snapshot) => {
      if (snapshot.hasChild(roomName)) {
        let presenseRef = firebase.database().ref('/rooms/' + roomName + '/users').push();
        presenseRef.onDisconnect().remove();
        // Note: This assumes set cannot fail.
        presenseRef.set({
          nickName: nickName
        }).then(() => onSuccess(roomName, presenseRef.key));
      } else {
        onNoRoom();
      }
    });
  }

  onJoinedRoom = (roomName, userID) => {
    // Set a listener so server can issue state changes.
    let stateRef = firebase.database().ref('/rooms/' + roomName + '/states/' + userID);
    stateRef.on('value', this.onStateChange);
    // This assumes set cannot fail.
    stateRef.set({
      mainView: 'ROOM_VIEW',
      roomName: roomName,
      viewProps: {
        uid: userID,
      },
    });
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
   * Firebase Listeners                                                      *
   ***************************************************************************/

  onStateChange = (snapshot) => {
    this.setState(snapshot.val());
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.mainView == 'ROOM_VIEW') {
      return (
        <RoomComponent
          viewProps={this.state.viewProps}
          roomName={this.state.roomName}
          roomRef={firebase.database().ref('/rooms/' + this.state.roomName)}
        />
      );
    } else { // Default to ENTRY_VIEW.
      return (
        <Entry
          onJoinRoom={this.handleJoinRoom}
          onCreateRoom={this.handleCreateRoom}
        />
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.getMainComponent()}
        </header>
      </div>
    );
  }
}

export default App;
