import React, { Component } from 'react';

import StartComponent from './StartComponent';
import SpectateComponent from './SpectateComponent';

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
    this.presenseRef = this.state.gameRef.child('players').child(this.state.userID);
    this.presenseRef.onDisconnect().remove();
    this.presenseRef.set(this.state.nickName);

    // Set listener to progress through game if everybody is ready.
    this.progressRef = this.state.gameRef.child('notReady');
    this.progressRef.on('value', (snapshot) => {
      if (!snapshot.val()) {
        this.progressGame();
      }
    });

    this.setState({mainView: 'START_VIEW'});
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
      chainID: props.userID,
      userID: props.userID,
      nickName: props.nickName,
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
      console.log('Moving to game phase view');
      return (
        <div><p>DEBUG</p></div>
      );
    } else if (this.state.mainView === 'SPECTATE_VIEW') {
      return (
        <SpectateComponent
          userID={this.state.userID}
          gameRef={this.state.gameRef}
        />
      );
    } else { // Default to START_VIEW.
      return (
        <StartComponent
          gameRef={this.state.gameRef}
          progressRef={this.state.gameRef.child('notReady')}
          chainID={this.state.chainID}
          nickName={this.state.nickName}
          prevNick={this.state.settings.order[this.state.chainID].prev}
        />
      );
    }
  }

  render() {
    return (
      <div>
        {this.getMainComponent()}
      </div>
    );
  }
};
