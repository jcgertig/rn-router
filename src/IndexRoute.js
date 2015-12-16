'use strict';

var React = require('react-native');
var { StyleSheet, View } = React;

var IndexRoute = React.createClass({
  displayName: 'IndexRoute',
  render: function() {
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

module.exports = IndexRoute;
