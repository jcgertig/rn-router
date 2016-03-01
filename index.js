var React = require('react-native');

let Transitions = Object.assign({}, React.Navigator.SceneConfigs, { None: 'NO_TRANSITION' })
module.exports = {
  Router: require('./src/Router'),
  IndexRoute: require('./src/IndexRoute'),
  Route: require('./src/Route'),
  Link: require('./src/Link'),
  Transitions: Transitions,
};
