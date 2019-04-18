import React, { Component } from 'react';
import logo from '../logo.svg';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = {
  layout: {
    
  },
}

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

  handleCreateRoom = () => {
    if (this.props.onCreateRoom) {
      this.props.onCreateRoom(this.state.roomName);
    }
  }
  
  handleJoinRoom = () => {
    if (this.props.onJoinRoom) {
      this.props.onJoinRoom(this.state.roomName);
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
