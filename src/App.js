import React, { Component } from 'react';
import * as classnames from 'classnames';
import './App.css';

const Header = () => (
  <header className="header">
    <p className="header__text">täränt navigator 2000</p>
  </header>
);

class Start extends Component {
  render() {
    return (
      <div className={classnames('start', this.props.className)}>
        <p className="start__hint">Enter your home address and täränt yourself home</p>
        <input type="text" className="start__address" placeholder="Leppäsuonkatu 11" />
        <button className="start__button">täränt me home</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Start className="app__start" />
      </div>
    );
  }
}

export default App;
