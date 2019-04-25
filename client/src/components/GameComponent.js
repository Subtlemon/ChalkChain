import React, { Component } from 'react';

import GamePhaseComponent from './GamePhaseComponent';
import SpectateComponent from './SpectateComponent';
import StartComponent from './StartComponent';

const styles = {
  layout: {

  },
};

export default class GameComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainView: 'START_VIEW',
    };
  }

  componentDidMount = () => {
    // Establish presense in game.
    this.presenseRef = this.state.gameRef.child('activePlayers').child(this.state.userID);
    this.presenseRef.onDisconnect().remove();
    this.presenseRef.set(this.state.userID);

    // Set listener to progress through game if everybody is ready.
    this.progressRef = this.state.gameRef.child('notReady');
    this.progressRef.on('value', (snapshot) => {
      if (!snapshot.val()) {
        this.progressGame();
      }
    });

    this.setState({mainView: 'START_VIEW', chainID: this.state.userID});
  }

  componentWillUnmount = () => {
    this.progressRef.off();
    delete this.progressRef;
    this.presenseRef.remove().then(() => {
      this.presenseRef.onDisconnect().cancel();
      delete this.presenseRef;
    });
  }

  static getDerivedStateFromProps(props, state) {
    return {
      gameRef: props.viewProps.gameRef,
      settings: props.viewProps.settings,
      userID: props.userID,
    };
  }

  /***************************************************************************
   * Progression Event                                                       *
   ***************************************************************************/

  progressGame = () => {
    const nextChain = this.state.settings.order[this.state.chainID].next;
    if (nextChain === this.state.userID) {
      // We've gone full circle.
      this.setState({
        mainView: 'SPECTATE_VIEW',
      });
    } else {
      this.setState({
        mainView: 'GAME_PHASE_VIEW',
        chainID: nextChain,
      });
    }
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.mainView === 'GAME_PHASE_VIEW') {
      return (
        <GamePhaseComponent
          gameRef={this.state.gameRef}
          progressRef={this.state.gameRef.child('notReady')}
          settings={this.state.settings}
          chainID={this.state.chainID}
          userID={this.state.userID}
        />
      );
    } else if (this.state.mainView === 'SPECTATE_VIEW') {
      return (
        <SpectateComponent
          gameRef={this.state.gameRef}
          players={this.state.settings.players}
          userID={this.state.userID}
          onLeave={this.props.onLeave}
        />
      );
    } else { // Default to START_VIEW.
      return (
        <StartComponent
          gameRef={this.state.gameRef}
          progressRef={this.state.gameRef.child('notReady')}
          chainID={this.state.userID}
          prevID={this.state.settings.order[this.state.userID].prev}
          players={this.state.settings.players}
        />
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
