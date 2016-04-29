'use strict';

var React = require('react-native');
var { StyleSheet, PropTypes } = React;

var Route = React.createClass({
  displayName: 'Route',
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

module.exports = Route;
