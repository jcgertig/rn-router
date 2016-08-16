'use strict';

var React = require('react');
var ReactNative = require('react-native');
var EventEmitter = require('event-emitter');

var { Component, PropTypes, Children, createElement, createClass, cloneElement } = React;
var { Text, Navigator, InteractionManager } = ReactNative;

var Transitions = require('./Transitions');

var Router = React.createClass({

  displayName: 'Router',

  eventEmitter: null,

  childContextTypes: {
    platform: PropTypes.string,
    route: PropTypes.object,
    lastRoute: PropTypes.object,
    transitionTo: PropTypes.func,
    transitionBack: PropTypes.func,
    events: PropTypes.object,
  },

  propTypes: {
    platform: PropTypes.string,
    defaultTransition: PropTypes.any.isRequired,
  },

  getDefaultProps() {
    return {
      defaultTransition: Transitions.None
    };
  },

  getInitialState() {
    return {
      route: this._getInitalRoute(),
    };
  },

  getChildContext() {
    return {
      platform: this.props.platform || 'undefined',
      route: this.state.route,
      lastRoute: this._getLastRoute(),
      transitionTo: this._transitionTo,
      transitionBack: this._transitionBack,
      events: this.eventEmitter,
    };
  },

  componentWillMount() {
    this.eventEmitter = EventEmitter({});
  },

  componentDidMount() {
    this.refs.navigator.navigationContext.addListener('willfocus', this._emitWillFocus);
    this.refs.navigator.navigationContext.addListener('didfocus', this._emitDidFocus);
  },

  _getLastRoute() {
    if (typeof this.refs.navigator === 'undefined') { return null; }
    let routes = this.refs.navigator.getCurrentRoutes();
    if (routes.length - 2 < 0) { return null; } // length is 1 or 0
    return routes[routes.length - 2];
  },

  _clone(array) {
    return JSON.parse(JSON.stringify(array));
  },

  _cloneProps(props) {
    let clone = {
      name: props.name || '',
      component: props.component,
      children: props.children,
      routeProps: props.routeProps || {},
      parent: this._clonePropsBase(props.parent)
    };
    return clone;
  },

  _clonePropsBase(props) {
    if (typeof props === 'undefined') { return props; }
    let clone = {
      name: props.name || '',
      component: props.component,
    };
    return clone;
  },

  _getRouteComponent(name, children, directParent, routeProps) {
    routeProps = typeof routeProps === 'undefined' ? {} : routeProps;
    children = typeof children === 'undefined' ? this.props.children : children;

    let indexRoute = (name === '' || name === '/' || name === 'root');
    name = this._clone(name).split('/');
    let currentName = name.shift();

    var routeComponent = {};
    let found = false;
    Children.forEach(children, (child) => {
      if (found) { return; }
      if ((indexRoute && child.type.displayName === 'IndexRoute') || child.props.name === currentName) {
        routeComponent = this._cloneProps(child.props);
        found = true;
      } else if (child.props.name.indexOf(':') === 0) {
        routeProps[child.props.name.replace(':', '')] = currentName;
        routeComponent = this._cloneProps(child.props);
        found = true;
      }
    });

    if (typeof directParent !== 'undefined') {
      routeComponent.parent = directParent;
    }
    routeComponent.routeProps = Object.assign({}, routeComponent.routeProps, routeProps);

    if (name.length === 0 && Children.count(routeComponent.children) > 0) {
      routeComponent = this._getRouteComponent('', routeComponent.children, routeComponent, routeProps);
    }

    return name.length > 0 ?
      this._getRouteComponent(name.join('/'), routeComponent.children, routeComponent, routeProps)
      :
      routeComponent;
  },

  _getInitalRoute() {
    var componentProps = this._getRouteComponent('');
    let { component, parent, name, routeProps } = componentProps;

    if (typeof parent !== 'undefined' && typeof parent.component !== 'undefined') {
      component = this._getWrapper(componentProps, createElement(component, routeProps || {}));
    }

    return {
      name: 'root',
      routeName: name,
      component: component,
      props: routeProps || {},
      sceneConfig: this.props.defaultTransition
    };
  },

  _buildStack(stack) {
    if (stack.length === 0) { return stack; }

    let key = this._name(stack[0]) + '.0';
    if (stack.length === 1) { return cloneElement(stack[0], {key}); }

    let parent = stack.shift();
    let child = this._buildStack(stack);
    let el = cloneElement(parent, {}, [child]);
    return el;
  },

  _getWrapper(componentProps, child, matching) {
    let stack = this._getWrapperStack(componentProps.parent);
    stack.push(child);
    if (typeof matching === 'undefined') {
      return this._buildStack(stack);
    }

    let { component } = this._getLastRoute();
    let realChild = component.props.children[0];
    let newStack = [component, realChild];
    for (let i = 0; i < matching.matched; i++) {
      if (i < matching.matched - 2) {
        newStack.push(realChild.props.children[0]);
        realChild = realChild.props.children[0];
      }
      stack.shift();
    }
    let built = this._buildStack(stack);
    newStack = newStack.concat(built);
    return this._buildStack(newStack);
  },

  _name(comp) {
    return comp.displayName || comp.name || comp.constructor.name || comp.type.name || 'unknown';
  },

  _getWrapperStack(componentProps) {
    let { parent, component, routeProps } = componentProps;
    let und = 'undefined';
    if (typeof parent !== und) {
      let stack = this._getWrapperStack(parent);
      if (typeof component !== und) {
        let props = Object.assign({}, routeProps, {
          key: this._name(component) + '.' + stack.length
        });
        let comp = createElement(component, props);
        stack.push(comp);
      }
      return stack;
    }

    let props = Object.assign({}, routeProps, {
      key: this._name(component) + '.0'
    });
    let comp = createElement(component, props);
    return [comp];
  },

  _getMatchingParts(name, lastRoute) {
    let broken = name.split('/');
    let count = 0;

    let lastName = lastRoute.name.split('/').reverse();
    if (lastName.indexOf(lastRoute.routeName) !== 0) {
      lastName.reverse().push(lastRoute.routeName);
    } else {
      lastName.reverse();
    }

    let total = lastName.length;
    for (let i = 0; i < total; i++) {
      if (lastName[i] === broken[i]) {
        count++;
      } else {
        break;
      }
    }

    return {
      matched: count,
      of: total,
      currentName: broken.join('/'),
      lastName: lastName.join('/')
    };
  },

  _lastRouteMatches(name, lastRoute, all) {
    if (lastRoute === null) {
      return false;
    }
    if (all) {
      return (name === lastRoute.name || name === lastRoute.name + '/' + lastRoute.routeName);
    }

    let matching = this._getMatchingParts(name, lastRoute);
    return matching.matched > 0;
  },

  _buildRoute(name, props, sceneConfig) {
    props = typeof props === 'undefined' ? {} : props;
    props = typeof props === 'object' ? props : {};
    sceneConfig = typeof sceneConfig === 'undefined' ? this.props.defaultTransition : sceneConfig;

    let matching;
    let lastRoute = this._getLastRoute();
    if (lastRoute !== null && this._lastRouteMatches(name, lastRoute, false)) {
      const matchCheck = this._getMatchingParts(name, lastRoute);
      if (matchCheck.matched !== matchCheck.of) {
        matching = this._getMatchingParts(name, lastRoute);
      }
    }
    let componentProps = this._getRouteComponent(name);
    let { routeProps, parent } = componentProps;
    props = Object.assign({}, props, routeProps);

    let component = componentProps.component;
    if (typeof parent !== 'undefined') {
      let el = createElement(componentProps.component, props);
      component = this._getWrapper(componentProps, el, matching);
    }

    return {
      name: name,
      routeName: componentProps.name,
      component: component,
      props: props,
      sceneConfig: sceneConfig
    };
  },

  _transitionTo(name, props, sceneConfig) {
    let lastRoute = this.state.route;
    var navigator = this.refs.navigator;
    let route = this._buildRoute(name, props, sceneConfig);

    if (typeof route.component !== 'undefined') {
      InteractionManager.runAfterInteractions(() => {
        navigator.push(route);
      });
    }
  },

  _transitionBack() {
    let lastRoute = this._getLastRoute();
    if (lastRoute !== null) {
      this.refs.navigator.replacePrevious(lastRoute);
      InteractionManager.runAfterInteractions(() => {
        this.refs.navigator.pop();
      });
    }
  },

  _renderScene(route, navigator) {
    if (route.component instanceof Component) {
      return cloneElement(route.component, route.props);
    } else {
      return createElement(route.component, route.props);
    }
  },

  _configureScene(route) {
    if (this.state.route !== route) {
      this.setState({ route: route });
    }
    return route.sceneConfig;
  },

  _emitWillFocus(route) {
    this.eventEmitter.emit('routeWillFocus', { route: route });
  },

  _emitDidFocus(route) {
    this.eventEmitter.emit('routeDidFocus', { route: route });
  },

  render() {
    var navProps = {
      initialRoute: this.state.route,
      configureScene: this._configureScene,
      renderScene: this._renderScene,
    };

    return (
      <Navigator
        ref="navigator"
        {...navProps}
      />
    );
  }
});

module.exports = Router;
