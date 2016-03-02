'use strict';

var React = require('react-native');
var { StyleSheet, View, Children, PropTypes, TouchableOpacity,
      TouchableHighlight } = React;

var Link = React.createClass({

  displayName: 'Link',

  contextTypes: {
    route: PropTypes.object,
    transitionTo: PropTypes.func,
    transitionBack: PropTypes.func,
  },

  propTypes: {
    to: PropTypes.string.isRequired,
    toBack: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    type: PropTypes.oneOf(['Highlight', 'Opacity']),
    props: PropTypes.any,
    underlayColor: PropTypes.string,
    style: PropTypes.any,
    transition: PropTypes.any,
    activeLinkStyle: PropTypes.any,
    linkStyle: PropTypes.any,
  },

  getDefaultProps() {
    return {
      to: '',
      toBack: false,
      type: 'Opacity',
      style: {},
    };
  },

  handlePress() {
    if (this.props.toBack) {
      this.context.transitionBack();
    } else {
      this.context.transitionTo(this.props.to, this.props.props || {}, this.props.transition);
    }
  },

  render() {
    var style = typeof this.props.linkStyle !== 'undefined' ? this.props.linkStyle : styles.link;
    var to = this.props.to.split('/');
    let name = this.context.route.name;

    if (to[to.length - 1] === name || this.props.to === name) {
      style = typeof this.props.activeLinkStyle !== 'undefined' ? this.props.activeLinkStyle : styles.linkActive;
    }

    var children = Children.map(this.props.children, (child) => {

      if (typeof child.props.style !== 'undefined') {
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
        <TouchableOpacity style={[this.props.style, style]} onPress={this.handlePress}>
          {children}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableHighlight underlayColor={this.props.underlayColor} style={this.props.style} onPress={this.handlePress}>
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
