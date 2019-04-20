import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

/**
 * Tomfoolery
 */
export default class TestComponent extends Component {
  constructor(props) {
    super(props);

    this.firebase = props.firebase;
  }

  handleButtonClick = () => {
    const tempref = this.firebase.ref('/test');
    // Get.
    tempref.once('value').then(function(snapshot) {
      console.log(snapshot);
      console.log(snapshot.key);
      console.log(snapshot.val());
    });
    // Listener.
    tempref.on('value', function(snapshot) {
      console.log(snapshot);
      console.log(snapshot.key);
      console.log(snapshot.val());
    });
    // Presense.
    const presenseref = this.firebase.ref('/test2/me');
    presenseref.onDisconnect().remove();
    presenseref.set({ 
      hello: 'world'
    });
  }

  render() {
    return(
      <div style={styles.layout}>
        <Typography ref='test'>Asdf</Typography>
        <Button onClick={this.handleButtonClick}>Test</Button>
      </div>
    );
  }
}
