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
      data: props.data
    };
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getMainComponent = () => {
    if (this.state.data.word) {
      return (
        <Typography variant='subtitle1'>
          <b>{this.state.data.nickName}</b> guessed: <b>{this.state.data.word}</b>
        </Typography>
      );
    } else {
      return [
        <Typography>
          <b>{this.state.data.nickName}</b> drew this:
        </Typography>,
        <img src={this.state.data.image} alt='Broken Image, Sorry!'/>
      ];
    }
  }

  // TODO: This is ugly AF.
  render() {
    return (
      <div style={styles.layout}>
        {this.getMainComponent()}
      </div>
    );
  }

};
