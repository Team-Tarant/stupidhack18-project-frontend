import React, { Component } from 'react';
import * as classnames from 'classnames';
import './StartView.css';

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

const Coords = ({ coords, onCoordsRequested, waitingForCoords }) => (
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

class StartView extends Component {
  constructor(props) {
    super(props);
    this.onCoordsRequested = this.onCoordsRequested.bind(this);
    this.onNavStartRequested = this.onNavStartRequested.bind(this);
    this.onAddressElemRef = this.onAddressElemRef.bind(this);
    this.state = {
      coords: null,
      waitingForCoords: false
    };

    this.addressElemRef = null;
  }

  onAddressElemRef(ref) {
    this.addressElemRef = ref;
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
  }

  onNavStartRequested() {
    const destinationAddress = this.addressElemRef.value;
    if (!destinationAddress) {
      alert('give home address plz');
      return;
    }
    this.props.onDetailsUpdate(this.state.coords, destinationAddress);
  }

  render() {
    return (
      <div className={classnames('start', this.props.className)}>
        <Coords
          coords={this.state.coords}
          onCoordsRequested={this.onCoordsRequested}
          waitingForCoords={this.state.waitingForCoords}
        />
        <p className="start__hint">2. write home adress</p>
        <input
          type="text"
          className="start__address"
          placeholder="Leppäsuonkatu 11"
          ref={this.onAddressElemRef}
        />
        <button
          className="start__button"
          disabled={!this.state.coords}
          onClick={this.onNavStartRequested}
        >
          täränt me home
        </button>
      </div>
    );
  }
}

export default StartView;
