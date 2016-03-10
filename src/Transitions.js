let React = require('react-native');
const { Navigator, Dimensions, PixelRatio } = React;
var buildStyleInterpolator = require('react-native/Libraries/Utilities/buildStyleInterpolator');

let BaseLeftToRightGesture = {

  // If the gesture can end and restart during one continuous touch
  isDetachable: false,

  // How far the swipe must drag to start transitioning
  gestureDetectMovement: 2,

  // Amplitude of release velocity that is considered still
  notMoving: 0.3,

  // Fraction of directional move required.
  directionRatio: 0.66,

  // Velocity to transition with when the gesture release was "not moving"
  snapVelocity: 2,

  // Region that can trigger swipe. iOS default is 30px from the left edge
  edgeHitWidth: 30,

  // Ratio of gesture completion when non-velocity release will cause action
  stillCompletionRatio: 3 / 5,

  fullDistance: Dimensions.get('window').width,

  direction: 'left-to-right',

};

let FadeIn = {
  opacity: {
    from: 0,
    to: 1,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
};

let FadeOut = {
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
};

let None = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },
};

let NoneConfig = {
  // A list of all gestures that are enabled on this scene
  gestures: {
    pop: BaseLeftToRightGesture,
  },

  // Rebound spring parameters when transitioning FROM this scene
  springFriction: 1,
  springTension: 1000,

  // Velocity to start at when transitioning without gesture
  defaultTransitionVelocity: 100,

  // Animation interpolators for horizontal transitioning:
  animationInterpolators: {
    into: buildStyleInterpolator(None),
    out: buildStyleInterpolator(None),
  },
};

let FadeConfig = {
  gestures: {
    pop: BaseLeftToRightGesture,
  },
  springFriction: 26,
  springTension: 200,
  defaultTransitionVelocity: 1.5,
  animationInterpolators: {
    into: buildStyleInterpolator(FadeIn),
    out: buildStyleInterpolator(FadeOut),
  },
};

let removeGestures = function(transition) {
  return Object.assign({}, transition, {gestures: {}});
};

module.exports = Object.assign({}, React.Navigator.SceneConfigs, {
  None: NoneConfig,
  Fade: FadeConfig,
  NoGestures: removeGestures,
});
