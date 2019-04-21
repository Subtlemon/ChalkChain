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

    this.roomRef = props.roomRef;
    this.roomName = props.roomName;
    this.uid = props.viewProps.uid;
    this.state = {
      users: []
    };

  }

  /***************************************************************************
   * Lifecycle functions                                                     *
   ***************************************************************************/

  componentDidMount = () => {
    // Register a listener for users to update state.
    this.userRef = this.roomRef.child('users');
    this.userRef.on('value', (snapshot) => {
      // Construct array of object's values' nickName.
      this.setState({
        users: Object.values(snapshot.val()).map((value) => {
          return value.nickName;
        })
      });
    });
  }

  componentWillUnmount() {
    this.userRef.off('value');
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
