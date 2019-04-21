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

    this.state = {
      image: 'Debug image...'
    };
  }

  componentDidMount = () => {
    this.setState({ready: false});
  }

  componentWillUnount = () => {
    delete this.chainRef;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      roomRef: props.roomRef,
      roomName: props.roomName,
      uid: props.uid,
      nickName: props.nickName,
      chainUid: props.viewProps.chainUid,
      nextNick: props.viewProps.nextNick,
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

    if (this.chainRef) {
      this.chainRef.update({word: this.state.guess});
    } else {
      // Push a new link in the chain and update server.
      this.chainRef = this.state.roomRef.child('chains').child(this.state.chainUid).push();
      this.chainRef.set({
        uid: this.state.uid,
        nickName: this.state.nickName,
        word: this.state.guess,
      });
    }

    if (!this.state.ready) {
      const request = {
        roomName: this.state.roomName,
        uid: this.state.uid,
        word: this.state.guess,
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
