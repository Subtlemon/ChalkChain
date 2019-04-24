import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
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
    this.state.roomRef.child('chains')
      .child(this.state.chainUid)
      .limitToLast(1)
      .once('child_added', (snapshot) => {
        if (snapshot.val()) {
          this.setState({word: snapshot.val().word});
        }
      });
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
    if (this.chainRef) {
      this.chainRef.update({image: this.refs.drawing.refs.canvas.toDataURL()});
    } else {
      this.chainRef = this.state.roomRef.child('chains').child(this.state.chainUid).push();
      this.chainRef.set({
        uid: this.state.uid,
        nickName: this.state.nickName,
        image: this.refs.drawing.refs.canvas.toDataURL(),
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
          <Typography variant='h6'>
            You are drawing <b>{this.state.nextNick}</b>'s word:
          </Typography>
          <Typography variant='h5'>
            <b>{this.state.word}</b>
          </Typography>
        </Paper>
        <Divider style={styles.divider} />
        <DrawCanvas ref='drawing'/>
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
