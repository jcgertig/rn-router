'use strict';

var React = require('react-native');
var { StyleSheet, View, Navigator, Children, PropTypes } = React;

var Router = React.createClass({

  displayName: 'Router',

  childContextTypes: {
    platform: PropTypes.string,
    route: PropTypes.object,
    lastRoute: PropTypes.object,
    transitionTo: PropTypes.func,
    transitionBack: PropTypes.func
  },

  getInitialState() {
    return {
      route: this.getInitalRoute(),
      lastRoute: null
    };
  },

  clone(array) {
    return JSON.parse(JSON.stringify(array));
  }

  getChildContext() {
    return {
      platform: this.props.platform || 'undefined',
      route: this.state.route,
      lastRoute: this.state.lastRoute,
      transitionTo: this.transitionTo,
      transitionBack: this.transitionBack
    };
  },

  _childOr(child) {
    if (Children.count(child.props.children) > 0) {
      return this.getRouteComponent('', child.props.children, child);
    }
    return child;
  }

  getRouteComponent(name, children, directParent) {
    children = typeof children === 'undefined' ? this.props.children : children;

    let indexRoute = (name === '' || name === '/');
    let name = name.split('/');
    let currentName = clone(name).shift();

    var routeComponent = {};
    Children.map(children, (child) => {
      if (indexRoute) {
        if (child.type.displayName === 'IndexRoute') {
          routeComponent = this._childOr(child);
        }
      } else if (child.props.name === currentName) {
        routeComponent = this._childOr(child);
      }
    });

    let routeComponent = routeComponent.props;
    if (typeof directParent !== 'undefined') {
      routeComponent.parent = directParent;
    }
    return name.length > 1 ?
      this.getRouteComponent(name.join('/'), routeComponent.props.children, routeComponent)
      :
      routeComponent;
  },

  getInitalRoute() {
    var componentProps = this.getRouteComponent('');

    return {
      name: componentProps.name || 'inital route',
      component: componentProps.component,
      props: {},
      sceneConfig: Navigator.SceneConfigs.FloatFromRight
    };
  },

  transitionBack() {
    this.refs.navigator.pop();
  },

  transitionTo(name, props, sceneConfig) {
    props = typeof props === 'undefined' ? {} : props;
    props = typeof props === 'object' ? props : {};

    var navigator = this.refs.navigator;
    var component = this.getRouteComponent(name).component;
    if (typeof component !== 'undefined') {
      navigator.push({
        name: name,
        component: component,
        props: props,
        sceneConfig: sceneConfig || Navigator.SceneConfigs.FloatFromRight
      });
    }
  },

  renderScene(route, navigator) {
    return React.createElement(route.component, route.props);
  },

  configureScene(route) {
    if (this.state.route !== route) {
      this.setState({ lastRoute: this.state.route, route: route });
    }
    return route.sceneConfig;
  },

  render() {
    var navProps = {
      initialRoute: this.state.route,
      configureScene: this.configureScene,
      renderScene: this.renderScene
    };

    return (
      <Navigator
        ref="navigator"
        {...navProps} />
    );
  }
});

var styles = StyleSheet.create({
  hidden: {
    height: 0,
  }
});

module.exports = Router;
