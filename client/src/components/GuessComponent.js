import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
  paper: {
    padding: '20px',
  },
  divider: {
    margin: '10px',
  },
};

export default class GuessComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount = () => {
    this.progressPresenseRef = this.state.progressRef.child(this.state.chainID);
    this.progressPresenseRef.onDisconnect().remove();
    this.progressPresenseRef.set(false);
    this.setState({ready: false});
  }

  componentWillUnount = () => {
    delete this.chainRef;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.gameRef,
      progressRef: props.progressRef,
      players: props.players,
      chainID: props.chainID,
      userID: props.userID,
      data: props.data,
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
      this.chainRef = this.state.gameRef.child('chains').child(this.state.chainID).push();
      this.chainRef.set({
        word: this.state.guess,
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
            You are guessing <b>{this.state.players[this.state.data.userID].nickName}</b>'s image:
          </Typography>
        </Paper>
        <Divider style={styles.divider}/>
        <Paper>
          <img ref='img' alt='guess' src={this.state.data.image} />
        </Paper>
        <Divider style={styles.divider} />
        <Paper style={styles.paper}>
          <TextField
            label='What do you see?'
            value={this.state.guess}
            onChange={(event) => this.setState({guess: event.target.value})}
          />
          <Button
            variant='contained'
            onClick={this.handleConfirmGuess}
          >
            {this.state.ready ? 'Guess Again' : 'Guess'}
          </Button>
        </Paper>
      </div>
    );
  }
};
