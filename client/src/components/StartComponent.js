import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

export default class StartComponent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ready: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      roomRef: props.roomRef,
      roomName: props.roomName,
      uid: props.uid,
      nickName: props.nickName,
      prevNick: props.viewProps.prevNick,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleConfirmWord = (event) => {
    if (!this.state.word) {
      window.alert('Please enter a word for people to draw');
      return;
    }

    if (this.state.ready) {
      // Already ready. Just update the last item in the chain.
      this.chainRef.update({word: this.state.word});
    } else {
      this.chainRef = this.state.roomRef.child('chains').child(this.state.uid).push();
      this.chainRef.set({
        word: this.state.word,
        uid: this.state.uid,
        nickName: this.state.nickName,
        chainUid: this.state.uid,
      });
      const request = {
        roomName: this.state.roomName,
        uid: this.state.uid,
        chainUid: this.state.uid
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

  // TODO: This is ugly AF.
  render() {
    return (
      <div style={styles.layout}>
        <Typography>
          You are selecting a word for: {this.state.prevNick}
        </Typography>
        <TextField
          label='Your word'
          value={this.state.word}
          onChange={(event) => this.setState({word: event.target.value})}
        />
        <Button
          variant='contained'
          onClick={this.handleConfirmWord}
        >
          Confirm
        </Button>
      </div>
    );
  }
};
