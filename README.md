# rn-router
React Native routing system based on react router

# Change Log:

 - _2.1.5_ : Fix `lastRoute` and in so doing correcting routes deeper than 2
 for `transitionBack`.

 - _2.1.5_ : Fix `transitionBack` for sub wrapped routes.

 - _2.1.4_ : Fix for sub wrapped routes.

 - _2.1.3_ : Fix for active link styles.

 - _2.1.2_ : Fix for choosing parent component.

 - _2.1.0_ : Add `defaultTransition` prop to `Router` allowing to change the
 default transition from `None`.

 - _2.0.0_ : Add `None` and `Fade` transitions and default transitions to `None`.
 This is a breaking change for those relying on a transition when none has been supplied.

 - _1.3.x_ : Add url parameters

 - _1.2.x_ : Add passing of children to parent route

 - _1.1.x_ : Add sub routing

# How to use:

## Install

```shell
npm i --save rn-router
```

## Example - Setup

### Routes.js

```js
'use strict';

var React = require('react-native');
var ReactRouter = require('rn-router');

var Home = require('./HomeView');
var Login = require('./LoginView');

var { Router, IndexRoute, Route, Transitions } = ReactRouter;

var Routes = React.createClass({
  render: function() {
    return (
      <Router {...this.props} defaultTransition={Transitions.Fade}>
        <IndexRoute name="login" component={Login} />
        <Route name="home" component={Home} />
      </Router>
    );
  }
});

module.exports = Routes;
```

### index.ios.js

```js
'use strict';

var React = require('react-native');
var { AppRegistry } = React;

var Routes = require('./Routes');

var App = React.createClass({
  render: function() {
    return (
      <Routes platform="ios" />
    );
  }
});

AppRegistry.registerComponent('App', () => App);
```

### index.android.js

```js
'use strict';

var React = require('react-native');
var { AppRegistry } = React;

var Routes = require('./Routes');

var App = React.createClass({
  render: function() {
    return (
      <Routes platform="android" />
    );
  }
});

AppRegistry.registerComponent('App', () => App);
```

## Example - Usage ( Sub Routes )

```js
...

  <Router {...this.props}>
    <IndexRoute name="home" component={Home} />
    <Route name="settings" component={SettingsLayout}>
      <IndexRoute name="base" component={BaseSettings} />
      <Route name="advanced" component={AdvancedSettings} />
    </Route>
    <Route name="users">
      <IndexRoute name="listing" component={UsersListing} />
      <Route name="profile" component={UsersProfile} />
    </Route>
  </Router>

...

this.context.transitionTo('settings'); // goes to 'settings/base'
this.context.transitionTo('settings/base');
this.context.transitionTo('settings/advanced');

this.context.transitionTo('users/profile', { id: 1 });
```

## Example - Usage ( Url Params )

```js
...

  <Router {...this.props}>
    <Route name="users">
      <IndexRoute name="listing" component={UsersListing} />
      <Route name=":userId" component={UsersProfile} />
    </Route>
  </Router>

...

this.context.transitionTo(`users/${id}`);

// UsersProfile

this.props.userId
```

## Example - Usage ( Link )

```js
var ReactRouter = require('rn-router');
var { Link, Transitions } = ReactRouter;

...

render() {
  return (
    <View>
      <Link to='home'><Text>Home</Text></Link>
      <Link to='login'><Text>Login</Text></Link>

      <Link to='users/listing' props={{ page: 2 }}>
        <Text>Listing Page 2</Text>
      </Link>

      <Link toBack={true}><Text>Back</Text></Link>

      <Link to='login' transition={Transitions.FloatFromLeft}><Text>Login</Text></Link> // Default transition is None
      <Link to='home' transition={Transitions.FloatFromBottom}><Text>Home</Text></Link>
      <Link to='home' style={styles.linkButton}><Text>Home</Text></Link>
      <Link to='home' activeLinkStyle={styles.highlight}><Text>Home</Text></Link> // Default active style is opacity: 0.5
      <Link to='home'
        props={{ id: 1 }}
        linkStyle={styles.linkText}
        activeLinkStyle={styles.highlight}>
        <Text>Home</Text>
      </Link>
    </View>
  );
}

```

## Context Types

  - platform : the given platform value to Router or 'undefined'
  - route : the route object ( name, component, props, sceneConfig )
  - transitionTo : transition function params (name, props(optional), transitionFunction(optional))
  - transitionBack : transition to last route

## Example - Usage ( transitionTo / transitionBack )

```js
var ReactRouter = require('rn-router');
var { Transitions } = ReactRouter;

...

contextTypes: {
  transitionTo: React.PropTypes.func,
  transitionBack: React.PropTypes.func
},

...

render() {
  return (
    <View>
      <TouchableOpacity onPress={() => { this.context.transitionBack()}}>
        <Text>
          Back
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { this.context.transitionTo('home')}}>
        <Text>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}

```

## Example - Usage ( Transitions )

The available transitions are as follows

```js
var ReactRouter = require('rn-router');
var { Transitions } = ReactRouter;

Transitions.FloatFromRight
Transitions.FloatFromLeft
Transitions.FloatFromBottom
Transitions.FloatFromBottomAndroid
Transitions.FadeAndroid
Transitions.HorizontalSwipeJump
Transitions.HorizontalSwipeJumpFromRight
Transitions.VerticalUpSwipeJump
Transitions.VerticalDownSwipeJump
Transitions.None
Transitions.Fade
```
