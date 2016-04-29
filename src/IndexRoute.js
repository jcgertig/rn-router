'use strict';

var React = require('react-native');
var { StyleSheet, PropTypes } = React;

var IndexRoute = React.createClass({
  displayName: 'IndexRoute',
  propTypes: {
    name: PropTypes.string.isRequired,
    component: PropTypes.any,
    routeProps: PropTypes.object,
  },
  render() {
    return this.props.children;
  }
});

var styles = StyleSheet.create({
  hidden: {
    height: 0,
  }
});

module.exports = IndexRoute;
