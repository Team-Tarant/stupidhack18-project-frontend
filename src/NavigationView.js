import React, { Component } from 'react';
import * as classnames from 'classnames';
import './NavigationView.css';

// assumes query is obj with string keys and values
const querify = (key, value) => `${key}=${encodeURIComponent(value)}`;
const formatQuery = query => {
  const queryArray = Object.keys(query).reduce((acc, key) => {
    const value = query[key];
    return [...acc, querify(key, value)];
  }, []);
  return queryArray.join('&');
};

const formatCoords = ({ longitude, latitude }) => `${latitude},${longitude}`;
const buildApiUrl = (startCoords, destAddress) => {
  const startLocation = formatCoords(startCoords);
  const homeAddress = destAddress;
  return `/api/routes/getRoute?${formatQuery({ startLocation, homeAddress })}`;
};

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    const { startCoords, destinationAddress } = this.props;
    alert(buildApiUrl(startCoords, destinationAddress));
    // fetch(buildApiUrl(startCoords, destinationAddress));
  }

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
