import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

export default class GuessComponent extends Component {
  constructor(props) {
    super(props);

    this.roomRef = props.roomRef;
    this.roomName = props.roomName;
    this.uid = props.uid;
    this.state = {
      image: 'Debug image...'
    };
  }

  componentDidMount = () => {
    this.setState({ready: false});
  }

  static getDerivedStateFromProps(props, state) {
    return {
      nextNick: props.viewProps.nextNick,
      chainUid: props.viewProps.chainUid,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleConfirmGuess = (event) => {
    if (!this.state.guess) {
      window.alert("You didn't guess anything");
      return;
    }
    const request = {
      roomName: this.roomName,
      uid: this.uid,
      word: this.state.guess,
      chainUid: this.state.chainUid,
    };
    fetch('advance', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request)
    }).then(this.statusHandler)
    .then(() => this.setState({ready: true}))
    .catch((error) => window.alert('Request failed: ' + error));
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
        <Typography>
          You are guessing {this.state.nextNick}'s image "{this.state.image}"
        </Typography>
        <TextField
          label='What do you see?'
          value={this.state.guess}
          onChange={(event) => this.setState({guess: event.target.value})}
        />
        <Button
          variant='contained'
          onClick={this.handleConfirmGuess}
        >
          Guess
        </Button>
      </div>
    );
  }
};
