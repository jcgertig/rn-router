'use strict';

var React = require('react-native');

var RouteWrapper = React.createClass({
  displayName: 'RouteWrapper',
  render() {
    let Parent = this.props.parent;
    let Child = this.props.child;
    return (
      <Parent {...this.props}>
        <Child {...this.props} />
      </Parent>
    )
  }
});

module.exports = RouteWrapper;
