import React, { Component } from 'react';
import * as classnames from 'classnames';
import './App.css';

const Header = () => (
  <header className="header">
    <p className="header__text">täränt navigator 2000</p>
  </header>
);

const formatCoords = coords => `°${coords.latitude}, °${coords.longitude}`;

const getStartCoordsText = (coords, waitingForCoords) => {
  if (waitingForCoords) {
    return 'getting...';
  }
  if (coords) {
    return formatCoords(coords);
  }
  return 'press the button';
};

const StartCoords = ({ coords, onCoordsRequested, waitingForCoords }) => (
  <div className="start-coords">
    <p className="start-coords__hint">1. get ur coordineits</p>
    <input
      type="text"
      className="start-coords__coords"
      disabled={true}
      value={getStartCoordsText(coords, waitingForCoords)}
    />
    <button className="start-coords__button" onClick={onCoordsRequested}>
      get my coords
    </button>
  </div>
);

class Start extends Component {
  constructor(props) {
    super(props);
    this.onCoordsRequested = this.onCoordsRequested.bind(this);
    this.onNavStartRequested = this.onNavStartRequested.bind(
      this
    );
    this.state = {
      coords: null,
      waitingForCoords: false
    };
  }

  onCoordsRequested() {
    var opts = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    };

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { coords } = pos;
        this.setState({
          coords,
          waitingForCoords: false
        });
      },
      () => {}, // lol just do nothing it it fails
      opts
    );
    this.setState({ waitingForCoords: true });
  }

  onNavStartRequested() {}

  render() {
    return (
      <div className={classnames('start', this.props.className)}>
        <StartCoords
          coords={this.state.coords}
          onCoordsRequested={this.onCoordsRequested}
          waitingForCoords={this.state.waitingForCoords}
        />
        <p className="start__hint">2. write home adress</p>
        <input
          type="text"
          className="start__address"
          placeholder="Leppäsuonkatu 11"
        />
        <button className="start__button" disabled={!this.state.coords}>
          täränt me home
        </button>
      </div>
    );
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
