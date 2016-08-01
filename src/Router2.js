'use strict';

var React = require('react-native');
var EventEmitter = require('event-emitter');

import AnimatedView from './AnimatedView';

var {
  View, Navigator, Children, PropTypes, createElement, createClass,
  InteractionManager, cloneElement, View, Dimensions
} = React;

var Transitions = require('./Transitions');

const deviceScreen = Dimensions.get('window');

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
    const route = this._getInitalRoute();
    return {
      route,
      routeObject: this._buildStack(this._formatStack(route.routeObject)),
      stateStack: [route],
      onEnd: null,
      reverse: false
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
    const { stateStack } = this.state;
    if (stateStack.length < 2) { return null; }
    return stateStack[1];
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
    return {
      name: props.name || '',
      component: props.component,
    };
  },

  _getRouteComponent(name, children = this.props.children, directParent, routeProps = {}) {
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

    return (name !== null && name.length > 0) ?
      this._getRouteComponent(name.join('/'), routeComponent.children, routeComponent, routeProps)
      :
      routeComponent;
  },

  _getInitalRoute() {
    const componentProps = this._getRouteComponent('');
    return {
      name: 'root',
      routeName: componentProps.name,
      routeObject: componentProps,
      props: {},
      sceneConfig: Transitions.None
    };
  },

  _name(comp) {
    return comp.displayName || comp.name || comp.constructor.name || comp.type.name || 'unknown';
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
    if (lastRoute === null) { return false; }
    if (all) {
      return (name === lastRoute.name || name === lastRoute.name + '/' + lastRoute.routeName);
    }

    let matching = this._getMatchingParts(name, lastRoute);
    return matching.matched > 0;
  },

  _buildRoute(name, props = {}, sceneConfig = this.props.defaultTransition) {
    const componentProps = this._getRouteComponent(name);
    componentProps.routeProps = Object.assign({}, componentProps.routeProps, props);
    return {
      name,
      routeName: componentProps.name,
      routeObject: componentProps,
      props,
      sceneConfig
    };
  },

  _transitionTo(name, props, sceneConfig) {
    const lastRoute = this.state.route;
    const stateStack = this.state.stateStack;
    const route = this._buildRoute(name, props, sceneConfig);

    if (!this._lastRouteMatches(route.name, lastRoute, true)) {
      InteractionManager.runAfterInteractions(() => {
        const onEnd = () => {
          this.setState({ onEnd: null, reverse: false });
        }
        stateStack.unshift(route);
        this.setState({
          route,
          routeObject: this._buildStack(this._formatStack(route.routeObject)),
          stateStack,
          onEnd,
          oldView: { route: this.state.route, routeObject: this.state.routeObject },
          reverse: false
        });
      });
    }
  },

  _transitionBack() {
    const route = this._getLastRoute();
    const stateStack = this.state.stateStack;

    if (route !== null) {
      // InteractionManager.runAfterInteractions(() => {
        const onEnd = () => {
          this.setState({ onEnd: null, reverse: false });
        }
        stateStack.shift();
        this.setState({
          route,
          routeObject: this._buildStack(this._formatStack(route.routeObject)),
          stateStack,
          onEnd,
          oldView: { route: this.state.route, routeObject: this.state.routeObject },
          reverse: true,
        });
      // });
    }

  },

  _emitWillFocus(route) {
    this.eventEmitter.emit('routeWillFocus', { route: route });
  },

  _emitDidFocus(route) {
    this.eventEmitter.emit('routeDidFocus', { route: route });
  },

  _formatStack(route) {
    if (typeof route.parent === 'undefined' || route.parent === null) {
      return route;
    }
    const parent = this._formatStack(route.parent);
    parent.child = route;
    return parent;
  },

  _buildStack(stack, count = 0) {
    if (typeof stack === 'undefined') { return <View />; }

    const key = stack.name + '.' + count;
    const Comp = stack.component;
    if (typeof stack.child !== 'undefined' && stack.child.name === stack.name) {
      count++;
    } else {
      count = 0;
    }
    if (typeof Comp === 'undefined' || Comp === null) {
      return this._buildStack(stack.child, count);
    }
    return (
      <Comp key={key} {...stack.routeProps}>
        {this._buildStack(stack.child, count)}
      </Comp>
    );
  },

  render() {
    const {onEnd, reverse, oldView, route, routeObject} = this.state;
    return (
      <View style={{width: deviceScreen.width, height: deviceScreen.height}}>
        {
          reverse === false && onEnd !== null && (oldView !== null && typeof oldView !== 'undefined') && (
            <AnimatedView
              style={{position: 'absolute', top: 0, left: 0}}
              transition={oldView.route.sceneConfig}
              onEnd={null}
            >
              {oldView.routeObject}
            </AnimatedView>
          )
        }
        {
          reverse === false && (
            <AnimatedView
              style={{position: 'absolute', top: 0, left: 0}}
              transition={route.sceneConfig}
              onEnd={onEnd}
            >
              {routeObject}
            </AnimatedView>
          )
        }
        {
          reverse === true && (
            <AnimatedView
              style={{position: 'absolute', top: 0, left: 0}}
              transition={Transitions.None}
              onEnd={null}
            >
              {routeObject}
            </AnimatedView>
          )
        }
        {
          reverse === true && (oldView !== null && typeof oldView !== 'undefined') &&  (
            <AnimatedView
              style={{position: 'absolute', top: 0, left: 0}}
              transition={oldView.route.sceneConfig}
              onEnd={onEnd}
              reverse={reverse}
            >
              {oldView.routeObject}
            </AnimatedView>
          )
        }
      </View>
    );
  }
});

module.exports = Router;
