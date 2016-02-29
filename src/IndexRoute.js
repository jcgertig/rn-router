'use strict';

var React = require('react-native');
var { StyleSheet, View } = React;

var IndexRoute = React.createClass({
  displayName: 'IndexRoute',
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
