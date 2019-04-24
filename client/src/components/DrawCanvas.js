import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import ClearIcon from '@material-ui/icons/Delete';

const styles = {
  canvas: {
    height: '100%',
    width: '100%',
  },
  canvasContainer: {
    height: '500px',
    width: '500px',
  },
  divider: {
    margin: '10px',
  },
  toolbar: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridColumnGap: '10px',
  },
  colours: {
    justifySelf: 'center',
    display: 'grid',
    gridColumnGap: '5px',
    gridRowGap: '5px',
    gridTemplateColumns: '40px 40px 40px 40px 40px',
    gridTemplateRows: '40px 40px',
  },
  misc: {
    justifySelf: 'center',
    display: 'grid',
    gridColumnGap: '5px',
    gridRowGap: '5px',
    gridTemplateColumns: '40px 40px',
    gridTemplateRows: '40px 40px',
  },
};

// Assumes canvas cannot transform.
export default class DrawCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colour: 'black',
      radius: 3,
    };
  }

  componentDidMount() {
    let canvas = this.refs.canvas;
    this.ctx = canvas.getContext('2d');

    // Resize the canvas to fit parent.
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    this.ctx.fillStyle = 'white';
    this.clearscreen();
    this.ctx.fillStyle = this.state.colour;
  }

  componentDidUpdate() {
    this.ctx.fillStyle = this.state.colour;
    this.ctx.strokeStyle = this.state.colour;
    this.ctx.lineWidth = this.state.radius * 2;
  }

  componentWillUnmount() {
    delete this.ctx;
  }

  /***************************************************************************
   * Canvas Events                                                           *
   ***************************************************************************/

  handleMouseDown = (event) => {
    const [x, y] = this.getCursorPosition(event);
    this.drawCircle(x, y);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.setState({penDown: true});
  }

  handleMouseUp = (event) => {
    if (this.state.penDown) {
      this.ctx.closePath();
      const [x, y] = this.getCursorPosition(event);
      this.drawCircle(x, y);
    }
    this.setState({penDown: false});
  }

  handleMouseMove = (event) => {
    if (this.state.penDown) {
      const [x, y] = this.getCursorPosition(event);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }

  /***************************************************************************
   * Canvas Helpers                                                          *
   ***************************************************************************/

  getCursorPosition = (event, canvas) => {
    const rect = this.refs.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  /**
   * Draws a circle of radius defined by state centered at x and y.
   */
  drawCircle = (x, y) => {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.state.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  clearscreen = () => {
    this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  }

  /***************************************************************************
   * Button Event Handlers                                                   *
   ***************************************************************************/

  handleNewRadius = (radius) => {
    console.log('new radius:', radius);
    this.setState({radius: radius});
  }

  handleColour = (event) => {
    this.setState({
      colour: event.target.style.backgroundColor
    });
  };

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  render() {
    return (
      <div>
        <Paper style={styles.canvasContainer}>
          <canvas
            ref='canvas'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            style={styles.canvas}
          />
        </Paper>
        <Divider style={styles.divider} />
        <div style={styles.toolbar}>
          <div style={styles.colours}>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'black'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'red'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'blue'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'green'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'yellow'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'white'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'aqua'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'fuchsia'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'brown'}}/>
            <Paper onClick={this.handleColour} style={{backgroundColor: 'lime'}}/>
          </div>
          <div style={styles.misc}>
            <Tooltip title='Small Brush' placement='top'>
              <Paper onClick={this.handleNewRadius.bind(this, 1)}>
                <svg><circle cx='20' cy='20' r='5' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Medium Brush' placement='top'>
              <Paper onClick={this.handleNewRadius.bind(this, 3)}>
                <svg><circle cx='20' cy='20' r='10' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Large Brush' placement='bottom'>
              <Paper onClick={this.handleNewRadius.bind(this, 5)}>
                <svg><circle cx='20' cy='20' r='15' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Fill Screen' placement='bottom'>
              <IconButton onClick={this.clearscreen}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
};
