import React, { Component } from 'react';
import * as classnames from 'classnames';
import './NavigationView.css';

class NavigationView extends Component {
  render() {
    return (
      <div className="navigation-view">
        {this.props.startCoords.longitude}
        {` - ${this.props.destinationAddress}`}
      </div>
    );
  }
}

export default NavigationView;
