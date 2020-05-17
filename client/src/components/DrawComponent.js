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
      timer: 60,
    };
  }

  componentDidMount = () => {
    this.progressPresenseRef = this.state.progressRef.child(this.state.chainID);
    this.progressPresenseRef.onDisconnect().remove();
    this.progressPresenseRef.set(false);
    this.setState({ready: false, timer: this.state.drawTime});

    // Set timer.
    this.intervalID = setInterval(() => {
      this.setState({timer: this.state.timer - 1});
      if (this.state.timer <= 0) {
        clearInterval(this.intervalID);
        if (!this.state.ready) {
          this.handleConfirmDrawing();
        }
      }
    }, 1000);
  }

  componentWillUnmount = () => {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
    delete this.chainRef;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.gameRef,
      progressRef: props.progressRef,
      players: props.players,
      drawTime: props.drawTime,
      userID: props.userID,
      chainID: props.chainID,
      numNotReady: props.numNotReady,
      data: props.data,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleConfirmDrawing = (event) => {
    if (this.chainRef) {
      this.chainRef.update({image: this.refs.drawing.refs.canvas.toDataURL()});
    } else {
      this.chainRef = this.state.gameRef.child('chains').child(this.state.chainID).push();
      this.chainRef.set({
        image: this.refs.drawing.refs.canvas.toDataURL(),
        userID: this.state.userID,
      });
    }

    if (!this.state.ready) {
      this.progressPresenseRef.remove().then(() => {
        this.progressPresenseRef.onDisconnect().cancel();
        delete this.progressPresenseRef;
      });
      this.setState({ready: true});
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
            You are drawing <b>{this.state.players[this.state.data.userID].nickName}</b>'s word:
          </Typography>
          <Typography variant='h5'>
            <b>{this.state.data.word}</b>
          </Typography>
        </Paper>
        <Divider style={styles.divider} />
        <DrawCanvas ref='drawing'/>
        <Divider style={styles.divider} />
        <Paper style={styles.paper}>
          <Typography variant='h6'>
            {this.state.timer ? this.state.timer + 's remaining' : ''}
          </Typography>
          <Typography>
            {this.state.numNotReady && this.state.ready ? 'Waiting on ' + this.state.numNotReady + ' players...' : ''}
          </Typography>
          <Button
            variant='contained'
            onClick={this.handleConfirmDrawing}
          >
            {this.state.ready ? 'Update Drawing' : 'Finished Drawing'}
          </Button>
        </Paper>
      </div>
    );
  }
};
