import React, { Component } from 'react';
import logo from '../logo.svg';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = {
  layout: {
    
  },
  textField: {
    margin: '5px',
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
    if (!this.state.nickName) {
      window.alert("No nickname entered.");
      return;
    }

    if (this.props.onCreateRoom) {
      this.props.onCreateRoom(this.state.roomName.toUpperCase(), this.state.nickName);
    } else {
      console.log("Component was not given a create room handler.");
    }
  }
  
  handleJoinRoom = () => {
    if (!this.state.nickName) {
      window.alert("No nickname entered.");
      return;
    }
    if (!this.state.roomName) {
      window.alert("No room name entered.");
      return;
    }

    if (this.props.onJoinRoom) {
      this.props.onJoinRoom(this.state.roomName.toUpperCase(), this.state.nickName);
    } else {
      console.log("Component was not given a join room handler.");
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
            style={styles.textField}
          />
          <TextField
            required
            label='Nickname'
            value={this.state.nickName}
            onChange={(event) => this.setState({nickName: event.target.value})}
            style={styles.textField}
          />
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
              variant='contained'
              onClick={this.handleCreateRoom}
              style={{flex: '1 1 auto', margin: '5px'}}
            >
              Create Room
            </Button>
            <Button
              variant='contained'
              onClick={this.handleJoinRoom}
              style={{flex: '1 1 auto', margin: '5px'}}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
