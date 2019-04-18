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
      room_name: ''
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleCreateRoom = () => {
    console.log("handleCreateRoom called with " + this.state.room_name);
  }
  
  handleJoinRoom = () => {
    console.log("handleJoinRoom called with " + this.state.room_name);
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  render() {
    const gridSpacing = 8;
    return (
      <div style={styles.layout}>
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            label='Room Name'
            value={this.state.room_name}
            onChange={(event) => this.setState({room_name: event.target.value})}
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
