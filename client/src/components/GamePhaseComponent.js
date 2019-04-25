import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import DrawComponent from './DrawComponent';
import GuessComponent from './GuessComponent';

const styles = {
  layout: {

  },
  paper: {
    padding: '20px',
  },
};

export default class GamePhaseComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.chainID !== this.props.chainID) {
      this.updateChainLinkData();
    }
  }

  componentDidMount = () => {
    this.updateChainLinkData();
  }

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.gameRef,
      progressRef: props.progressRef,
      settings: props.settings,
      chainID: props.chainID,
      userID: props.userID,
    };
  }

  updateChainLinkData = () => {
    this.state.gameRef.child('chains').child(this.state.chainID)
      .limitToLast(1).once('child_added', (snapshot) => {
        if (snapshot.val()) {
          this.setState({chainLinkData: snapshot.val()});
        }
      });
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.chainLinkData && this.state.chainLinkData.image) {
      return (
        <GuessComponent
          gameRef={this.state.gameRef}
          progressRef={this.state.progressRef}
          players={this.state.settings.players}
          chainID={this.state.chainID}
          userID={this.state.userID}
          data={this.state.chainLinkData}
        />
      );
    } else if (this.state.chainLinkData && this.state.chainLinkData.word) {
      return (
        <DrawComponent
          gameRef={this.state.gameRef}
          progressRef={this.state.progressRef}
          players={this.state.settings.players}
          drawTime={this.state.settings.drawTime}
          chainID={this.state.chainID}
          userID={this.state.userID}
          data={this.state.chainLinkData}
        />
      );
    } else {
      return (
        <Paper style={styles.paper}>
          <Typography variant='h5'>
            Loading game phase...
          </Typography>
        </Paper>
      );
    }
  }

  render() {
    return (
      <div style={styles.layout}>
        {this.getMainComponent()}
      </div>
    );
  }
};
