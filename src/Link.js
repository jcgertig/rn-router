'use strict';

var React = require('react-native');
var { StyleSheet, View, Children, PropTypes, TouchableOpacity,
      TouchableHighlight } = React;

var Link = React.createClass({

  displayName: 'Link',

  contextTypes: {
    route: PropTypes.object,
    transitionTo: PropTypes.func,
  },

  propTypes: {
    children: PropTypes.element.isRequired,
    type: PropTypes.oneOf(['Highlight', 'Opacity']),
    underlayColor: PropTypes.string,
    style: PropTypes.any,
    transition: PropTypes.any,
    activeLinkStyle: PropTypes.any,
    linkStyle: PropTypes.any,
  },

  getDefaultProps() {
    return {
      type: 'Opacity',
      style: {},
    };
  },

  handlePress() {
    this.context.transitionTo(this.props.to, this.props.props || {}, this.props.transition);
  },

  render() {
    var children = Children.map(this.props.children, (child) => {
      var style = typeof this.props.linkStyle !== 'undefined' ? this.props.linkStyle : styles.link;

      if (this.props.to === this.context.route.name) {
        style = typeof this.props.activeLinkStyle !== 'undefined' ? this.props.activeLinkStyle : styles.linkActive;
      }

      if (child.props.style) {
        if (child.props.style instanceof Array) {
          style = child.props.style.push(style);
        } else {
          style = [child.props.style, style];
        }
      }

      return React.cloneElement(child, { style });
    });

    if (this.props.type === 'Opacity') {
      return (
        <TouchableOpacity style={this.props.style} onPress={this.handlePress}>
          {children}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableHighlight underlayColor={this.props.underlayColor} style={this.props.style || {}} onPress={this.handlePress}>
          <View>
            {children}
          </View>
        </TouchableHighlight>
      );
    }
  }
});

var styles = StyleSheet.create({
  link: {
    opacity: 1
  },
  linkActive: {
    opacity: 0.5
  }
});

module.exports = Link;
