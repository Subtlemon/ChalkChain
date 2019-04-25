import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  }
};

export default class ChainLinkView extends Component {
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(props, state) {
    return {
      data: props.data,
      players: props.players,
    };
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.data.word) {
      return (
        <Typography variant='subtitle1'>
          <b>{this.state.players[this.state.data.userID].nickName}</b> 
          guessed: <b>{this.state.data.word}</b>
        </Typography>
      );
    } else {
      return [
        <Typography variant='subtitle1'>
          <b>{this.state.players[this.state.data.userID].nickName}</b> drew this:
        </Typography>,
        <img src={this.state.data.image} alt='Broken Image, Sorry!'/>
      ];
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
