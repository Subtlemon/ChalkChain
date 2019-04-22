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
        console.log(chains);
      }
    });
  }

  componentWillUnmount() {
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

  

  /***************************************************************************
   * HTTPS Request Helpers                                                   *
   ***************************************************************************/

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
        <Typography>
          debug synced
        </Typography>
      );
    } else {
      return (
        <Typography>
          debug not synced
        </Typography>
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
