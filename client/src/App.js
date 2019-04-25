import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import './App.css';
import Entry from './components/Entry';
import RoomComponent from './components/RoomComponent';
import GameComponent from './components/GameComponent';

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
      mainView: 'ENTRY_VIEW',
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

  /***************************************************************************
   * Entry Request Helpers                                                   *
   ***************************************************************************/

  /**
   * Recursively attempts to create a room with a random name.
   *
   * On success, calls onSuccess with room name, user ID, and nickname.
   *    Also sets a presense node under /rooms/<roomName>/users/<userID>
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
   * On success, calls onSuccess with room name, user ID, and nickname.
   *    Also sets a presense node under /rooms/<roomName>/users/<userID>
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
          onRoomExist(nickName, onSuccess, onError);
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
   *    Also sets a presense node under /rooms/<roomName>/users/<userID>
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

  /**
   * Moves self to waiting room, and sets a watch for game start.
   *    Watches /rooms/<roomName>/game, and moves to GAME_VIEW if userID is
   *    found under game/settings/order (AKA user is supposed to be in game).
   *
   * Note: This function can fail, but has no error handling.
   */
  onJoinedRoom = (roomName, userID) => {
    let gameRef = firebase.database().ref('/rooms/' + roomName + '/game');
    this.setState({
      mainView: 'ROOM_VIEW',
      viewProps: {
      },
      roomName: roomName,
      userID: userID,
    });
    gameRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value && value.settings && value.settings.order) {
        if (value.settings.order[userID]) {
          this.setState({
            mainView: 'GAME_VIEW',
            viewProps: {
              settings: value.settings,
              gameRef: snapshot.ref,
            },
          });
          snapshot.ref.off('value');
        } // else: user was not included in game, wait until next game.
      }
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
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.mainView === 'ROOM_VIEW') {
      return (
        <RoomComponent
          viewProps={this.state.viewProps}
          roomName={this.state.roomName}
          userID={this.state.userID}
          roomRef={firebase.database().ref('/rooms/' + this.state.roomName)}
        />
      );
    } else if (this.state.mainView === 'GAME_VIEW') {
      return (
        <GameComponent
          viewProps={this.state.viewProps}
          userID={this.state.userID}
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
