import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import ClearIcon from '@material-ui/icons/Delete';

const styles = {
  canvas: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
  },
  canvasContainer: {
    position: 'relative',
    paddingTop: '100%',
    width: '100%',
    maxHeight: '500px',
    maxWidth: '500px',
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
  svg: {
    height: '100%',
    width: '100%',
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

class UndoStack {
  constructor() {
    this.stack = [];
    this.endIdx = 0;
  }

  undo = () => {
    this.endIdx = Math.max(0, this.endIdx - 1);
    return this.stack.slice(0, this.endIdx);
  }

  redo = () => {
    this.endIdx = Math.min(this.stack.length, this.endIdx + 1);
    return this.stack.slice(0, this.endIdx);
  }

  push = (element) => {
    const maxUndos = 20;
    this.stack = this.stack.slice(Math.max(0, this.endIdx - 20), this.endIdx);
    this.stack.push(element);
    this.endIdx = this.stack.length;
  }
}

// Assumes canvas cannot transform.
export default class DrawCanvas extends Component {
  constructor(props) {
    super(props);

    this.undoStack = new UndoStack();
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

    this.clearscreen();

    // Workaround to enable preventDefault()
    // https://github.com/facebook/react/issues/9809
    canvas.ontouchmove = this.handleTouchMove;
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
      // Hacky undo stack by saving entire image:
      this.undoStack.push(this.refs.canvas.toDataURL());
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

  handleTouchStart = (event) => {
    if (event.touches.length) {
      this.handleMouseDown(event.touches[0]);
    }
  }

  handleTouchEnd = (event) => {
    if (event.touches.length) {
      this.handleMouseUp(event.touches[0]);
    }
  }

  handleTouchMove = (event) => {
    if (event.touches.length) {
      event.preventDefault();
      this.handleMouseMove(event.touches[0]);
    }
  }

  handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'z') {
      this.drawImage(this.undoStack.undo().pop());
    } else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
      this.drawImage(this.undoStack.redo().pop());
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
    this.ctx.fillStyle = 'white';
    this.fillscreen();
    this.ctx.fillStyle = this.state.colour;
  }

  fillscreen = () => {
    this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  }

  drawImage = (base64EncodedImage) => {
    if (!base64EncodedImage) {
      this.clearscreen();
    }
    let image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    }
    image.src = base64EncodedImage;
  }

  /***************************************************************************
   * Button Event Handlers                                                   *
   ***************************************************************************/

  handleNewRadius = (radius) => {
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
            onTouchStart={this.handleTouchStart}
            onTouchEnd={this.handleTouchEnd}
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
            // Moved onTouchMove to componentDidMount.
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
                <svg style={styles.svg}><circle cx='20' cy='20' r='5' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Medium Brush' placement='top'>
              <Paper onClick={this.handleNewRadius.bind(this, 3)}>
                <svg style={styles.svg}><circle cx='20' cy='20' r='10' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Large Brush' placement='bottom'>
              <Paper onClick={this.handleNewRadius.bind(this, 15)}>
                <svg style={styles.svg}><circle cx='20' cy='20' r='15' fill='black' /></svg>
              </Paper>
            </Tooltip>
            <Tooltip title='Fill Screen' placement='bottom'>
              <IconButton onClick={this.fillscreen}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
};
