'use strict';

var React = require('react-native');
var { StyleSheet, View } = React;

var Route = React.createClass({
  displayName: 'Route',
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
