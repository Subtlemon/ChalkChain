import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Entry from './components/Entry';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Entry />
        </header>
      </div>
    );
  }
}

export default App;
