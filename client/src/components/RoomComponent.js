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
          users: Object.values(snapshot.val()).map((value) => {
            return value.nickName;
          })
        });
      }
    });

    // Register a listener for shared room state, such as round time limit.
    this.sharedRef = this.state.roomRef.child('waiting_room_state');
    this.sharedRef.on('value', (snapshot) => {
      if (snapshot.val()) {
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
      uid: props.uid,
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
    const request = {
      roomName: this.state.roomName,
      settings: this.state.sharedState,
    };
    // Save shared state to firebase, then ask server to start game.
    this.sharedRef.set(this.state.sharedState).then(() => {
      fetch('start', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
      }).then(this.statusHandler)
      .catch((error) => { window.alert('Request failed: ' + error) });
      // Do nothing on success, raise alert on failure.
    });
  }

  /***************************************************************************
   * HTTPS Request Helpers                                                   *
   ***************************************************************************/

  statusHandler = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  getUserListItems = () => {
    if (this.state.users && this.state.users.length) {
      return this.state.users.map((user) => {
        return (
          <ListItem>
            <ListItemIcon>
              <UserActive />
            </ListItemIcon>
            <ListItemText primary={user} primaryTypographyProps={{variant: 'h6'}} />
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

  // TODO: This is ugly AF.
  render() {
    return (
      <div style={styles.layout}>
        <Paper style={styles.paper}>
          <Typography variant='h4'>
            Room Name: {this.state.roomName}
          </Typography>
          <Typography variant='subtitle1'>
            Ask your friends to join using the above room name!
          </Typography>
          <Divider variant='middle' style={styles.divider} />
          <div style={styles.settingsContainer}>
            <div style={styles.settingsRow}>
              <TextField
                label='Round Theme'
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
