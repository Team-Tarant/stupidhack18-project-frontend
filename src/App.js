import React, { Component } from 'react';
import StartView from './StartView';
import NavigationView from './NavigationView';
import './App.css';

const Header = () => (
  <header className="header">
    <p className="header__text">täränt navigator 2000</p>
  </header>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: null,
      isNavigating: false
    };
    this.onDetailsUpdate = this.onDetailsUpdate.bind(this);
  }

  onDetailsUpdate(startCoords, destinationAddress) {
    this.setState({
      isNavigating: true,
      startCoords,
      destinationAddress
    });
  }

  render() {
    const contents = !this.state.isNavigating ? (
      <StartView onDetailsUpdate={this.onDetailsUpdate} />
    ) : (
      <NavigationView
        startCoords={this.state.startCoords}
        destinationAddress={this.state.destinationAddress}
      />
    );
    return (
      <div className="app">
        <Header />
        {contents}
      </div>
    );
  }
}

export default App;
