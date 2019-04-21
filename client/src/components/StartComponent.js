import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

export default class StartComponent extends Component {
  constructor(props) {
    super(props);
    
    this.roomRef = props.roomRef;
    this.uid = props.uid;
    this.state = {

    };
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  // TODO: This is literally nothing.
  render() {
    return (
      <div style={styles.layout}>
        <Typography>
          start component test
        </Typography>
      </div>
    );
  }
};
