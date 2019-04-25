import React, { Component } from 'react';

// Material-ui core.
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Icons.
import UserActive from '@material-ui/icons/AccountBox';
import UserInactive from '@material-ui/icons/AccountBox';

const styles = {
  layout: {

  },
  paper: {
    padding: '30px',
    margin: '10px',
  },
  divider: {
    margin: '10px',
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  settingsRow: {
    marginBottom: '10px',
  },
  textField: {
    marginLeft: '5px',
    marginRight: '5px',
  }
};

export default class RoomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      sharedState: {
        drawTime: 60,
      },
    };
  }

  /***************************************************************************
   * Lifecycle functions                                                     *
   ***************************************************************************/

  componentDidMount = () => {
    // Register a listener for users to update list of users in room.
    this.userRef = this.state.roomRef.child('users');
    this.userRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        // Construct array of object's values' nickName.
        this.setState({
          users: snapshot.val(),
        });
      }
    });

    // Register a listener for shared room state, such as round time limit.
    this.sharedRef = this.state.roomRef.child('waitingState');
    this.sharedRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('sharedState:', snapshot.val());
        this.setState({
          sharedState: snapshot.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.userRef.off('value');
    this.sharedRef.off('value');
  }

  static getDerivedStateFromProps(props, state) {
    return {
      roomRef: props.roomRef,
      roomName: props.roomName,
      userID: props.userID,
    };
  }

  /***************************************************************************
   * Button Events                                                           *
   ***************************************************************************/

  handleSaveButton = (event) => {
    // This assumes set cannot fail.
    this.sharedRef.set(this.state.sharedState);
  }

  handleStartButton = (event) => {
    console.log('this.state.users: ', this.state.users);
    if (!this.state.users) {
      window.alert('Internal Error: No users found.');
      return;
    }

    // Determine gameplay order based on user state.
    const userIDs = Object.keys(this.state.users);
    const usersLength = userIDs.length;
    if (usersLength < 2) {
      window.alert("Can't start game with less than 2 players.");
      return;
    }
    let order = {};
    order[userIDs[0]] = {
      prev: userIDs[usersLength - 1],
    };
    for (let i = 1; i < usersLength; ++i) {
      order[userIDs[i]] = {
        prev: userIDs[i-1],
      };
      order[userIDs[i-1]].next = userIDs[i];
    }
    order[userIDs[usersLength - 1]].next = userIDs[0];
    console.log('order:', order);

    return this.state.roomRef.child('game').transaction((currentData) => {
      if (currentData === null) {
        return {
          settings: Object.assign(this.state.sharedState, {order: order}),
        };
      } else {
        return; // Abort the transaction.
      };
    }, (error, committed, snapshot) => {
      if (error) {
        window.alert('Error: ' + error);
      } else if (!committed) {
        window.alert('Game is already started.');
      } else {
        console.log('Game started successfully.');
      }
    });
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getUserListItems = () => {
    if (this.state.users && this.state.users.length) {
      return Object.values(this.state.users).map((user) => {
        return (
          <ListItem>
            <ListItemIcon>
              <UserActive />
            </ListItemIcon>
            <ListItemText
              primary={user.nickName}
              primaryTypographyProps={{variant: 'h6'}}
            />
          </ListItem>
        );
      }).reduce((prev, curr) => [prev, <Divider />, curr]);
    } else {
      return (
        <ListItem>
          <ListItemText primary="You've somehow entered a ghost room.
            It's probably in your best interest to leave."/>
        </ListItem>
      );
    }
  }

  render() {
    return (
      <div style={styles.layout}>
        <Paper style={styles.paper}>
          <Typography variant='h4'>
            Room Name: <b>{this.state.roomName}</b>
          </Typography>
          <Typography variant='subtitle1'>
            Ask your friends to join using the above room name!
          </Typography>
          <Divider variant='middle' style={styles.divider} />
          <div style={styles.settingsContainer}>
            <div style={styles.settingsRow}>
              <TextField
                label='Round Theme (unused)'
                value={this.state.sharedState.theme}
                onChange={(event) => this.setState({sharedState: {theme: event.target.value}})}
                style={styles.textField}
              />
              <TextField
                required
                label='Seconds per drawing'
                type='number'
                value={this.state.sharedState.drawTime}
                onChange={(event) => this.setState({sharedState: {drawTime: event.target.value}})}
                style={styles.textField}
              />
            </div>
            <Button variant='contained' onClick={this.handleSaveButton}>Save Settings</Button>
          </div>
        </Paper>
        <Paper style={styles.paper}>
          <Typography variant='h5'>
            Lobby
          </Typography>
          <List>
            {this.getUserListItems()}
          </List>
          <Button variant='contained' onClick={this.handleStartButton}>Start Game</Button>
        </Paper>
      </div>
    );
  }
};
