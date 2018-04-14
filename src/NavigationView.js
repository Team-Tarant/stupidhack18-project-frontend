import React, { Component } from 'react';
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
  return (
    <p className="navigation__distance">{`${distance.toFixed(1)} ${unit}`}</p>
  );
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

const WaitingForGps = () => <p className="waiting-for-gps">plz wait for gps</p>;

const Navigation = ({
  directionStep,
  distanceToCurrentWaypointEnd,
  onDebugBtnClick,
  showDbgBtn
}) => {
  const { maneuver, html_instructions: htmlInstructions } = directionStep;

  return (
    <div className="navigation">
      <ManeuverImage maneuver={maneuver || 'unknown'} />
      <Distance meters={distanceToCurrentWaypointEnd} />
      <TextInstructions htmlInstructions={htmlInstructions} />
      <button onClick={onDebugBtnClick} disabled={!showDbgBtn}>
        [debug] go to waypoint end
      </button>
    </div>
  );
};

const clippySays = [
  {
    type: 'restaurant',
    msg:
      "Hello! Looks like you're trying to get home! I thought you might be hungry so I took you to a restaurant instead. You're welcome!"
  },
  {
    type: 'bar',
    msg:
      "Hello! Looks like you're trying to get home! I noticed you might be starting to get sober, so I directed you to a bar! You're welcome!"
  },
  {
    type: 'food',
    msg:
      "Hello! Looks like you're trying to get home! I thought you might be hungry so I took you to get some food. You're welcome!"
  }
];

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      steps: null,
      currentStep: -1, // steps: start -> mcdonalds -> home
      currentWaypoint: -1, // waypoint: inside step "start -> mcdonalds": they're "turn left after 500m" etc (it's current steps[currentStep].directions[currentWaypoint])
      waitingForGps: false,

      distanceToCurrentWaypointEnd: 0,
      isNavFinished: false,

      clippyShown: false
    };
    this.watchposId = null;
    this.clippyAgent = null;

    this.handleGpsUpdate = this.handleGpsUpdate.bind(this);
    this.debugMoveToCurrentWaypointsEnd = this.debugMoveToCurrentWaypointsEnd.bind(
      this
    );
    this.updateDistanceToWaypoint = this.updateDistanceToWaypoint.bind(this);
    this.stopGpsWatch = this.stopGpsWatch.bind(this);
    this.makeClippySpeak = this.makeClippySpeak.bind(this);
  }

  debugMoveToCurrentWaypointsEnd() {
    const {
      steps,
      currentStep: stepIndex,
      currentWaypoint: waypointIndex
    } = this.state;
    console.log('debugMoveToCurrentWaypointsEnd');

    const currStep = steps[stepIndex];
    const currWaypoint = currStep.directions[waypointIndex];
    const { distance } = currWaypoint;

    // enable debug mode :))
    this.stopGpsWatch();

    // trigger update to waypoint, then update to real distance for show
    this.updateDistanceToWaypoint(0, () => {
      this.updateDistanceToWaypoint(distance.value);
    });
  }

  updateDistanceToWaypoint(distance, setStateDoneCallback) {
    const newState = {
      waitingForGps: false,
      distanceToCurrentWaypointEnd: distance
    };

    // wrap setState to inject the cb
    const setState = newState => {
      this.setState(newState, setStateDoneCallback);
    };

    if (distance < 10) {
      // 10 meters away, go to next waypoint
      const {
        steps,
        currentStep: stepIndex,
        currentWaypoint: waypointIndex
      } = this.state;

      const currentStep = steps[stepIndex];
      const isLastWaypointOfStep =
        waypointIndex === currentStep.directions.length - 1;
      if (isLastWaypointOfStep) {
        const isLastStep = stepIndex === steps.length - 1;

        if (isLastStep) {
          // le end
          this.stopGpsWatch();
          return setState({
            ...newState,
            isNavFinished: true
          });
        } else {
          // end of step - go to next step
          const { locationTypes } = currentStep;
          this.makeClippySpeak(locationTypes);

          const newStepIdx = stepIndex + 1;
          const newWaypointIdx = 0;

          return setState({
            ...newState,
            currentStep: newStepIdx,
            currentWaypoint: newWaypointIdx,
            clippyShown: true
          });
        }
      }

      // was not last waypoint, just go to next
      setState({
        ...newState,
        currentWaypoint: waypointIndex + 1
      });
    }

    console.log('updateDistanceToWaypoint', distance);
    setState(newState);
  }

  makeClippySpeak(locationTypes) {
    if (!this.clippyAgent) {
      console.log('no clippy agent!!!');
      return;
    }

    let say = {
      type: 'nan',
      msg:
        'Hello! Looks like you are trying to get home! I took you to a favorite place of mine instead.'
    };
    for (const type of locationTypes) {
      const idx = clippySays.findIndex(say => say.type === type);
      if (idx !== -1) {
        say = clippySays[idx];
        break;
      }
    }

    console.log('clippy says', say.msg);

    this.clippyAgent.show();
    this.clippyAgent.speak(say.msg);
    setTimeout(() => {
      this.clippyAgent.hide();
      this.setState({
        clippyShown: false
      });
    }, 7000);
  }

  handleGpsUpdate({ coords }) {
    const {
      steps,
      currentStep: stepIndex,
      currentWaypoint: waypointIndex
    } = this.state;

    if (!steps || stepIndex === -1 || waypointIndex === -1) {
      return;
    }

    const currStep = steps[stepIndex];
    const currWaypoint = currStep.directions[waypointIndex];
    const { end_location: currWayEndCoords } = currWaypoint;

    const distanceToCurrentWaypointEnd = Utils.distance(
      { latitude: coords.latitude, longitude: coords.longitude },
      { latitude: currWayEndCoords.lat, longitude: currWayEndCoords.lng }
    );

    console.log('gps update');

    this.updateDistanceToWaypoint(distanceToCurrentWaypointEnd);
  }

  stopGpsWatch() {
    if (this.watchposId !== null) {
      navigator.geolocation.clearWatch(this.watchposId);
    }
  }

  componentWillUnmount() {
    this.stopGpsWatch();
  }

  componentDidMount() {
    window.clippy.load('Clippy', agent => {
      this.clippyAgent = agent;
    });

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
            loading: false,
            waitingForGps: true
          });

          const opts = {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
          };
          this.watchposId = navigator.geolocation.watchPosition(
            this.handleGpsUpdate,
            err => {
              alert(err);
            }, // lol just eat error
            opts
          );
        }
      });
  }

  render() {
    const {
      loading,
      error,
      waitingForGps,
      steps,
      currentStep,
      currentWaypoint,
      distanceToCurrentWaypointEnd,
      isNavFinished,
      clippyShown
    } = this.state;

    let content = <Loading />;

    if (isNavFinished) {
      content = <p className="navigation-view__finished">congrats ur home!</p>;
    } else if (!loading) {
      if (error) {
        content = <Error message={error} />;
      } else if (waitingForGps) {
        content = <WaitingForGps />;
      } else {
        content = (
          <Navigation
            directionStep={steps[currentStep].directions[currentWaypoint]}
            distanceToCurrentWaypointEnd={distanceToCurrentWaypointEnd}
            showDbgBtn={!clippyShown}
            onDebugBtnClick={this.debugMoveToCurrentWaypointsEnd}
          />
        );
      }
    }

    return <div className="navigation-view">{content}</div>;
  }
}

export default NavigationView;
