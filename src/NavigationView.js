import React, { Component } from 'react';
import * as classnames from 'classnames';
import * as Utils from './util';
import './NavigationView.css';

const Distance = ({ meters }) => {
  const { distance, unit } = Utils.getDistanceInRandomUnit(meters);
  return <p className="distance">{`${distance.toFixed(1)} ${unit}`}</p>;
};

const Loading = () => <p className="loading">plz wait while calculating...</p>;

const Instructions = ({ waypoint }) => {};

const DirectionImage = imageString => (
  <img
    src={'img/' + imageString + '.jpg'}
    className="direction__image"
    alt={imageString}
  />
);

const DirectionText = (textString) => (
  <p className="navigation__direction-text">{textString}</p>
);

const DirectionImage = (imageString) => (
  <img
    src={'img/' + imageString + '.jpg'}
    className="navigation__direction-image"
    alt={imageString}
  />
);

const DirectionText = (textString) => (
  <p className="navigation__direction-text">{textString}</p>
);

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      steps: null,
      currentStep: -1, // steps: start -> mcdonalds -> home
      currentWaypoint: -1 // waypoint: inside step "start -> mcdonalds": they're "turn left after 500m" etc
    };
  }

  componentDidMount() {
    const { startCoords, destinationAddress } = this.props;
    fetch(Utils.buildApiUrl(startCoords, destinationAddress))
      .then(res => res.json())
      .then(data => {
        const { steps } = data;
        this.setState({
          steps,
          currentStep: 0,
          currentWaypoint: 0,
          loading: false
        });
      });
  }

  render() {
    const content = this.state.loading ? <Loading /> : null;

    return <div className="navigation-view">{content}</div>;
  }
}

export default NavigationView;
