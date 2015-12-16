var React = require('react-native');

module.exports = {
  Router: Router,
  IndexRoute: require('./src/IndexRoute')
  Route: require('./src/Route'),
  Link: require('./src/Link'),
  Transitions: React.Navigator.SceneConfigs,
};
