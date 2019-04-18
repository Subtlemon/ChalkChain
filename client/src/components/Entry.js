import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = {
  layout: {

  },
}

export default class Entry extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const gridSpacing = 8;
    return (
      <div style={styles.layout}>
        <Grid container direction='column' spacing={gridSpacing}>
          <TextField
            label='Room Name'
          />
          <Grid item>
            <Grid container direction='row' spacing={gridSpacing}>
              <Grid item>
                <Button
                  variant='contained'
                  onClick={this.handleCreateRoom}
                >
                  Create Room
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  onClick={this.handleJoinRoom}
                >
                  Join Room
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
