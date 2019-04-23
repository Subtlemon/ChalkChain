import React, { Component } from 'react';

const styles = {
  canvas: {
    height: '100%',
    width: '100%',
  },
};

// Assumes canvas cannot transform.
export default class DrawCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fillStyle: 'black',
      radius: 5,
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
  }

  componentDidUpdate() {
    this.ctx.fillStyle = this.state.fillStyle;
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

  /**
   * Draws a line of thickness defined by state between two coordinates.
   */
  drawLine = (x1, y1, x2, y2) => {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearscreen = () => {
    this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  }

  /***************************************************************************
   * Render                                                                  *
   ***************************************************************************/

  render() {
    return (
      <div>
        <canvas
          ref='canvas'
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          style={styles.canvas}
        />
      </div>
    );
  }
};
