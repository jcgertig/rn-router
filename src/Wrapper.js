'use strict';

var React = require('react-native');

var RouteWrapper = React.createClass({
  displayName: 'RouteWrapper',
  render() {
    let Parent = this.props.parent;
    let Child = this.props.child;
    let props = Object.assign({}, this.props);
    delete props.parent;
    delete props.child;

    return (
      <Parent {...props}>
        <Child {...props} />
      </Parent>
    )
  }
});

module.exports = RouteWrapper;
