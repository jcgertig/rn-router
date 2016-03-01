'use strict';

var React = require('react-native');
var { StyleSheet, View, Navigator, Children, PropTypes, cloneElement } = React;

var Wrapper = require('./Wrapper');

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
  },

  cloneProps(props) {
    let clone = {
      name: props.name || '',
      component: props.component,
      children: props.children,
      parent: this.clonePropsBase(props.parent)
    };
    return clone;
  },

  clonePropsBase(props) {
    if (typeof props === 'undefined') { return props; }
    let clone = {
      name: props.name || '',
      component: props.component,
    };
    return clone;
  },

  getChildContext() {
    return {
      platform: this.props.platform || 'undefined',
      route: this.state.route,
      lastRoute: this.state.lastRoute,
      transitionTo: this.transitionTo,
      transitionBack: this.transitionBack
    };
  },

  _childOr(name, child, routeProps) {
    let props = child.props;
    if (name.length === 0 && Children.count(props.children) > 0) {
      props =  this.getRouteComponent('', props.children, props, routeProps);
    }
    return this.cloneProps(props);
  },

  getRouteComponent(name, children, directParent, routeProps) {
    routeProps = typeof routeProps === 'undefined' ? {} : routeProps;
    children = typeof children === 'undefined' ? this.props.children : children;

    let indexRoute = (name === '' || name === '/');
    name = this.clone(name).split('/');
    let currentName = name.shift();

    var routeComponent = {};
    Children.map(children, (child) => {
      if (indexRoute) {
        if (child.type.displayName === 'IndexRoute') {
          routeComponent = this._childOr(name, child, routeProps);
        }
      } else if (child.props.name.indexOf(':') === 0) {
        routeProps[child.props.name.replace(':', '')] = currentName;
        routeComponent = this._childOr(name, child, routeProps);
      } else if (child.props.name === currentName) {
        routeComponent = this._childOr(name, child, routeProps);
      }
    });

    if (typeof directParent !== 'undefined') {
      routeComponent.parent = directParent;
    }
    routeComponent.routeProps = routeProps;

    return name.length > 0 ?
      this.getRouteComponent(name.join('/'), routeComponent.children, routeComponent, routeProps)
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
    var componentProps = this.getRouteComponent(name);
    let component = componentProps.component;
    props = Object.assign({}, props, componentProps.routeProps);
    if (typeof componentProps.parent !== 'undefined' && typeof componentProps.parent.component !== 'undefined') {
      component = Wrapper;
      props = Object.assign({}, props, { parent: componentProps.parent.component, child: componentProps.component });
    }
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
        {...navProps}
      />
    );
  }
});

var styles = StyleSheet.create({
  hidden: {
    height: 0,
  }
});

module.exports = Router;
