import React, { Component } from 'react';
import * as classnames from 'classnames';
import * as Utils from './util';
import './NavigationView.css';

const Loading = () => <p className="loading">plz wait while calculating...</p>;

const ManeuverImage = ({ maneuver }) => (
  <img
    src={'img/' + maneuver + '.jpg'}
    className="navigation__maneuver-image"
    alt={maneuver}
  />
);

const Distance = ({ meters }) => {
  const { distance, unit } = Utils.getDistanceInRandomUnit(meters);
  return <p className="navigation__distance">{`${distance.toFixed(1)} ${unit}`}</p>;
};

const TextInstructions = ({ htmlInstructions }) => (
  <p
    className="navigation__text-instructions"
    dangerouslySetInnerHTML={{ __html: htmlInstructions }}
  />
);

/* ----- example "directionStep" ---------
"distance": {
        "text": "0.3 km",
        "value": 288
    },
    "duration": {
        "text": "4 mins",
        "value": 245
    },
    "end_location": {
        "lat": 60.1697649,
        "lng": 24.9267587
    },
    "html_instructions": "Head <b>east</b> on <b>Alkärrsgatan</b>/<b>Leppäsuonkatu</b> toward <b>Runeberginkatu</b>/<b>Runebergsgatan</b>",
    "polyline": {
        "points": "{xfnJspbwCFkCB{@Fg@Jc@mByQUeB"
    },
    "start_location": {
        "lat": 60.1692601,
        "lng": 24.9218569
    },
    "travel_mode": "WALKING"
},
*/

const Error = ({ message }) => (
  <p className="error">{`oops looks like shit broke, ping @cxcorp on telegram: ${message}`}</p>
);

const Navigation = ({ directionStep }) => {
  const {
    distance,
    maneuver,
    html_instructions: htmlInstructions,
    start_location: startCoords,
    end_location: endCoords
  } = directionStep;

  return (
    <div className="navigation">
      <ManeuverImage maneuver={maneuver || 'unknown'} />
      <Distance meters={distance.value} />
      <TextInstructions htmlInstructions={htmlInstructions} />
    </div>
  );
};

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      steps: null,
      currentStep: -1, // steps: start -> mcdonalds -> home
      currentWaypoint: -1 // waypoint: inside step "start -> mcdonalds": they're "turn left after 500m" etc (it's current steps[currentStep].directions[currentWaypoint])
    };
  }

  componentDidMount() {
    const { startCoords, destinationAddress } = this.props;
    fetch(Utils.buildApiUrl(startCoords, destinationAddress))
      .then(res => res.json())
      .then(data => {
        const { ok, payload, message } = data;
        if (!ok) {
          this.setState({
            loading: false,
            error: message
          });
        } else {
          this.setState({
            steps: payload.steps,
            currentStep: 0,
            currentWaypoint: 0,
            loading: false
          });
        }
      });
  }

  render() {
    const { loading, error, steps, currentStep, currentWaypoint } = this.state;
    const content = loading ? (
      <Loading />
    ) : error ? (
      <Error message={error} />
    ) : (
      <Navigation
        directionStep={steps[currentStep].directions[currentWaypoint]}
      />
    );

    return <div className="navigation-view">{content}</div>;
  }
}

export default NavigationView;
