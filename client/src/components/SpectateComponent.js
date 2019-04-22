import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ChainLinkView from './ChainLinkView';

const styles = {
  layout: {

  },
  chainContainer: {

  },
  chainLink: {

  },
};

export default class SpectateComponent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      synced: false,
    };
  }

  /***************************************************************************
   * Lifecycle functions                                                     *
   ***************************************************************************/

  componentDidMount = () => {
    // Register a listener for shared room state.
    this.sharedRef = this.state.roomRef.child('spectate_state');
    this.sharedRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          synced: true,
          sharedState: snapshot.val(),
        });
      }
    });

    // Load in all chain data.
    this.state.roomRef.child('chains').once('value').then((snapshot) => {
      if (snapshot.val()) {
        let chains = {};
        snapshot.forEach((chainSnapshot) => {
          let thisChain = [];
          chainSnapshot.forEach((chainLinkSnapshot) => {
            thisChain.push(chainLinkSnapshot.val());
          });
          chains[chainSnapshot.key] = thisChain;
        });
        this.setState({
          chains: chains,
        });
      }
    });
  }

  componentWillUnmount() {
    let gameRef = this.state.roomRef.child('in_game').child(this.state.uid);
    gameRef.remove().then(() => {gameRef.cancel()});
    this.sharedRef.off('value');
  }

  static getDerivedStateFromProps(props, state) {
    return {
      roomRef: props.roomRef,
      roomName: props.roomName,
      uid: props.uid,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleStartSync = (event) => {
    this.sharedRef.set({
      chainUid: this.state.uid,
    });
  }

  handleNext = (event) => {
    const chainUids = Object.keys(this.state.chains);
    let idx = chainUids.indexOf(this.state.sharedState.chainUid) + 1;
    if (idx >= chainUids.length) {
      idx = 0;
    }
    this.sharedRef.set({
      chainUid: chainUids[idx],
    });
  }

  handlePrevious = (event) => {
    const chainUids = Object.keys(this.state.chains);
    let idx = chainUids.indexOf(this.state.sharedState.chainUid);
    if (idx == 0) {
      idx = chainUids.length;
    }
    this.sharedRef.set({
      chainUid: chainUids[idx-1],
    });
  }

  handleLeave = (event) => {
    this.state.roomRef.child('states').child(this.state.uid).set({
      mainView: 'ROOM_VIEW',
      viewProps: {},
    });
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getChainItems = (chainUid) => {
    return this.state.chains[chainUid].map((chainLink) => {
      return (
        <ChainLinkView data={chainLink} style={styles.chainLink} />
      );
    });
  }
  
  getMainComponent = () => {
    if (this.state.chains) {
      let chainUid = this.state.uid;
      if (this.state.sharedState && this.state.sharedState.chainUid) {
        chainUid = this.state.sharedState.chainUid;
      }
      return (
        <div style={styles.chainContainer}>
          {this.getChainItems(chainUid)}
        </div>
      );
    } else {
      return (
        <Typography>
          Loading results...
        </Typography>
      );
    }
  }

  getButtons = () => {
    if (this.state.synced) {
      return (
        <div style={styles.buttonContainer}>
          <Button
            variant='contained'
            onClick={this.handlePrevious}
          >
            Previous Chain
          </Button>
          <Button
            variant='contained'
            onClick={this.handleNext}
          >
            Next Chain
          </Button>
          <Button
            variant='contained'
            onClick={this.handleLeave}
          >
            Back to Waiting Room
          </Button>
        </div>
      );
    } else {
      return (
        <div style={styles.buttonContainer}>
          <Button
            variant='contained'
            onClick={this.handleStartSync}
          >
            Review Results
          </Button>
        </div>
      );
    }
  }

  // TODO: This is ugly AF.
  render() {
    return (
      <div style={styles.layout}>
        {this.getMainComponent()}
        {this.getButtons()}
      </div>
    );
  };
};
