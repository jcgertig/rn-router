# rn-router
React Native routing system based on react router

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

var { Router, IndexRoute, Route } = ReactRouter;

var Routes = React.createClass({
  render: function() {
    return (
      <Router {...this.props}>
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

      <Link to='login' transition={Transitions.FloatFromLeft}><Text>Login</Text></Link> // Default transition is FloatFromRight
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
