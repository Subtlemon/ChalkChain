import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ChainLinkView from './ChainLinkView';

const styles = {
  layout: {

  },
  chainContainer: {

  },
  divider: {
    margin: '10px',
  },
  paper: {
    padding: '20px',
    margin: '10px',
  },
  headerContainer: {
    maxWidth: '500px',
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
    this.sharedRef = this.state.gameRef.child('spectateState');
    this.sharedRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          synced: true,
          sharedState: snapshot.val(),
        });
      }
    });

    // Load in all chain data.
    this.state.gameRef.child('chains').once('value').then((snapshot) => {
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

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.gameRef,
      players: props.players,
      userID: props.userID,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleStartSync = (event) => {
    this.sharedRef.set({
      chainID: this.state.userID,
    });
  }

  handleNext = (event) => {
    const chainIDs = Object.keys(this.state.chains);
    let idx = chainIDs.indexOf(this.state.sharedState.chainID) + 1;
    if (idx >= chainIDs.length) {
      idx = 0;
    }
    this.sharedRef.set({
      chainID: chainIDs[idx],
    });
  }

  handlePrevious = (event) => {
    const chainIDs = Object.keys(this.state.chains);
    let idx = chainIDs.indexOf(this.state.sharedState.chainID);
    if (idx === 0) {
      idx = chainIDs.length;
    }
    this.sharedRef.set({
      chainID: chainIDs[idx-1],
    });
  }

  handleLeave = (event) => {
    if (this.props.onLeave) {
      this.props.onLeave();
    } else {
      console.log('No onLeave handler found.');
    }
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getChainItems = (chainID) => {
    console.log('chains', this.state.chains);
    console.log('chainID', chainID);
    return [
      <Typography variant='h6'>
        The original word was: <b>{this.state.chains[chainID][0].word}</b>
      </Typography>,
      <Divider style={styles.divider} />,
      this.state.chains[chainID].slice(1).map((chainLink) => {
        return (
          <ChainLinkView data={chainLink} players={this.state.players} />
        );
      }),
    ];
  }
  
  getMainComponent = () => {
    if (this.state.chains) {
      let chainID = this.state.userID;
      if (this.state.sharedState && this.state.sharedState.chainID) {
        chainID = this.state.sharedState.chainID;
      }
      return (
        <div style={styles.chainContainer}>
          {this.getChainItems(chainID)}
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

  getHeader = () => {
    if (this.state.synced) {
      return (
        <div>
          <Typography variant='h5'>
            Reviewing Results
          </Typography>
          <Typography variant='subtitle1'>
            Let's see the results with everyone!
          </Typography>
          <Button
            variant='contained'
            onClick={this.handlePrevious}
            style={{margin: '5px'}}
          >
            Previous Chain
          </Button>
          <Button
            variant='contained'
            onClick={this.handleNext}
            style={{margin: '5px'}}
          >
            Next Chain
          </Button>
        </div>
      );
    } else {
      return(
        <div style={styles.headerContainer}>
          <Typography variant='h5'>
            Your Chain
          </Typography>
          <Typography variant='subtitle1'>
            Take a sneak peak at how your chalk chain turned out,
            then join everyone else in reviewing their results!
          </Typography>
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

  render() {
    return (
      <div style={styles.layout}>
        <Paper style={styles.paper}>
          {this.getHeader()}
        </Paper>
        <Paper style={styles.paper}>
          {this.getMainComponent()}
          <Divider style={styles.divider} />
          <Button
            variant='contained'
            onClick={this.handleLeave}
          >
            Back to Waiting Room
          </Button>
        </Paper>
      </div>
    );
  };
};
