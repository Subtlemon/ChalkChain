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

    this.roomRef = props.roomRef;
    this.roomName = props.roomName;
    this.uid = props.uid;
    this.state = {
      word: 'Loading word...'
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

  handleConfirmDrawing = (event) => {
    if (!this.state.debug_image) {
      window.alert("You didn't draw anything");
      return;
    }
    const request = {
      roomName: this.roomName,
      uid: this.uid,
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
