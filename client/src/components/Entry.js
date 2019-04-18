import React, { Component } from 'react';
import logo from '../logo.svg';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = {
  layout: {
    
  },
}

/**
 * Small entry component to create or join a room.
 *
 * Sends a create or join fetch request to the server. Server will respond
 * with a URL to open an EventSource with.
 */
export default class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: ''
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  // Consider skipping this process and simply calling onJoinRoom with a flag
  // to create the room if none exists.
  handleCreateRoom = () => {
    const request = {
      roomName: this.state.roomName,
      nickName: this.state.nickName
    };
    fetch('create', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then(this.statusHandler)
    .then((response) => {return response.text()})
    .then(this.entryResponseHandler)
    .catch((error) => { window.alert('Unexpected failure: ' + error) });
  }
  
  handleJoinRoom = () => {
    const request = {
      roomName: this.state.roomName,
      nickName: this.state.nickName
    };
    fetch('join', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then(this.statusHandler)
    .then((response) => {return response.text()})
    .then(this.entryResponseHandler)
    .catch((error) => { window.alert('Unexpected failure: ' + error) });
  }

  /***************************************************************************
   * HTTPS Request Helpers                                                   *
   ***************************************************************************/

  entryResponseHandler = (responseStr) => {
    const response = JSON.parse(responseStr);
    if (response && response.streamURL && response.nickname) {
      if (this.props.onJoinRoom) {
        this.props.onJoinRoom(response.streamURL, response.nickname);
      } else {
        console.log("No method registered for joining room. Request ignored.");
      }
    } else {
      if (response && response.error) {
        window.alert("Cannot join room. " + response.error);
      } else {
        window.alert("Malformed response from server. Request ignored.");
      }
    }
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
      <div style={styles.layout}>
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            label='Room Name'
            value={this.state.roomName}
            onChange={(event) => this.setState({roomName: event.target.value})}
          />
          <TextField
            label='Nickname'
            value={this.state.nickName}
            onChange={(event) => this.setState({nickName: event.target.value})}
          />
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
              variant='contained'
              onClick={this.handleCreateRoom}
              style={{flex: '1 1 auto'}}
            >
              Create Room
            </Button>
            <Button
              variant='contained'
              onClick={this.handleJoinRoom}
              style={{flex: '1 1 auto'}}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
