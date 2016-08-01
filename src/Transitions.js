let React = require('react-native');
const { Navigator, Dimensions, PixelRatio, Easing } = React;
var buildStyleInterpolator = require('react-native/Libraries/Utilities/buildStyleInterpolator');
const deviceScreen = Dimensions.get('window');

let LeftToRight = {
  friction: 8,
  trans: true,
  attr: 'translateX',
  easing: Easing.inOut(Easing.quad),
  outputRange: [-deviceScreen.width, 0],
};

let RightToLeft = {
  friction: 8,
  trans: true,
  attr: 'translateX',
  easing: Easing.inOut(Easing.quad),
  outputRange: [deviceScreen.width, 0],
};

let BottomToTop = {
  friction: 8,
  trans: true,
  attr: 'translateY',
  easing: Easing.inOut(Easing.quad),
  outputRange: [deviceScreen.height, 0],
};

let TopToBottom = {
  friction: 8,
  trans: true,
  attr: 'translateY',
  easing: Easing.inOut(Easing.quad),
  outputRange: [-deviceScreen.height, 0],
};

let Fade = {
  friction: 26,
  attr: 'opacity',
  trans: false,
  outputRange: [0, 1],
  easing: Easing.linear,
};

let None = {
  friction: 1,
  attr: 'none',
  trans: false,
  outputRange: [0, 1],
  easing: Easing.linear,
};

let removeGestures = function(transition) {
  return Object.assign({}, transition, {gestures: {}});
};

module.exports = {
  None: None,
  Fade: Fade,
  FloatFromRight: RightToLeft,
  FloatFromLeft: LeftToRight,
  FloatFromBottom: BottomToTop,
  FloatFromTop: TopToBottom,
  NoGestures: removeGestures,
};
