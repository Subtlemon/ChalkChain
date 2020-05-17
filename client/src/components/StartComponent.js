import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
  paper: {
    padding: '20px',
  },
};

export default class StartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      word: '',
    };
  }

  componentDidMount = () => {
    this.progressPresenseRef = this.state.progressRef.child(this.state.chainID);
    this.progressPresenseRef.onDisconnect().remove();
    this.progressPresenseRef.set(false);
    this.setState({ready: false});
  }

  componentWillUnmount = () => {
    delete this.chainRef;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.gameRef,
      progressRef: props.progressRef,
      chainID: props.chainID,
      prevNick: props.players[props.prevID].nickName,
      users: props.players,
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

    if (this.chainRef) {
      this.chainRef.update({word: this.state.word});
    } else {
      this.chainRef = this.state.gameRef.child('chains').child(this.state.chainID).push();
      this.chainRef.set({
        word: this.state.word,
        userID: this.state.chainID,
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
            You are selecting a word for: <b>{this.state.prevNick}</b>
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
            {this.state.ready ? 'Update' : 'Confirm'}
          </Button>
        </Paper>
      </div>
    );
  }
};
