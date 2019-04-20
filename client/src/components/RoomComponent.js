import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const styles = {
  layout: {

  },
};

export default class RoomComponent extends Component {
  constructor(props) {
    super(props);

    this.roomRef = props.componentProps.roomRef;
    this.roomName = props.componentProps.roomName;
    this.uid = props.componentProps.uid;
    this.state = {
      users: []
    };

    // Register a listener for users to update state.
    let userRef = this.roomRef.child('users');
    userRef.on('value', (snapshot) => {
      console.log(snapshot.val());
      this.setState({
        users: Object.values(snapshot.val()).map((value) => {
          console.log(value);
          return value.nickName;
        })
      });
    });
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getList = () => {
    return this.state.users.map((user) => {
      return (
        <ListItem>
          <ListItemText primary={user} />
        </ListItem>
      )
    });
  }

  render() {
    return (
      <div style={styles.layout}>
        <Typography>
          Room name: {this.roomName}
        </Typography>
        <List>
          {this.getList()}
        </List>
      </div>
    );
  }
};
