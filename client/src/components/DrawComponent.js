import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import DrawCanvas from './DrawCanvas';

const styles = {
  layout: {

  },
  paper: {
    padding: '20px',
  },
  divider: {
    margin: '10px',
  }
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
        image: this.state.debug_image,
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

  render() {
    return (
      <div style={styles.layout}>
        <Paper style={styles.paper}>
          <Typography variant='h5'>
            You are drawing <b>{this.state.nextNick}</b>'s word: <b>{this.state.word}</b>.
          </Typography>
        </Paper>
        <Divider style={styles.divider} />
        <DrawCanvas ref='canvas' style={{height: '500px'}}/>
        <Button
          variant='contained'
          onClick={this.handleConfirmDrawing}
        >
          {this.state.ready ? 'Update Drawing' : 'Finished Drawing'}
        </Button>
      </div>
    );
  }
};
