import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

export default class DrawComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: 'Loading word...'
    };
  }

  componentDidMount = () => {
    this.setState({ready: false});
  }

  componentWillUnmount = () => {
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

  handleConfirmDrawing = (event) => {
    if (!this.state.debug_image) {
      window.alert("You didn't draw anything");
      return;
    }

    if (this.chainRef) {
      this.chainRef.update({image: this.state.debug_image});
    } else {
      this.chainRef = this.state.roomRef.child('chains').child(this.state.chainUid).push();
      this.chainRef.set({
        uid: this.state.uid,
        nickName: this.state.nickName,
      });
    }
    if (!this.state.ready) {
      const request = {
        roomName: this.state.roomName,
        uid: this.state.uid,
        image: this.state.debug_image,
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
          You are drawing {this.state.nextNick}'s word "{this.state.word}".
        </Typography>
        <TextField
          label='debug only'
          value={this.state.debug_image}
          onChange={(event) => this.setState({debug_image: event.target.value})}
        />
        <Button
          variant='contained'
          onClick={this.handleConfirmDrawing}
        >
          Finished Drawing
        </Button>
      </div>
    );
  }
};
