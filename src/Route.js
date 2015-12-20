'use strict';

var React = require('react-native');
var { StyleSheet, View } = React;

var Route = React.createClass({
  displayName: 'Route',
  render() {
    return (
      <View style={styles.hidden}></View>
    );
  }
});

var styles = StyleSheet.create({
  hidden: {
    height: 0,
  }
});

module.exports = Route;
